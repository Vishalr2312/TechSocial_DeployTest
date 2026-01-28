import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Ts_PostProps {
  postId: number;
  userId: number;
  postText?: string;
  hashTags?: string[];
  postImgs: string[];
  postVideos?: string[];
  postPdfs?: string[];
  isVideoPost?: boolean;
  name: string;
  userName: string;
  userAvt: string;
  created_at: number;
  is_like:boolean;
  total_view: number;
  total_like: number;
  total_comment: number;
  total_share: number;
  ai_search_views: number;
  isFollowing: boolean;
}

interface PostState {
  posts: Ts_PostProps[];
  selectedPost: Ts_PostProps | null;
}

const initialState: PostState = {
  posts: [],
  selectedPost: null,
};

// const postSlice = createSlice({
//   name: "post",
//   initialState,
//   reducers: {
//     // 🔹 Store feed posts
//     setPosts(state, action: PayloadAction<Ts_PostProps[]>) {
//       state.posts = action.payload;
//     },

//     // 🔹 Append posts (optional, for pagination)
//     appendPosts(state, action: PayloadAction<Ts_PostProps[]>) {
//       state.posts.push(...action.payload);
//     },

//     // 🔹 Select post for detail page
//     setSelectedPost(state, action: PayloadAction<Ts_PostProps>) {
//       state.selectedPost = action.payload;
//     },

//     // 🔹 Clear selected post (on leave)
//     clearSelectedPost(state) {
//       state.selectedPost = null;
//     },
//   },
// });
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // ✅ Merge, dedupe & sort posts (pagination-safe)
    setPosts(state, action: PayloadAction<Ts_PostProps[]>) {
      const map = new Map<number, Ts_PostProps>();

      // existing posts
      state.posts.forEach((post) => {
        map.set(post.postId, post);
      });

      // incoming posts
      action.payload.forEach((post) => {
        map.set(post.postId, post);
      });

      // newest first
      state.posts = Array.from(map.values()).sort(
        (a, b) => b.created_at - a.created_at
      );
    },

    // 🔹 Select post for detail page
    setSelectedPost(state, action: PayloadAction<Ts_PostProps>) {
      state.selectedPost = action.payload;
    },

    // 🔹 Clear selected post
    clearSelectedPost(state) {
      state.selectedPost = null;
    },

    // 🔹 Optional: clear feed (logout / refresh)
    clearPosts(state) {
      state.posts = [];
    },
  },
});

export const {
  setPosts,
  setSelectedPost,
  clearSelectedPost,
} = postSlice.actions;

export default postSlice.reducer;
