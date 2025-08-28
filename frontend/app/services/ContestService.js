// Service to fetch contests from backend API
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Automatically detect the correct API URL
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'ios') {
      return 'http://localhost:8080'; // iOS simulator can use localhost
    } else if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8080'; // Android emulator special IP
    } else {
      // Physical device or Expo Go
      const debuggerHost = Constants.expoConfig?.hostUri 
        ? Constants.expoConfig.hostUri.split(':').shift()
        : 'localhost';
      return `http://${debuggerHost}:8080`;
    }
  } else {
    // Production mode - replace with your actual server URL
    return 'https://your-production-server.com';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Debug log to see which URL is being used
console.log('🚀 API Base URL:', API_BASE_URL);

export const ContestService = {
  
  /**
   * Fetch all contests from backend
   */
  async getAllContests(userId = '200095') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'userid': userId,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.contests || [];
    } catch (error) {
      console.error('Error fetching contests:', error);
      throw error;
    }
  },

  /**
   * Fetch a specific contest by ID from backend
   */
  async getContestById(contestId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contests/${contestId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contest = await response.json();
      return contest;
    } catch (error) {
      console.error('Error fetching contest by ID:', error);
      throw error;
    }
  },

  /**
   * Group contests by title for sectioned display
   */
  groupContestsByTitle(contests) {
    const grouped = {};
    
    contests.forEach(contest => {
      const title = contest.title || 'Other';
      if (!grouped[title]) {
        grouped[title] = [];
      }
      grouped[title].push(contest);
    });

    // Convert to array format for SectionList
    return Object.keys(grouped).map(title => ({
      title: title,
      data: grouped[title],
    }));
  },

  /**
   * Join a contest on the backend; returns updated contest
   */
  async joinContest(contestId, userId = '200095') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contests/${contestId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': userId,
        },
      });
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      // console.error('Error joining contest:', error);
      throw error;
    }
  }
};
