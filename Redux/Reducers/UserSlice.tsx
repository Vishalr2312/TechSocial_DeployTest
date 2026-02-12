import { SignInResponseInterface, UserInterface } from "@/Type/User/SignInType";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";

interface UserState {
  isAuthenticated: boolean;
  user: UserInterface | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  followStatus: Record<number, boolean>;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  followStatus: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInUser: (state, action: PayloadAction<SignInResponseInterface>) => {
      state.isAuthenticated = true;
      state.user = action.payload?.user ? action.payload?.user : null;
    },

    signOutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },

    setUser: (state, action: PayloadAction<UserInterface | null>) => {
      state.user = action.payload;
    },

    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        secureLocalStorage.setItem("userData", JSON.stringify(state.user));
      }
    },

    setFollowStatus: (
      state,
      action: PayloadAction<{ userId: number; isFollowing: boolean }>,
    ) => {
      if (state.followStatus) {
        state.followStatus[action.payload.userId] = action.payload.isFollowing;
      } else {
        state.followStatus = {
          [action.payload.userId]: action.payload.isFollowing,
        };
      }
    },
  },
});

export const { updateUser, signInUser, setUser, signOutUser, setFollowStatus } =
  userSlice.actions;
export default userSlice.reducer;
