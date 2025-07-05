import { getToken, getRefreshToken, storeTokens, removeTokens } from './storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    profile_picture_url?: string;
    preferences: Record<string, any>;
    created_at: string;
    updated_at: string;
  };
  token: string;
  refreshToken: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base fetch function with error handling
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      'Network error. Please check your connection and try again.',
      0
    );
  }
}

// Authenticated fetch function
async function authenticatedFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = await getToken();
  
  if (!token) {
    throw new ApiError('No authentication token found', 401);
  }

  try {
    return await apiFetch<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Try to refresh token
      try {
        await refreshAuthToken();
        const newToken = await getToken();
        
        if (newToken) {
          return await apiFetch<T>(endpoint, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        }
      } catch (refreshError) {
        // Refresh failed, clear auth data
        await removeTokens();
        throw new ApiError('Session expired. Please log in again.', 401);
      }
    }
    
    throw error;
  }
}

// Authentication API functions
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (response.success && response.data) {
    return response.data;
  }

  throw new ApiError(response.message || 'Registration failed', 400);
}

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (response.success && response.data) {
    return response.data;
  }

  throw new ApiError(response.message || 'Login failed', 401);
}

export async function refreshAuthToken(): Promise<void> {
  const refreshToken = await getRefreshToken();
  
  if (!refreshToken) {
    throw new ApiError('No refresh token found', 401);
  }

  const response = await apiFetch<{ token: string; refreshToken: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (response.success && response.data) {
    await storeTokens(response.data.token, response.data.refreshToken);
  } else {
    throw new ApiError(response.message || 'Token refresh failed', 401);
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await authenticatedFetch('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    // Even if logout fails on server, clear local data
    console.warn('Logout request failed:', error);
  } finally {
    await removeTokens();
  }
}

export async function getUserProfile() {
  const response = await authenticatedFetch('/users/profile');
  
  if (response.success && response.data) {
    return response.data.user;
  }

  throw new ApiError(response.message || 'Failed to get user profile', 400);
}