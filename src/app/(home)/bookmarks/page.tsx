"use client";

import React, { useState } from 'react';
import { Search, Bookmark, MoreVertical, Heart, MessageSquare, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BookmarkedPost {
  id: string;
  author: string;
  avatar: string;
  role: string;
  time: string;
  title?: string;
  content: string;
  image?: string;
  tags?: string[];
  type: "Research Paper" | "Case Study";
  likes: number;
  comments: number;
  shares: number;
}

const BookmarksPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const bookmarkedPosts: BookmarkedPost[] = [
    {
      id: "1",
      author: "Dr. Sarah Wilson",
      avatar: "/pp.png",
      role: "Cardiologist",
      time: "2h",
      title: "Breakthrough in Heart Disease Treatment",
      content: "Recent studies show promising results in using AI-assisted diagnosis for early detection of cardiovascular diseases. The new methodology combines machine learning with traditional clinical markers to achieve 95% accuracy in preliminary screenings.",
      image: "/banner.png",
      tags: ["Cardiology", "AI", "Research"],
      type: "Research Paper",
      likes: 124,
      comments: 23,
      shares: 45
    },
    {
      id: "2", 
      author: "Dr. Michael Chen",
      avatar: "/pp.png",
      role: "Pharmacist",
      time: "4h",
      title: "Drug Interaction Case Study",
      content: "Important findings regarding the interaction between common diabetes medications and new antiviral treatments. Healthcare providers should be aware of potential complications when prescribing these combinations.",
      tags: ["Pharmacy", "Drug Safety", "Case Study"],
      type: "Case Study",
      likes: 89,
      comments: 15,
      shares: 28
    },
    {
      id: "3",
      author: "Dr. Emily Rodriguez",
      avatar: "/pp.png", 
      role: "Neurologist",
      time: "1d",
      title: "Innovative Approach to Alzheimer's Treatment",
      content: "New research indicates that early intervention with cognitive behavioral therapy combined with targeted medication can significantly slow the progression of Alzheimer's disease in patients under 65.",
      tags: ["Neurology", "Alzheimer's", "Treatment"],
      type: "Research Paper",
      likes: 156,
      comments: 34,
      shares: 67
    }
  ];

  const filteredPosts = bookmarkedPosts.filter(post =>
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        
        <div className="flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-gray-900" />
          <h1 className="text-xl font-bold text-gray-900 font-sans">Bookmarks</h1>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search Bookmarks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 rounded-full h-10"
          />
        </div>
      </div>

      <div className="flex-1">
        {filteredPosts.length > 0 ? (
          <div className="space-y-4 p-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 hover:shadow-md transition-shadow">
                <div className="flex gap-3">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {post.author}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {post.role}
                      </span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-500 text-sm">
                        {post.time}
                      </span>
                      <div className="ml-auto">
                        <button className="p-1 hover:bg-gray-100 rounded-full">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {post.title && (
                      <h3 className="font-semibold text-gray-900 text-base mb-1 font-sans">
                        {post.title}
                      </h3>
                    )}

                    <p className="text-gray-800 text-sm leading-relaxed mb-3">
                      {post.content}
                    </p>

                    {post.image && (
                      <div className="rounded-xl overflow-hidden border border-gray-200 mb-3">
                        <Image 
                          src={post.image} 
                          alt="Post image" 
                          width={500} 
                          height={300}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-blue-700 font-medium mb-3">
                      {post.type === "Research Paper" ? "📄 Research Paper" : "🩺 Case Study"}
                    </div>

                    <div className="flex items-center justify-between text-gray-500 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 hover:text-red-500 transition-colors group">
                          <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                            <Heart className="h-4 w-4" />
                          </div>
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        
                        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                          <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        
                        <button className="flex items-center gap-2 hover:text-green-500 transition-colors group">
                          <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                            <Share2 className="h-4 w-4" />
                          </div>
                          <span className="text-sm">{post.shares}</span>
                        </button>
                      </div>
                      
                      <button className="p-2 rounded-full hover:bg-yellow-50 transition-colors group">
                        <Bookmark className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Bookmark className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2 font-sans">
              {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
            </h3>
            <p className="text-gray-400 text-center max-w-sm">
              {searchQuery 
                ? `No bookmarks match "${searchQuery}". Try a different search term.`
                : 'When you bookmark posts, they will appear here for easy access later.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;