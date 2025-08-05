"use client";

import React, { useEffect } from 'react'
import { useUserStore, usePostStore } from '@/store'
import PostComposer from './_components/PostComposer';
import PostCard from './_components/PostCard';
import SearchBar from './_components/SearchBar';

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
      <div className="space-y-6">
        <SearchBar />
        <div className="flex justify-center items-center py-12 p-4 ">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      <SearchBar />

      {currentUser && (
        <div className="px-4">
          <PostComposer user={currentUser} />
        </div>
      )}

      <div className="space-y-4 p-4 ">
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
