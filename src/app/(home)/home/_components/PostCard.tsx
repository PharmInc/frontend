"use client";

import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreVertical,
} from "lucide-react";
import { Post } from "./types";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePostStore } from "@/store/postStore";
import ExpandedComments from "./ExpandedComments";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { toggleLike, liked, sharePost, savePost, saved } = usePostStore();
  
  const handleLikeClick = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      toggleLike(post.id);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleShareClick = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      await sharePost(post.id);
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.author}`,
          text: post.content,
          url: `${window.location.origin}/post/${post.id}`
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share post:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleSaveClick = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      savePost(post.id);
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const maxLength = 300; 
  const shouldTruncate = post.content.length > maxLength;
  const displayContent = isExpanded || !shouldTruncate
    ? post.content
    : post.content.substring(0, maxLength) + "...";

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex flex-col gap-2 font-sans">
        <div className="flex items-center gap-3">
          <img
            src={post.avatar}
            alt={post.author}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm text-gray-900 font-sans">
              {post.author}
            </span>
            <span className="text-xs text-gray-500 font-sans">
              {post.role} • {post.time}
            </span>
          </div>
          <div className="ml-auto">
            <button className="h-7 w-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {post.title && (
          <h3 className="font-semibold text-gray-900 text-sm font-sans">{post.title}</h3>
        )}

        <div className="text-sm text-gray-800 whitespace-pre-wrap break-words font-sans">
          {displayContent}
          {shouldTruncate && (
            <button
              onClick={toggleExpand}
              className="text-blue-600 hover:text-blue-800 ml-1 text-sm font-medium font-sans"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {post.image && (
          <div className="rounded-lg overflow-hidden border border-gray-100">
            <Image width={1024} height={1024} src={post.image} alt="post" className="w-full h-auto aspect-auto" />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-sans"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-xs text-blue-700 font-medium font-sans">
          {post.type === "Research Paper" ? "📄 Research Paper" : "🩺 Case Study"}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-2 font-sans">
          <span>{post.likes} likes</span>
          <span>{post.comments} comments</span>
          <span>{post.shares} shares</span>
        </div>

        <div className="flex border-t border-gray-100 mt-2 pt-2 gap-1">
          <button
            onClick={handleLikeClick}
            disabled={isLiking}
            className="flex-1 text-gray-600 hover:text-red-600 hover:bg-red-50 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors disabled:opacity-70 font-sans"
          >
            <Heart className={`h-4 w-4 ${liked[post.id] ? "fill-red-500 text-red-500" : ""}`} />
            {isLiking ? "..." : "Like"}
          </button>
          <button
            onClick={handleCommentClick}
            className="flex-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors font-sans"
          >
            <MessageSquare className="h-4 w-4" />
            Comment
          </button>
          <button
            onClick={handleShareClick}
            disabled={isSharing}
            className="flex-1 text-gray-600 hover:text-green-600 hover:bg-green-50 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors disabled:opacity-70 font-sans"
          >
            <Share2 className="h-4 w-4" />
            {isSharing ? "..." : "Share"}
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="flex-1 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors disabled:opacity-70 font-sans"
          >
            <Bookmark className={`h-4 w-4 ${saved[post.id] ? "fill-yellow-500 text-yellow-500" : ""}`} />
            {isSaving ? "..." : saved[post.id] ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Expanded Comments Section */}
      <ExpandedComments
        post={post}
        isVisible={showComments}
      />
    </>
  );
}
