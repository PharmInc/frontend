import { ApiError } from '../types/api';

// Remove the old API_BASE_URL since it's no longer used
const TOKEN_KEY = 'pharminc_auth_token';

/**
 * API Client class for handling HTTP requests with JWT authentication
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a PATCH request
   */
  public async patch<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
      mode: 'cors',
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Get the stored JWT token
   */
  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Set the JWT token in localStorage
   */
  public setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Remove the JWT token from localStorage
   */
  public clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Get default headers for API requests
   */
  private getHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (includeAuth) {
      const token = this.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorDetails: any = undefined;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errorDetails = errorData;
      } catch {
        // Could not parse error JSON
      }

      // Construct an ApiError object
      const error: ApiError = Object.assign(new Error(errorMessage), {
        status: response.status,
        details: errorDetails,
        name: 'ApiError',
      });

      throw error;
    }

    if (response.status === 204) {
      // No Content
      return {} as T;
    }

    try {
      return await response.json();
    } catch {
      // No JSON body
      return {} as T;
    }
  }

  /**
   * Make a GET request
   */
  public async get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(includeAuth),
      mode: 'cors',
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Make a POST request
   */
  public async post<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
      mode: 'cors',
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Make a PUT request
   */
  public async put<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
      mode: 'cors',
    });
    return this.handleResponse<T>(response);
  }

  /**
   * Make a DELETE request
   */
  public async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(includeAuth),
      mode: 'cors',
    });
    return this.handleResponse<T>(response);
  }
}

// Export clients for each service using the new URLs
export const authApiClient = new ApiClient('https://auth.api.pharminc.in');
export const userApiClient = new ApiClient('https://user.api.pharminc.in');
export const networkApiClient = new ApiClient('https://network.api.pharminc.in');
export const backgroundApiClient = new ApiClient('https://background.api.pharminc.in');
export const instituteApiClient = new ApiClient('https://institute.api.pharminc.in');
export const jobApiClient = new ApiClient('https://job.api.pharminc.in');
export const contentApiClient = new ApiClient('https://content.api.pharminc.in');
