import { networkApiClient } from './apiClient';
import {
  Connection,
  CreateConnectionRequest,
  AcceptConnectionRequest,
  ApiError,
} from '../types/api';

/**
 * Connection service for handling connection operations
 */
export class ConnectionService {
  /**
   * Create a new connection request
   * @param connectionData - Connection data
   * @returns Promise containing the created connection
   * @throws ApiError if creation fails
   */
  async createConnection(connectionData: CreateConnectionRequest): Promise<Connection> {
    return networkApiClient.post<Connection>('/private/connect', connectionData);
  }

  /**
   * Delete a connection by ID
   * @param connectionId - Connection ID
   * @returns Promise that resolves when deletion is successful
   * @throws ApiError if deletion fails
   */
  async deleteConnection(connectionId: string): Promise<void> {
    // Usually, DELETE expects an identifier in the body or as a query param.
    await networkApiClient.delete<void>(`/private/connect?id=${encodeURIComponent(connectionId)}`);
  }

  /**
   * Accept a connection request
   * @param data - AcceptConnectionRequest (should contain connectionId)
   * @returns Promise containing the updated connection
   * @throws ApiError if update fails
   */
  async acceptConnection(data: AcceptConnectionRequest): Promise<Connection> {
    return networkApiClient.put<Connection>('/private/connect/accept', data);
  }

  /**
   * Get all connections for a user
   * @param userId - User ID
   * @returns Promise containing list of connections
   * @throws ApiError if request fails
   */
  async getConnectionsByUser(userId: string): Promise<Connection[]> {
    return networkApiClient.get<Connection[]>(`/public/connect/${userId}/connects`);
  }

  /**
   * Get all accepted connections for a user
   * @param userId - User ID
   * @returns Promise containing list of accepted connections
   * @throws ApiError if request fails
   */
  async getAcceptedConnectionsByUser(userId: string): Promise<Connection[]> {
    return networkApiClient.get<Connection[]>(`/public/connect/${userId}/connects/accepted`);
  }
}

export const connectionService = new ConnectionService();
