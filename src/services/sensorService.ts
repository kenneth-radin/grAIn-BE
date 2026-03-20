import SensorData, { ISensorData } from '../models/SensorData';
import Device from '../models/Device';
import { firebaseDB } from '../config/firebase';
import { analyzeSensorData, generateOptimizationRecommendations } from './aiService';
import { addCommand } from './commandService';

export const processSensorData = async (sensorData: ISensorData): Promise<void> => {
  try {
    // Mark as processed
    sensorData.isProcessed = true;
    await sensorData.save();
    
    // Check thresholds
    const device = await Device.findOne({ deviceId: sensorData.deviceId });
    if (!device) return;
    
    const thresholds = {
      temperature: { min: 0, max: 80, warning: 70 },
      humidity: { min: 0, max: 100, warning: 85 },
      vibration: { min: 0, max: 5, warning: 3 },
    };
    
    const warnings = [];
    
    // Check for threshold violations
    if (sensorData.data.temperature) {
      if (sensorData.data.temperature > thresholds.temperature.warning) {
        warnings.push(`High temperature: ${sensorData.data.temperature}°C`);
        
        // Auto-stop if temperature is critical
        if (sensorData.data.temperature > thresholds.temperature.max && device.isRunning) {
          const command = await addCommand(sensorData.deviceId, {
            deviceId: sensorData.deviceId,
            type: 'stop',
            payload: { reason: 'Critical temperature detected' },
            status: 'pending',
          } as any);
        }
      }
    }
    
    if (sensorData.data.humidity && sensorData.data.humidity > thresholds.humidity.warning) {
      warnings.push(`High humidity: ${sensorData.data.humidity}%`);
    }
    
    if (sensorData.data.vibration && sensorData.data.vibration > thresholds.vibration.warning) {
      warnings.push(`High vibration: ${sensorData.data.vibration}`);
    }
    
    // Store warnings in Firebase
    if (warnings.length > 0) {
      await firebaseDB.ref(`alerts/${sensorData.deviceId}`).push({
        warnings,
        timestamp: Date.now(),
        sensorData: sensorData.data,
      });
    }
    
    // Run AI analysis periodically (every 10 readings)
    const readingCount = await SensorData.countDocuments({ deviceId: sensorData.deviceId });
    if (readingCount % 10 === 0) {
      const prediction = await analyzeSensorData(sensorData.deviceId);
      
      // Auto-start if AI recommends and device is in auto mode
      if (prediction.shouldStart && device.currentMode === 'auto' && !device.isRunning) {
        await addCommand(sensorData.deviceId, {
          deviceId: sensorData.deviceId,
          type: 'start',
          payload: { reason: prediction.reason, confidence: prediction.confidence },
          status: 'pending',
        } as any);
      }
      
      // Generate optimization recommendations
      await generateOptimizationRecommendations(sensorData.deviceId);
    }
  } catch (error) {
    console.error('Error processing sensor data:', error);
  }
};

export const getLatestSensorData = async (deviceId: string): Promise<ISensorData | null> => {
  try {
    const latestData = await SensorData.findOne({ deviceId })
      .sort({ timestamp: -1 });
    return latestData;
  } catch (error) {
    console.error('Error getting latest sensor data:', error);
    return null;
  }
};

export const getSensorStats = async (deviceId: string, hours: number = 24): Promise<any> => {
  try {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const data = await SensorData.find({
      deviceId,
      timestamp: { $gte: since },
    }).sort({ timestamp: 1 });
    
    if (data.length === 0) return null;
    
    // Calculate statistics
    const stats = {
      temperature: { min: Infinity, max: -Infinity, avg: 0, count: 0 },
      humidity: { min: Infinity, max: -Infinity, avg: 0, count: 0 },
      vibration: { min: Infinity, max: -Infinity, avg: 0, count: 0 },
      power: { min: Infinity, max: -Infinity, avg: 0, count: 0 },
    };
    
    data.forEach(reading => {
      if (reading.data.temperature !== undefined) {
        stats.temperature.min = Math.min(stats.temperature.min, reading.data.temperature);
        stats.temperature.max = Math.max(stats.temperature.max, reading.data.temperature);
        stats.temperature.avg += reading.data.temperature;
        stats.temperature.count++;
      }
      
      if (reading.data.humidity !== undefined) {
        stats.humidity.min = Math.min(stats.humidity.min, reading.data.humidity);
        stats.humidity.max = Math.max(stats.humidity.max, reading.data.humidity);
        stats.humidity.avg += reading.data.humidity;
        stats.humidity.count++;
      }
      
      if (reading.data.vibration !== undefined) {
        stats.vibration.min = Math.min(stats.vibration.min, reading.data.vibration);
        stats.vibration.max = Math.max(stats.vibration.max, reading.data.vibration);
        stats.vibration.avg += reading.data.vibration;
        stats.vibration.count++;
      }
      
      if (reading.data.power !== undefined) {
        stats.power.min = Math.min(stats.power.min, reading.data.power);
        stats.power.max = Math.max(stats.power.max, reading.data.power);
        stats.power.avg += reading.data.power;
        stats.power.count++;
      }
    });
    
    // Calculate averages
    Object.keys(stats).forEach(key => {
      if (stats[key as keyof typeof stats].count > 0) {
        stats[key as keyof typeof stats].avg /= stats[key as keyof typeof stats].count;
      }
    });
    
    return {
      stats,
      sampleCount: data.length,
      timeRange: `${hours} hours`,
    };
  } catch (error) {
    console.error('Error getting sensor stats:', error);
    return null;
  }
};