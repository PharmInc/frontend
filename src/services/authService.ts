import { authApiClient } from './apiClient';
import { LoginRequest, RegisterRequest } from '../types/api';

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  specialty: string;
  userType: 'doctor' | 'healthcare' | 'institution';
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    specialty: string;
  };
}

/**
 * Authentication service for handling user login and registration
 */
export class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<{ token: string; userId: string }> {
    try {
      // Adjusted endpoint to new API
      const response = await authApiClient.post<{ token: string; userId: string }>(
        '/public/login',
        {
          email: credentials.email,
          password: credentials.password,
          type: credentials.type || 'user', // default to 'user' if not provided
        },
        false
      );

      if (response && response.token) {
        authApiClient.setToken(response.token);
        return response; // { token, userId }
      }
      throw new Error('Invalid email or password. Please check your credentials and try again.');
    } catch (error: any) {
      throw new Error(error?.message || 'Login error');
    }
  }

  /**
   * Register a new user (sign up)
   * Accepts any 200/201 or message as success, does NOT expect token or success field
   */
  async signup(userData: SignupRequest): Promise<void> {
    try {
      // Map SignupRequest to new API expected fields
      const requestBody = {
        email: userData.email,
        password: userData.password,
        type: userData.userType || 'user', // map userType to type
      };

      const response = await authApiClient.post('/public/register', requestBody, false);

      // Accept empty response, string, or message as success
      if (
        response === undefined ||
        response === null ||
        (typeof response === 'object' && Object.keys(response).length === 0) ||
        typeof response === 'string' ||
        (typeof response === 'object' && 'message' in response)
      ) {
        return;
      } else {
        throw new Error('Signup failed');
      }
    } catch (error: any) {
      throw new Error(error?.message || 'Signup error');
    }
  }

  /**
   * Register a new user (legacy method name for compatibility)
   */
  async register(userData: RegisterRequest): Promise<void> {
    // Assuming RegisterRequest has email, password, and type
    const requestBody = {
      email: userData.email,
      password: userData.password,
      type: userData.type || 'user',
    };
    await authApiClient.post<void>('/public/register', requestBody, false);
  }

  /**
   * Logout user by clearing the stored JWT token
   */
  logout(): void {
    authApiClient.clearToken(); // Clears 'pharminc_auth_token'
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return localStorage.getItem('pharminc_auth_token') !== null;
  }
}

export const authService = new AuthService();
