import { SignInResponseInterface, UserInterface } from "@/Type/User/SignInType";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";

interface UserState {
  isAuthenticated: boolean;
  user: UserInterface | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
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
  },
});

export const { updateUser, signInUser, setUser, signOutUser } = userSlice.actions;
export default userSlice.reducer;
