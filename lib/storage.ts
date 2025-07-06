import { Platform } from 'react-native';

// Storage interface for consistent API
interface StorageInterface {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  multiSet: (keyValuePairs: [string, string][]) => Promise<void>;
  multiRemove: (keys: string[]) => Promise<void>;
}

// Get appropriate storage implementation
const getStorage = (): StorageInterface => {
  // For web platform
  if (Platform.OS === 'web') {
    // Check if we're in a browser environment with proper globals
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      return {
        getItem: async (key: string) => {
          try {
            return window.localStorage.getItem(key);
          } catch {
            return null;
          }
        },
        setItem: async (key: string, value: string) => {
          try {
            window.localStorage.setItem(key, value);
          } catch {
            // Silently fail if localStorage is not available
          }
        },
        removeItem: async (key: string) => {
          try {
            window.localStorage.removeItem(key);
          } catch {
            // Silently fail if localStorage is not available
          }
        },
        multiSet: async (keyValuePairs: [string, string][]) => {
          try {
            keyValuePairs.forEach(([key, value]) => {
              window.localStorage.setItem(key, value);
            });
          } catch {
            // Silently fail if localStorage is not available
          }
        },
        multiRemove: async (keys: string[]) => {
          try {
            keys.forEach(key => {
              window.localStorage.removeItem(key);
            });
          } catch {
            // Silently fail if localStorage is not available
          }
        },
      };
    } else {
      // Server-side rendering or localStorage not available - return mock
      return {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {},
        multiSet: async () => {},
        multiRemove: async () => {},
      };
    }
  } else {
    // For React Native platforms, use AsyncStorage
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return AsyncStorage;
  }
};

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export interface StoredUser {
  id: string;
  email: string;
  username: string;
  profile_picture_url?: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Token management
export const storeTokens = async (token: string, refreshToken: string): Promise<void> => {
  try {
    const AsyncStorage = getStorage();
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [REFRESH_TOKEN_KEY, refreshToken]
    ]);
  } catch (error) {
    console.error('Error storing tokens:', error);
    throw new Error('Failed to store authentication tokens');
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const AsyncStorage = getStorage();
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const AsyncStorage = getStorage();
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const removeTokens = async (): Promise<void> => {
  try {
    const AsyncStorage = getStorage();
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  } catch (error) {
    console.error('Error removing tokens:', error);
  }
};

// User data management
export const storeUser = async (user: StoredUser): Promise<void> => {
  try {
    const AsyncStorage = getStorage();
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user data:', error);
    throw new Error('Failed to store user data');
  }
};

export const getUser = async (): Promise<StoredUser | null> => {
  try {
    const AsyncStorage = getStorage();
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    const AsyncStorage = getStorage();
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

// Clear all auth data
export const clearAuthData = async (): Promise<void> => {
  try {
    const AsyncStorage = getStorage();
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    const user = await getUser();
    return !!(token && user);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};