import { firebaseDB } from '../config/firebase';
import Command from '../models/Command';
import { ICommand } from '../models/Command';

export const addCommand = async (deviceId: string, command: ICommand): Promise<void> => {
  try {
    // Store in Firebase Realtime Database for real-time command queue
    const commandRef = firebaseDB.ref(`commands/${deviceId}/${command._id}`);
    
    await commandRef.set({
      id: command._id,
      type: command.type,
      payload: command.payload,
      status: command.status,
      createdAt: command.createdAt.toISOString(),
    });
    
    // Also maintain a queue reference for the latest commands
    const queueRef = firebaseDB.ref(`commandQueue/${deviceId}`);
    const queue = await queueRef.once('value');
    let currentQueue = queue.val() || [];
    
    // Add to queue (FIFO)
    currentQueue.push({
      id: command._id,
      type: command.type,
      payload: command.payload,
      createdAt: command.createdAt.toISOString(),
    });
    
    // Keep only last 100 commands in queue
    if (currentQueue.length > 100) {
      currentQueue = currentQueue.slice(-100);
    }
    
    await queueRef.set(currentQueue);
  } catch (error) {
    console.error('Error adding command to Firebase:', error);
    throw error;
  }
};

export const markCommandAsSent = async (deviceId: string, commandId: string): Promise<void> => {
  try {
    // Update in MongoDB
    await Command.findByIdAndUpdate(commandId, { status: 'sent' });
    
    // Update in Firebase
    await firebaseDB.ref(`commands/${deviceId}/${commandId}/status`).set('sent');
    
    // Remove from queue
    const queueRef = firebaseDB.ref(`commandQueue/${deviceId}`);
    const queue = await queueRef.once('value');
    const currentQueue = queue.val() || [];
    
    const updatedQueue = currentQueue.filter((cmd: any) => cmd.id !== commandId);
    await queueRef.set(updatedQueue);
  } catch (error) {
    console.error('Error marking command as sent:', error);
    throw error;
  }
};

export const getCommandFromQueue = async (deviceId: string): Promise<any> => {
  try {
    const queueRef = firebaseDB.ref(`commandQueue/${deviceId}`);
    const snapshot = await queueRef.once('value');
    const queue = snapshot.val() || [];
    
    return queue.length > 0 ? queue[0] : null;
  } catch (error) {
    console.error('Error getting command from queue:', error);
    throw error;
  }
};