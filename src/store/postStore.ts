import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Post } from '@/app/(home)/home/_components/types'
import { listPosts, createPost } from '@/lib/api/services/content'
import { useUserStore } from './userStore'

interface PostState {
  posts: Post[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  liked: Record<string | number, boolean>
  likedCount: Record<string | number, number>
  saved: Record<string | number, boolean>
  currentPage: number
  hasMore: boolean
  totalPages: number
  
  fetchPosts: (page?: number, limit?: number, append?: boolean) => Promise<void>
  loadMorePosts: () => Promise<void>
  addPost: (post: Post) => void
  toggleLike: (postId: string | number) => void
  sharePost: (postId: string | number) => Promise<void>
  savePost: (postId: string | number) => void
  clearPosts: () => void
  createNewPost: (postData: { title: string; content: string; attachment_id?: string }) => Promise<void>
}

export const usePostStore = create<PostState>()(
  devtools(
    (set, get) => ({
      posts: [],
      loading: false,
      loadingMore: false,
      error: null,
      liked: {},
      likedCount: {},
      saved: {},
      currentPage: 1,
      hasMore: true,
      totalPages: 0,

      fetchPosts: async (page = 1, limit = 5, append = false) => {
        if (append) {
          set({ loadingMore: true, error: null })
        } else {
          set({ loading: true, error: null })
        }
        
        try {
          const response = await listPosts(page, limit)
          const fetchedPosts = response.data || []
          const pagination = response.pagination
          
          // Get user store to fetch authors
          const { fetchUserById } = useUserStore.getState()
          
          // Get unique author IDs
          const authorIds = [...new Set(fetchedPosts.map((post: any) => post.auth))]
          
          // Fetch all authors
          const authorPromises = authorIds.map((id: string) => fetchUserById(id))
          const authors = await Promise.all(authorPromises)
          
          // Create authors map
          const authorsMap = authors.reduce((acc, author) => {
            if (author.id) {
              acc[author.id] = author
            }
            return acc
          }, {} as Record<string, any>)

          // Transform posts to UI-ready format
          const transformedPosts: Post[] = fetchedPosts.map((post: any) => {
            const author = authorsMap[post.auth] || {
              name: "Unknown User",
              role: "Medical Professional",
              profilePicture: "/pp.png",
            }
            
            return {
              id: post.id,
              author: author.name || "Unknown User",
              avatar: author.profilePicture || "/pp.png",
              role: author.role || "Medical Professional",
              time: new Date(post.created_at).toLocaleString(),
              content: post.content,
              title: post.title,
              tags: post.tags || [],
              type: "Research Paper" as const,
              likes: post.reactions || 0,
              comments: post.comments || 0,
              shares: post.shares || 0,
              ...(post.attachment_id && {
                image: `https://content.api.pharminc.in/image/${post.attachment_id}`,
              }),
            }
          })

          // Initialize like counts
          const initialLikedCount: Record<string | number, number> = {}
          transformedPosts.forEach((post) => {
            initialLikedCount[post.id] = post.likes
          })

          const currentPosts = append ? get().posts : []
          const newPosts = append ? [...currentPosts, ...transformedPosts] : transformedPosts

          set({ 
            posts: newPosts,
            likedCount: { ...get().likedCount, ...initialLikedCount },
            currentPage: page,
            hasMore: pagination?.hasNext || false,
            totalPages: pagination?.totalPages || 0,
            loading: false,
            loadingMore: false
          })
        } catch (error) {
          console.error('Error fetching posts:', error)
          
          const fallbackLikedCount: Record<string | number, number> = {}

          set({ 
            posts: append ? get().posts : [],
            likedCount: { ...get().likedCount, ...fallbackLikedCount },
            error: 'Failed to fetch posts',
            loading: false,
            loadingMore: false
          })
        }
      },

      loadMorePosts: async () => {
        const { currentPage, hasMore, loadingMore } = get()
        
        if (!hasMore || loadingMore) return
        
        await get().fetchPosts(currentPage + 1, 5, true)
      },

      addPost: (post: Post) => {
        set({ 
          posts: [post, ...get().posts],
          likedCount: { 
            ...get().likedCount, 
            [post.id]: post.likes 
          }
        })
      },

      toggleLike: (postId: string | number) => {
        const { liked, likedCount } = get()
        const isLiked = liked[postId] || false
        
        set({
          liked: { ...liked, [postId]: !isLiked },
          likedCount: {
            ...likedCount,
            [postId]: (likedCount[postId] || 0) + (isLiked ? -1 : 1)
          }
        })
      },

      sharePost: async (postId: string | number) => {
        try {
          // TODO: Implement share API call when available
          console.log('Sharing post:', postId)
          // This would typically call an API endpoint to track shares
          // await sharePostAPI(postId)
        } catch (error) {
          console.error('Failed to share post:', error)
          throw error
        }
      },

      savePost: (postId: string | number) => {
        const { saved } = get()
        const isSaved = saved[postId] || false
        
        set({
          saved: { ...saved, [postId]: !isSaved }
        })
        
        // TODO: Implement save API call when available
        console.log('Post save status changed:', postId, !isSaved)
        // This would typically call an API endpoint to save/unsave posts
        // savPostAPI(postId, !isSaved)
      },

      clearPosts: () => {
        set({ 
          posts: [], 
          liked: {}, 
          likedCount: {},
          saved: {},
          error: null,
          currentPage: 1,
          hasMore: true,
          totalPages: 0
        })
      },

      createNewPost: async (postData) => {
        try {
          const newPost = await createPost(postData)
          const { currentUser } = useUserStore.getState()
          
          if (!currentUser) {
            throw new Error("User not available")
          }

          const formattedPost: Post = {
            id: newPost.id,
            author: currentUser.name || "Unknown User",
            avatar: currentUser.profilePicture || "/pp.png",
            role: currentUser.role || "Medical Professional",
            time: "Just now",
            content: newPost.content,
            title: newPost.title,
            tags: [],
            type: "Research Paper" as const,
            likes: newPost.reactions || 0,
            comments: 0,
            shares: newPost.shares || 0,
            ...(newPost.attachment_id && {
              image: `https://content.api.pharminc.in/image/${newPost.attachment_id}`,
            }),
          }

          get().addPost(formattedPost)
          return formattedPost
        } catch (error) {
          console.error('Error creating post:', error)
          throw error
        }
      },
    }),
    { name: 'post-store' }
  )
)
