import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './Reducers/UserSlice';
import ProfileSlice from './Reducers/Profile/ProfileSlice';
import PublicProfileSlice from './Reducers/Profile/PublicProfileSlice';
import PostSlice from './Reducers/PostFeeds/PostSlice';

export const store = configureStore({
  reducer: {
    user: UserSlice,
    // Profile
    profile: ProfileSlice,
    // Public Profile
    publicProfile: PublicProfileSlice,
    // Posts
    post: PostSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
