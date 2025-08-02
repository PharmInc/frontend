"use client";

import React, { useEffect } from 'react'
import { useUserStore, usePostStore } from '@/store'
import PostComposer from './_components/PostComposer';
import PostCard from './_components/PostCard';

export default function HomeFeed() {
  const { 
    currentUser, 
    loading: userLoading, 
    fetchCurrentUser 
  } = useUserStore()

  const { 
    posts, 
    loading: postsLoading, 
    likedCount, 
    fetchPosts
  } = usePostStore()

  useEffect(() => {
    fetchCurrentUser()
    fetchPosts()
  }, [fetchCurrentUser, fetchPosts])

  if (userLoading || postsLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 -mx-4 mb-4">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 -mx-4 mb-4">
        <h1 className="text-xl font-bold">Home</h1>
      </div>

      {currentUser && <PostComposer user={currentUser} />}

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={{ ...post, likes: likedCount[post.id] || post.likes }}
          />
        ))}
      </div>
    </div>
  )
}
