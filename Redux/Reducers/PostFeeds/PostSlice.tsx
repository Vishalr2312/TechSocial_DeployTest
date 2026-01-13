import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Ts_PostProps {
  postId: number;
  postText?: string;
  hashTags?: string[];
  postImgs: string[];
  postVideos?: string[];
  postPdfs?: string[];
  name: string;
  userName: string;
  userAvt: string;
  created_at: number;
  total_view: number;
  total_like: number;
  total_comment: number;
  total_share: number;
  ai_search_views: number;
}

interface PostState {
  posts: Ts_PostProps[];
  selectedPost: Ts_PostProps | null;
}

const initialState: PostState = {
  posts: [],
  selectedPost: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // 🔹 Store feed posts
    setPosts(state, action: PayloadAction<Ts_PostProps[]>) {
      state.posts = action.payload;
    },

    // 🔹 Append posts (optional, for pagination)
    appendPosts(state, action: PayloadAction<Ts_PostProps[]>) {
      state.posts.push(...action.payload);
    },

    // 🔹 Select post for detail page
    setSelectedPost(state, action: PayloadAction<Ts_PostProps>) {
      state.selectedPost = action.payload;
    },

    // 🔹 Clear selected post (on leave)
    clearSelectedPost(state) {
      state.selectedPost = null;
    },
  },
});

export const {
  setPosts,
  appendPosts,
  setSelectedPost,
  clearSelectedPost,
} = postSlice.actions;

export default postSlice.reducer;
