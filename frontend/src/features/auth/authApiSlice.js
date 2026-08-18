import { apiSlice } from "../api/apiSlice";

// Mirrors backend: app.use('/api/v1/users', userRouter) -> src/routes/user.routes.js
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /users/register  (multipart: avatar[required], coverImage[optional])
    registerUser: builder.mutation({
      query: (formData) => ({
        url: "/users/register",
        method: "POST",
        body: formData,
      }),
    }),

    // POST /users/login  { email | username, password }
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["CurrentUser"],
    }),

    // POST /users/logout  (secured)
    logoutUser: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
      invalidatesTags: ["CurrentUser"],
    }),

    // POST /users/refresh-token
    refreshAccessToken: builder.mutation({
      query: () => ({
        url: "/users/refresh-token",
        method: "POST",
      }),
    }),

    // POST /users/change-password  (secured) { oldPassword, newPassword }
    changeCurrentPassword: builder.mutation({
      query: (body) => ({
        url: "/users/change-password",
        method: "POST",
        body,
      }),
    }),

    // GET /users/current-user  (secured)
    getCurrentUser: builder.query({
      query: () => "/users/current-user",
      providesTags: ["CurrentUser"],
    }),

    // PATCH /users/update-account  (secured) { fullName, email }
    updateAccountDetails: builder.mutation({
      query: (body) => ({
        url: "/users/update-account",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["CurrentUser"],
    }),

    // PATCH /users/avatar  (secured, multipart: avatar)
    updateUserAvatar: builder.mutation({
      query: (formData) => ({
        url: "/users/avatar",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["CurrentUser"],
    }),

    // PATCH /users/cover-image  (secured, multipart: coverImage)
    updateUserCoverImage: builder.mutation({
      query: (formData) => ({
        url: "/users/cover-image",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["CurrentUser"],
    }),

    // GET /users/c/:username  (secured)
    getUserChannelProfile: builder.query({
      query: (username) => `/users/c/${username}`,
      providesTags: ["ChannelProfile"],
    }),

    // GET /users/history  (secured)
    getWatchHistory: builder.query({
      query: () => "/users/history",
      providesTags: ["WatchHistory"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useRefreshAccessTokenMutation,
  useChangeCurrentPasswordMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateAccountDetailsMutation,
  useUpdateUserAvatarMutation,
  useUpdateUserCoverImageMutation,
  useGetUserChannelProfileQuery,
  useGetWatchHistoryQuery,
} = authApiSlice;
