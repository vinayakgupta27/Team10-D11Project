// Enhanced countdown store with persistence and recovery
import AsyncStorage from '@react-native-async-storage/async-storage';

const listeners = new Set();
let targetTimeMs = null; // epoch ms for match start
let intervalId = null;
let isRecovered = false;

function tick() {
  // Only notify if timer is still active
  if (targetTimeMs && Date.now() < targetTimeMs) {
    listeners.forEach((l) => l());
  } else if (targetTimeMs && Date.now() >= targetTimeMs) {
    // Timer expired, notify and cleanup
    listeners.forEach((l) => l());
    CountdownStore.stop();
  }
}

export const CountdownStore = {
  async setTarget(timeMs) {
    targetTimeMs = timeMs;
    
    // Persist timer state
    try {
      await AsyncStorage.setItem('matchStartTime', timeMs.toString());
      await AsyncStorage.setItem('timerSetAt', Date.now().toString());
    } catch (error) {
      console.warn('Failed to persist timer state:', error);
    }
    
    if (!intervalId) {
      intervalId = setInterval(tick, 1000);
    }
  },

  async recover() {
    if (isRecovered) return;
    
    try {
      const stored = await AsyncStorage.getItem('matchStartTime');
      const setAt = await AsyncStorage.getItem('timerSetAt');
      
      if (stored && setAt) {
        const storedTime = parseInt(stored);
        const setTime = parseInt(setAt);
        
        // Only recover if timer is still valid and not too old
        if (storedTime > Date.now() && (Date.now() - setTime) < 24 * 60 * 60 * 1000) {
          targetTimeMs = storedTime;
          if (!intervalId) {
            intervalId = setInterval(tick, 1000);
          }
        } else {
          // Clear expired timer data
          await this.clearPersisted();
        }
      }
    } catch (error) {
      console.warn('Failed to recover timer state:', error);
    }
    
    isRecovered = true;
  },

  async clearPersisted() {
    try {
      await AsyncStorage.removeItem('matchStartTime');
      await AsyncStorage.removeItem('timerSetAt');
    } catch (error) {
      console.warn('Failed to clear timer state:', error);
    }
  },

  getRemaining() {
    if (!targetTimeMs) return 0;
    return Math.max(0, targetTimeMs - Date.now());
  },

  isExpired() {
    return targetTimeMs ? Date.now() >= targetTimeMs : false;
  },

  stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getListenerCount() {
    return listeners.size;
  }
};


