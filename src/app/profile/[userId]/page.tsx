import { getUserById, getUser, getAuthToken, User } from "@/lib/api";
import { ProfilePageClient } from "./ProfilePageClient";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  
  try {
    const profileData = await getUserById(userId);
    
    // Get current user ID from token or API
    let currentUserId: string | null = null;
    try {
      const token = getAuthToken();
      if (token) {
        try {
          // First try to decode from JWT token
          const payload = JSON.parse(atob(token.split(".")[1]));
          const userIdFromToken = payload.userId || payload.sub || payload.id;
          if (userIdFromToken) {
            currentUserId = userIdFromToken;
          }
        } catch (error) {
          console.warn("Error decoding token, fetching user data:", error);
        }

        // If token decode fails, fetch current user data
        if (!currentUserId) {
          try {
            const currentUser = await getUser();
            currentUserId = currentUser.id;
          } catch (error) {
            console.error("Error fetching current user:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error getting current user ID:", error);
    }
    
    return <ProfilePageClient profileData={profileData} currentUserId={currentUserId} userId={userId} />;
  } catch (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-700">Profile not found</div>
      </div>
    );
  }
}
