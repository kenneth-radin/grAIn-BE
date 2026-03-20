import SensorData from '../models/SensorData';
import Device from '../models/Device';
import Command from '../models/Command';
import { addCommand } from './commandService';

interface PredictionResult {
  shouldStart: boolean;
  confidence: number;
  reason: string;
  recommendedMode?: 'auto' | 'manual' | 'eco';
}

export const analyzeSensorData = async (deviceId: string): Promise<PredictionResult> => {
  try {
    // Get recent sensor data for the device
    const recentData = await SensorData.find({ deviceId })
      .sort({ timestamp: -1 })
      .limit(100);
    
    if (recentData.length === 0) {
      return {
        shouldStart: false,
        confidence: 0,
        reason: 'No sensor data available',
      };
    }
    
    // Calculate averages
    let avgTemperature = 0;
    let avgHumidity = 0;
    let avgVibration = 0;
    let avgPower = 0;
    
    recentData.forEach(data => {
      if (data.data.temperature) avgTemperature += data.data.temperature;
      if (data.data.humidity) avgHumidity += data.data.humidity;
      if (data.data.vibration) avgVibration += data.data.vibration;
      if (data.data.power) avgPower += data.data.power;
    });
    
    avgTemperature /= recentData.length;
    avgHumidity /= recentData.length;
    avgVibration /= recentData.length;
    avgPower /= recentData.length;
    
    // AI Logic for prediction
    let shouldStart = false;
    let confidence = 0;
    let reason = '';
    let recommendedMode: 'auto' | 'manual' | 'eco' = 'auto';
    
    // Example logic - you can replace with actual ML model
    if (avgHumidity > 70) {
      shouldStart = true;
      confidence = 0.85;
      reason = 'High humidity detected, drying needed';
      recommendedMode = 'auto';
    } else if (avgTemperature < 18) {
      shouldStart = true;
      confidence = 0.75;
      reason = 'Low temperature detected, heating needed';
      recommendedMode = 'eco';
    } else if (avgVibration > 0.5) {
      shouldStart = false;
      confidence = 0.9;
      reason = 'High vibration detected, possible mechanical issue';
      recommendedMode = 'manual';
    } else {
      shouldStart = false;
      confidence = 0.6;
      reason = 'Normal operating conditions';
      recommendedMode = 'auto';
    }
    
    // Store AI prediction in Firebase for real-time monitoring
    const firebaseDB = (await import('../config/firebase')).firebaseDB;
    await firebaseDB.ref(`aiPredictions/${deviceId}`).set({
      shouldStart,
      confidence,
      reason,
      recommendedMode,
      timestamp: Date.now(),
      averages: {
        temperature: avgTemperature,
        humidity: avgHumidity,
        vibration: avgVibration,
        power: avgPower,
      },
    });
    
    return {
      shouldStart,
      confidence,
      reason,
      recommendedMode,
    };
  } catch (error) {
    console.error('Error in AI analysis:', error);
    return {
      shouldStart: false,
      confidence: 0,
      reason: 'Error in analysis',
    };
  }
};

export const generateOptimizationRecommendations = async (deviceId: string): Promise<any> => {
  try {
    const device = await Device.findOne({ deviceId });
    if (!device) return null;
    
    const sensorData = await SensorData.find({ deviceId })
      .sort({ timestamp: -1 })
      .limit(1000);
    
    // Calculate energy efficiency
    let totalPower = 0;
    let totalRuntime = 0;
    let cycles = 0;
    
    const commands = await Command.find({
      deviceId,
      type: 'start',
      status: 'delivered',
    }).sort({ createdAt: -1 }).limit(50);
    
    // Simple optimization logic
    const recommendations = [];
    
    if (sensorData.length > 0) {
      const avgPowerConsumption = sensorData.reduce((sum, data) => sum + (data.data.power || 0), 0) / sensorData.length;
      
      if (avgPowerConsumption > 1000) {
        recommendations.push({
          type: 'energy',
          message: 'High power consumption detected. Consider using eco mode.',
          impact: 'high',
        });
      }
    }
    
    if (commands.length > 0) {
      const frequentStarts = commands.length > 10;
      if (frequentStarts) {
        recommendations.push({
          type: 'operation',
          message: 'Frequent start/stop cycles detected. Consider batch processing.',
          impact: 'medium',
        });
      }
    }
    
    // Store recommendations in Firebase
    const firebaseDB = (await import('../config/firebase')).firebaseDB;
    await firebaseDB.ref(`recommendations/${deviceId}`).set({
      recommendations,
      timestamp: Date.now(),
    });
    
    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return null;
  }
};