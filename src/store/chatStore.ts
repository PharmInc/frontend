import { create } from 'zustand'

interface ChatUser {
  id: string
  name: string
  username: string
  avatar?: string
  verified?: boolean
  online?: boolean
}

interface ChatStore {
  selectedChat: ChatUser | null
  setSelectedChat: (user: ChatUser | null) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedChat: null,
  setSelectedChat: (user) => set({ selectedChat: user }),
}))
