import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  MessageSquare, 
  UserPlus, 
  Heart, 
  Check, 
  X, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Link2, 
  CheckCircle,
  Edit
} from "lucide-react";
import Image from "next/image";
import { EditProfileModal } from "./EditProfileModal";
import { EditProfilePictureModal } from "./EditProfilePictureModal";
import { useUserStore, useConnectionsStore } from "@/store";
import { getProfilePictureUrl, isProfilePictureUrl } from "@/lib/utils";
import {
  followUser,
  unfollowUser,
  getFollowerCount,
  getConnectionCount,
  User,
  Institution,
} from "@/lib/api";

interface ProfileHeaderProps {
  user: User | null;
  institution: Institution | null;
  currentUserId: string;
  onUserUpdate?: (updatedUser: User) => void;
}

export const ProfileHeader = ({
  user,
  institution,
  currentUserId,
  onUserUpdate,
}: ProfileHeaderProps) => {
  const { currentUser, fetchCurrentUser } = useUserStore();
  const { 
    getConnectionStatus,
    connectToUser,
    disconnectFromUser,
    acceptConnectionRequest,
    rejectConnectionRequest,
    fetchConnections
  } = useConnectionsStore();
  const router = useRouter();
  
  const [isFollowing, setIsFollowing] = useState(user?.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(user?.followers || 0);
  const [connectionsCount, setConnectionsCount] = useState(user?.connections || 0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState(user);
  const [isLoading, setIsLoading] = useState({
    follow: false,
    connect: false,
    accept: false,
    reject: false,
  });

  const isOwnProfile = currentUser?.id === user?.id;

  const connectionStatus = currentUser?.id && user?.id 
    ? getConnectionStatus(currentUser.id, user.id) 
    : 'none';

  const isConnected = connectionStatus === 'connected';
  const hasPendingRequest = connectionStatus === 'pending_sent';
  const hasIncomingRequest = connectionStatus === 'pending_received';

  const handleConnectionsClick = () => {
    if (isOwnProfile) {
      router.push('/my-networks?tab=connections');
    }
  };

  const handleFollowersClick = () => {
    if (isOwnProfile) {
      router.push('/my-networks?tab=followers');
    }
  };

  useEffect(() => {
    if (user) {
      setIsFollowing(user.isFollowing || false);
      setFollowersCount(user.followers || 0);
      setConnectionsCount(user.connections || 0);
    }
  }, [user]);

  // Fetch current user on mount
  useEffect(() => {
    if (!currentUser) {
      fetchCurrentUser();
    }
  }, [currentUser, fetchCurrentUser]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchConnections(currentUser.id);
    }
  }, [currentUser?.id, fetchConnections]);

  const handleFollow = async () => {
    if (!user?.id || !currentUser?.id || isLoading.follow || isOwnProfile) return;

    setIsLoading((prev) => ({ ...prev, follow: true }));
    try {
      if (isFollowing) {
        await unfollowUser({ user2_id: user.id });
        setFollowersCount((prev) => prev - 1);
      } else {
        await followUser({ user2_id: user.id });
        setFollowersCount((prev) => prev + 1);
      }
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, follow: false }));
    }
  };

  const handleConnect = async () => {
    if (!user?.id || !currentUser?.id || isLoading.connect || isOwnProfile)
      return;

    setIsLoading((prev) => ({ ...prev, connect: true }));
    try {
      if (isConnected || hasPendingRequest) {
        await disconnectFromUser(currentUser.id, user.id);
        if (isConnected) {
          setConnectionsCount((prev) => prev - 1);
        }
      } else {
        await connectToUser(currentUser.id, user.id);
      }
    } catch (error) {
      console.error("Error toggling connection:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, connect: false }));
    }
  };

  const handleAcceptConnection = async () => {
    if (!user?.id || !currentUser?.id || isLoading.accept || isOwnProfile) return;

    setIsLoading((prev) => ({ ...prev, accept: true }));
    try {
      await acceptConnectionRequest(currentUser.id, user.id);
      setConnectionsCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error accepting connection:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, accept: false }));
    }
  };

  const handleRejectConnection = async () => {
    if (!user?.id || !currentUser?.id || isLoading.reject || isOwnProfile) return;

    setIsLoading((prev) => ({ ...prev, reject: true }));
    try {
      await rejectConnectionRequest(currentUser.id, user.id);
    } catch (error) {
      console.error("Error rejecting connection:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, reject: false }));
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUserProfile(updatedUser);
    setFollowersCount(updatedUser.followers || 0);
    setConnectionsCount(updatedUser.connections || 0);
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
  };

  const handleProfilePictureUpdate = (newProfilePictureUrl: string) => {
    const updatedUser = {
      ...currentUserProfile,
      profile_picture: newProfilePictureUrl
    } as User;
    
    setCurrentUserProfile(updatedUser);
    
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
    
    // Trigger a refetch of current user data
    fetchCurrentUser();
  };

  const displayUser = currentUserProfile || user;

  // Get the proper profile picture URL
  const getDisplayProfilePicture = () => {
    if (!displayUser?.profile_picture) return "/pp.png";
    
    // If it's already a profile picture URL from our API, use it as is
    if (isProfilePictureUrl(displayUser.profile_picture)) {
      return displayUser.profile_picture;
    }
    
    // If it's a legacy URL or external URL, use it as is
    if (displayUser.profile_picture.startsWith('http') || displayUser.profile_picture.startsWith('/')) {
      return displayUser.profile_picture;
    }
    
    // Otherwise, assume it's just a filename and construct the URL
    return getProfilePictureUrl(displayUser.id, displayUser.profile_picture);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="relative h-32 sm:h-36">
        <Image
          src={displayUser?.banner_picture || "/banner.png"}
          alt="Cover photo"
          className="w-full h-full object-cover"
          width={1200}
          height={400}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        {/* {isOwnProfile && (
          <button className="absolute top-4 right-4 bg-black/50 hover:bg-black/60 text-white backdrop-blur-sm px-3 py-2 text-sm rounded-full flex items-center transition-colors">
            <Camera className="h-4 w-4 mr-2" />
            Edit cover
          </button>
        )} */}
        
        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage
                src={getDisplayProfilePicture()}
                alt={displayUser?.name || "User"}
              />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold">
                {displayUser?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <button
                onClick={() => setIsProfilePictureModalOpen(true)}
                className="absolute bottom-2 right-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-2 shadow-sm transition-colors cursor-pointer z-10"
              >
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="pt-16 pb-4 px-6 relative">
        <div className="absolute top-4 right-6 flex gap-2">
          {isOwnProfile ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="rounded-full">
                <MessageSquare className="h-4 w-4" />
              </Button>

            <Button
              variant={isFollowing ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={handleFollow}
              disabled={isLoading.follow}
            >
              <Heart
                className="h-4 w-4 mr-2"
                fill={isFollowing ? "currentColor" : "none"}
              />
              {isLoading.follow
                ? "Processing..."
                : isFollowing
                ? "Following"
                : "Follow"}
            </Button>

            {hasIncomingRequest ? (
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-full"
                  onClick={handleAcceptConnection}
                  disabled={isLoading.accept}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isLoading.accept ? "Accepting..." : "Accept"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={handleRejectConnection}
                  disabled={isLoading.reject}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant={
                  isConnected
                    ? "default"
                    : hasPendingRequest
                    ? "outline"
                    : "default"
                }
                size="sm"
                className="rounded-full"
                onClick={handleConnect}
                disabled={isLoading.connect}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {isLoading.connect
                  ? "Processing..."
                  : isConnected
                  ? "Disconnect"
                  : hasPendingRequest
                  ? "Request Sent"
                  : "Connect"}
              </Button>
            )}
            </>
          )}
        </div>
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 font-sans mt-4">
            {displayUser?.name || "Loading..."}
            {displayUser?.verified && (
              <CheckCircle className="h-5 w-5 text-blue-500" />
            )}
          </h1>
          {/* <p className="text-gray-500 text-sm">@{displayUser?.email?.split('@')[0] || 'username'}</p> */}
        </div>
        {displayUser?.bio && (
          <div className="mb-3">
            <p className="text-gray-900 leading-relaxed">{displayUser.bio}</p>
          </div>
        )}

        <div className="space-y-2 text-gray-500 text-sm mb-3">
          {displayUser?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{displayUser.location}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span>{displayUser?.role || "Healthcare Professional"}</span>
            {displayUser?.specialization && (
              <>
                <span className="mx-1">•</span>
                <GraduationCap className="h-4 w-4" />
                <span>{displayUser.specialization}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Link2 className="h-4 w-4" />
            <a href="#" className="text-blue-500 hover:underline">
              pharminc.com/profile
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div 
            className={`flex items-center gap-1 ${isOwnProfile ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
            onClick={handleConnectionsClick}
          >
            <span className="font-bold text-gray-900">{connectionsCount}</span>
            <span className="text-gray-500">Connections</span>
          </div>
          <div 
            className={`flex items-center gap-1 ${isOwnProfile ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
            onClick={handleFollowersClick}
          >
            <span className="font-bold text-gray-900">{followersCount}</span>
            <span className="text-gray-500">Followers</span>
          </div>
        </div>
      </div>

      {isOwnProfile && displayUser && (
        <EditProfilePictureModal
          isOpen={isProfilePictureModalOpen}
          onClose={() => setIsProfilePictureModalOpen(false)}
          currentProfilePicture={getDisplayProfilePicture()}
          userName={displayUser.name}
          userId={displayUser.id}
          isInstitute={!!institution}
          onUpdate={handleProfilePictureUpdate}
        />
      )}

      {/* Edit Profile Modal */}
      {isOwnProfile && displayUser && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={displayUser as any} // Type cast to handle different User types
          onUpdate={handleUserUpdate}
        />
      )}
    </div>
  );
};
