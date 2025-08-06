"use client";

import React from 'react'
import MessagesList from './_components/MessagesList'
import EmptyChatState from './_components/EmptyChatState'
import ChatInterface  from './_components/ChatInterface';
import { useChatStore } from '@/store';

export default function MessagesPage() {

   const { selectedChat } = useChatStore();

  return (
    <>
      <div className="h-full flex-1 flex w-full">
        <MessagesList />
        <div className="flex-1">
          {
            selectedChat ? (
                  <ChatInterface
                    recipientName={selectedChat.name}
                    recipientAvatar={selectedChat.avatar}
                    recipientUsername={selectedChat.username}
                    recipientVerified={selectedChat.verified}
                    recipientOnline={selectedChat.online}
                  />
                ) : (
                  <EmptyChatState />
                )
          }
        </div>
      </div>
    </>
  )
}