"use client";

import React, { useState, useRef } from "react";
import { X, Image, FileIcon, Link2, FileText, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { usePostStore } from "@/store";
import { User } from "./types";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function PostModal({ isOpen, onClose, user }: PostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const { createNewPost } = usePostStore();
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!content.trim() || !title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await createNewPost({
        title: title.trim(),
        content: content.trim(),
      });
      
      // Reset form and close modal
      setTitle("");
      setContent("");
      setAttachments([]);
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
      // You might want to add a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleDocumentUpload = () => {
    documentInputRef.current?.click();
  };

  const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Handle image attachment logic here
      console.log("Image files selected:", files);
    }
  };

  const onDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Handle document attachment logic here
      console.log("Document files selected:", files);
    }
  };

  const handleLinkAttach = () => {
    // Handle link attachment logic here
    console.log("Link attachment clicked");
  };

  const handleResearchAttach = () => {
    // Handle research paper attachment logic here
    console.log("Research attachment clicked");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isPostDisabled) {
        handleSubmit();
      }
    }
  };

  const isPostDisabled = !content.trim() || !title.trim() || isSubmitting;
  const characterCount = content.length;
  const maxCharacters = 280;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogPortal>
          <DialogOverlay className="bg-black/40" />
          <DialogContent className="max-w-xl w-full mx-4 p-0 bg-white rounded-2xl shadow-2xl border-0 font-sans">
            <DialogTitle className="sr-only">Create New Post</DialogTitle>
            
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900 font-sans">Create Post</h1>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isPostDisabled}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Post (Ctrl+Enter)"
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>

            <div className="px-4 py-3">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={user?.profilePicture || "/pp.png"}
                  alt="Your avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex items-center gap-2 text-blue-500 text-sm font-medium">
                  <Globe className="h-4 w-4" />
                  <span>Everyone can reply</span>
                </div>
              </div>

              <div className="min-h-[200px] space-y-4">
                <div>
                  <Input
                    placeholder="Add a title for your post"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-none shadow-none text-lg font-medium placeholder-gray-400 p-0 focus-visible:ring-0 font-sans"
                    disabled={isSubmitting}
                    required
                  />
                  <div className="h-px bg-gray-200 mt-3"></div>
                </div>
                
                <Textarea
                  placeholder="What's happening in your practice today?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-none shadow-none text-xl placeholder-gray-500 resize-none min-h-[120px] p-0 focus-visible:ring-0 font-sans leading-6"
                  disabled={isSubmitting}
                  maxLength={maxCharacters}
                />
              </div>

              {attachments.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 font-medium mb-2">
                    Attachments ({attachments.length})
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="p-2 hover:bg-blue-50 rounded-full transition-colors group"
                    disabled={isSubmitting}
                    title="Add photo"
                  >
                    <Image className="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
                  </button>

                  <button
                    type="button"
                    onClick={handleDocumentUpload}
                    className="p-2 hover:bg-green-50 rounded-full transition-colors group"
                    disabled={isSubmitting}
                    title="Add document"
                  >
                    <FileIcon className="h-5 w-5 text-green-500 group-hover:text-green-600" />
                  </button>

                  <button
                    type="button"
                    onClick={handleLinkAttach}
                    className="p-2 hover:bg-purple-50 rounded-full transition-colors group"
                    disabled={isSubmitting}
                    title="Add link"
                  >
                    <Link2 className="h-5 w-5 text-purple-500 group-hover:text-purple-600" />
                  </button>

                  <button
                    type="button"
                    onClick={handleResearchAttach}
                    className="p-2 hover:bg-orange-50 rounded-full transition-colors group"
                    disabled={isSubmitting}
                    title="Add research"
                  >
                    <FileText className="h-5 w-5 text-orange-500 group-hover:text-orange-600" />
                  </button>
                  
                  <div className="ml-4 text-xs text-gray-400 hidden sm:block">
                    Ctrl+Enter to post
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {characterCount > 0 && (
                      <>
                        <div className="relative w-8 h-8">
                          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              className="text-gray-200"
                            />
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeDasharray={`${(characterCount / maxCharacters) * 87.96} 87.96`}
                              className={
                                characterCount > maxCharacters 
                                  ? 'text-red-500' 
                                  : characterCount > maxCharacters * 0.8 
                                  ? 'text-orange-500' 
                                  : 'text-blue-500'
                              }
                            />
                          </svg>
                          {characterCount > maxCharacters * 0.8 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-xs font-bold ${
                                characterCount > maxCharacters 
                                  ? 'text-red-500' 
                                  : 'text-orange-500'
                              }`}>
                                {maxCharacters - characterCount}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {characterCount > maxCharacters * 0.9 && (
                          <div className="text-sm text-gray-500">
                            {characterCount}/{maxCharacters}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onImageSelect}
      />
      <input
        ref={documentInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
        multiple
        className="hidden"
        onChange={onDocumentSelect}
      />
    </>
  );
}
