import { useState, useEffect } from "react";
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
  CheckCircle 
} from "lucide-react";
import Image from "next/image";
import {
  followUser,
  unfollowUser,
  getFollowerCount,
  connectUser,
  disconnectUser,
  acceptConnection,
  getConnectionCount,
  getUserConnections,
  getUserFollowers,
  User,
  Institution,
} from "@/lib/api";

interface ProfileHeaderProps {
  user: User | null;
  institution: Institution | null;
  currentUserId: string;
}

export const ProfileHeader = ({
  user,
  institution,
  currentUserId,
}: ProfileHeaderProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(user?.followers || 0);
  const [isConnected, setIsConnected] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [hasIncomingRequest, setHasIncomingRequest] = useState(false);
  const [connectionsCount, setConnectionsCount] = useState(
    user?.connections || 0
  );
  const [isLoading, setIsLoading] = useState({
    follow: false,
    connect: false,
    accept: false,
    reject: false,
  });

  // Don't show buttons if viewing own profile
  const isOwnProfile = currentUserId === user?.id;

  // Check initial follow and connection status
  useEffect(() => {
    const checkStatus = async () => {
      if (!user?.id || !currentUserId || isOwnProfile) return;

      try {
        // Check follow status
        const followers = await getUserFollowers(user.id);
        const isFollowing = followers.some((f) => f.user1Id === currentUserId);
        setIsFollowing(isFollowing);

        // Get followers count
        const followersCountData = await getFollowerCount(user.id);
        setFollowersCount(followersCountData.followersCount);

        // Check connection status
        const connections = await getUserConnections(user.id);
        const connection = connections.find(
          (c) =>
            (c.user1Id === currentUserId && c.user2_id === user.id) ||
            (c.user1Id === user.id && c.user2_id === currentUserId)
        );

        if (connection) {
          if (connection.accepted) {
            setIsConnected(true);
            setHasPendingRequest(false);
            setHasIncomingRequest(false);
          } else {
            // Check if current user sent the request or received it
            if (connection.user1Id === currentUserId) {
              // Current user sent the request
              setHasPendingRequest(true);
              setHasIncomingRequest(false);
            } else {
              // Current user received the request
              setHasIncomingRequest(true);
              setHasPendingRequest(false);
            }
          }
        }

        // Get connections count
        const connectionsCountData = await getConnectionCount(user.id);
        setConnectionsCount(connectionsCountData.connectionsCount);
      } catch (error) {
        console.error("Error checking status:", error);
      }
    };

    checkStatus();
  }, [user?.id, currentUserId, isOwnProfile]);

  const handleFollow = async () => {
    if (!user?.id || !currentUserId || isLoading.follow || isOwnProfile) return;

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
    if (!user?.id || !currentUserId || isLoading.connect || isOwnProfile)
      return;

    setIsLoading((prev) => ({ ...prev, connect: true }));
    try {
      if (isConnected || hasPendingRequest) {
        await disconnectUser({ user2_id: user.id });
        setIsConnected(false);
        setHasPendingRequest(false);
        if (isConnected) {
          setConnectionsCount((prev) => prev - 1);
        }
      } else {
        await connectUser({ user2_id: user.id });
        setHasPendingRequest(true);
      }
    } catch (error) {
      console.error("Error toggling connection:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, connect: false }));
    }
  };

  const handleAcceptConnection = async () => {
    if (!user?.id || !currentUserId || isLoading.accept || isOwnProfile) return;

    setIsLoading((prev) => ({ ...prev, accept: true }));
    try {
      await acceptConnection(user.id);
      setIsConnected(true);
      setHasIncomingRequest(false);
      setConnectionsCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error accepting connection:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, accept: false }));
    }
  };

  const handleRejectConnection = async () => {
    if (!user?.id || !currentUserId || isLoading.reject || isOwnProfile) return;

    setIsLoading((prev) => ({ ...prev, reject: true }));
    try {
      await disconnectUser({ user2_id: user.id });
      setHasIncomingRequest(false);
    } catch (error) {
      console.error("Error rejecting connection:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, reject: false }));
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      {/* Cover Photo */}
      <div className="relative h-32 sm:h-36 md:h-40">
        <Image
          src={user?.banner_picture || "/banner.png"}
          alt="Cover photo"
          className="w-full h-full object-cover"
          width={1200}
          height={400}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        {isOwnProfile && (
          <button className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/50 hover:bg-black/60 text-white backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-full flex items-center transition-colors">
            <Camera className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Edit cover</span>
          </button>
        )}
        
        {/* Profile Picture - Overlapping */}
        <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-6">
          <div className="relative">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-lg">
              <AvatarImage
                src={user?.profile_picture || "/pp.png"}
                alt={user?.name || "User"}
              />
              <AvatarFallback className="text-lg sm:text-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold">
                {user?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <button className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-1 sm:p-2 shadow-sm transition-colors">
                <Camera className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="pt-16 pb-4 px-6 relative">
        {!isOwnProfile && (
          <div className="absolute top-4 right-6 flex gap-2">
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
                  ? "Connected"
                  : hasPendingRequest
                  ? "Request Sent"
                  : "Connect"}
              </Button>
            )}
          </div>
        )}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 font-sans mt-4">
            {user?.name || "Loading..."}
            {user?.verified && (
              <CheckCircle className="h-5 w-5 text-blue-500 fill-current" />
            )}
          </h1>
          <p className="text-gray-500 text-sm">@{user?.email?.split('@')[0] || 'username'}</p>
        </div>
        {user?.bio && (
          <div className="mb-3">
            <p className="text-gray-900 leading-relaxed">{user.bio}</p>
          </div>
        )}

        <div className="space-y-2 text-gray-500 text-sm mb-3">
          {user?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span>{user?.role || "Healthcare Professional"}</span>
            {user?.specialization && (
              <>
                <span className="mx-1">•</span>
                <GraduationCap className="h-4 w-4" />
                <span>{user.specialization}</span>
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
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-900">{connectionsCount}</span>
            <span className="text-gray-500">Connections</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-900">{followersCount}</span>
            <span className="text-gray-500">Followers</span>
          </div>
        </div>
      </div>
    </div>
  );
};
