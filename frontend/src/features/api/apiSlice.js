import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../auth/authSlice";

// Base URL of the ClipNest backend (src/app.js -> app.use('/api/v1/...'))
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // send/receive the httpOnly accessToken/refreshToken cookies
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wraps the base query so that on a 401 we transparently hit
// POST /users/refresh-token (see user.routes.js) and retry once.
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      { url: "/users/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const { accessToken } = refreshResult.data.data;
      const prevUser = api.getState().auth.user;
      api.dispatch(setCredentials({ user: prevUser, accessToken }));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "CurrentUser",
    "ChannelProfile",
    "Video",
    "Comment",
    "Playlist",
    "Tweet",
    "Subscription",
    "LikedVideos",
    "WatchHistory",
    "DashboardStats",
    "DashboardVideos",
  ],
  endpoints: () => ({}),
});
