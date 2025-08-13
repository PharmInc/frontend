import { networkApi } from "@/lib/api/axios/api";
import { Follow, FollowParams, Connect, ConnectParams } from "@/lib/api/types";

// Follow endpoints
export const followUser = async (params: FollowParams): Promise<Follow> => {
  console.log("Following user with params:", params);
  const response = await networkApi.post("/private/follow", params);
  return response.data;
};

export const unfollowUser = async (params: FollowParams): Promise<void> => {
  await networkApi.delete("/private/follow", { data: params });
};

export const getUserFollowers = async (userId: string): Promise<Follow[]> => {
  const response = await networkApi.get(`/public/follow/${userId}/followers`);
  return response.data;
};

export const getFollowerCount = async (
  userId: string
): Promise<{ userId: string; followersCount: number }> => {
  const response = await networkApi.get(`/public/follow/${userId}/followers/count`);
  return response.data;
};

// Connect endpoints
export const connectUser = async (params: ConnectParams): Promise<Connect> => {
  const response = await networkApi.post("/private/connect", params);
  return response.data;
};

export const disconnectUser = async (params: ConnectParams): Promise<void> => {
  await networkApi.delete("/private/connect", { data: params });
};

export const acceptConnection = async (user1Id: string): Promise<Connect> => {
  const response = await networkApi.put("/private/connect/accept", { user1Id });
  return response.data;
};

export const getUserConnections = async (
  userId: string
): Promise<Connect[]> => {
  const response = await networkApi.get(`/public/connect/${userId}/connects`);
  return response.data;
};

export const getConnectionCount = async (
  userId: string
): Promise<{ userId: string; connectionsCount: number }> => {
  const response = await networkApi.get(`/public/connect/${userId}/connects/count`);
  return response.data;
};
