import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserPublicProfile } from "@/Type/Profile/Ts_PublicProfile";

interface PublicProfileState {
  user: UserPublicProfile | null;
  loading: boolean;
}

const initialState: PublicProfileState = {
  user: null,
  loading: false,
};

const publicProfileSlice = createSlice({
  name: "publicProfile",
  initialState,
  reducers: {
    setPublicProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserPublicProfile: (state, action: PayloadAction<UserPublicProfile | null>) => {
      state.user = action.payload;
    },
    clearUserPublicProfile: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setPublicProfileLoading, setUserPublicProfile, clearUserPublicProfile } =
  publicProfileSlice.actions;

export default publicProfileSlice.reducer;
