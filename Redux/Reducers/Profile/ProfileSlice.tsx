import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@/Type/Profile/Ts_Profile";

interface ProfileState {
  user: UserProfile | null;
  loading: boolean;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
    },
    clearUserProfile: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setProfileLoading, setUserProfile, clearUserProfile } =
  profileSlice.actions;

export default profileSlice.reducer;
