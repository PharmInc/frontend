import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Heart, Share2, Bookmark, MessageSquare } from "lucide-react";
import { getUserPosts } from "@/lib/api/services/content";
import { Post, PaginatedResponse } from "@/lib/api/types";

interface ProfilePostsTabProps {
  userId: string;
}

export const ProfilePostsTab = ({ userId }: ProfilePostsTabProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    hasNext: false,
    totalPages: 0,
    total: 0
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response: PaginatedResponse<Post> = await getUserPosts(userId, 1, 10);
        setPosts(response.data);
        setPagination({
          page: response.pagination.page,
          hasNext: response.pagination.hasNext,
          totalPages: response.pagination.totalPages,
          total: response.pagination.total
        });
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-xl p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No posts yet</p>
            <p className="text-sm">This user hasn't shared any posts.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-xs">
      <CardContent className="p-6">
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-xl p-4 hover:border-blue-200 transition-colors">
              <h3 className="font-semibold text-lg mb-2">
                {post.title}
              </h3>
              <p className="text-gray-700 mb-3 overflow-hidden" style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical' as any,
                textOverflow: 'ellipsis'
              }}>
                {post.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.reactions || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>{post.shares || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark className="h-4 w-4" />
                    <span>{post.saves || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {pagination.total > 0 && (
            <div className="text-center text-sm text-gray-500 pt-4 border-t">
              Showing {posts.length} of {pagination.total} posts
              {pagination.hasNext && (
                <button className="ml-2 text-blue-500 hover:text-blue-600">
                  Load more
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
