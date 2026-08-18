import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("clipnest_user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      if (user) {
        state.user = user;
        localStorage.setItem("clipnest_user", JSON.stringify(user));
      }
      if (accessToken) {
        state.accessToken = accessToken;
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("clipnest_user", JSON.stringify(state.user));
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("clipnest_user");
    },
  },
});

export const { setCredentials, updateUser, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
