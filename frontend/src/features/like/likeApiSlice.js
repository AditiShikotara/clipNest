import { apiSlice } from "../api/apiSlice";

// Mirrors backend: app.use('/api/v1/likes', likeRouter) -> src/routes/like.routes.js
export const likeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /likes/toggle/v/:videoId
    toggleVideoLike: builder.mutation({
      query: (videoId) => ({
        url: `/likes/toggle/v/${videoId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, videoId) => [
        { type: "Video", id: videoId },
        "LikedVideos",
      ],
    }),

    // POST /likes/toggle/c/:commentId
    toggleCommentLike: builder.mutation({
      query: (commentId) => ({
        url: `/likes/toggle/c/${commentId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, commentId, meta) => {
        return ["Comment"];
      },
    }),

    // POST /likes/toggle/t/:tweetId
    toggleTweetLike: builder.mutation({
      query: (tweetId) => ({
        url: `/likes/toggle/t/${tweetId}`,
        method: "POST",
      }),
      invalidatesTags: ["Tweet"],
    }),

    // GET /likes/videos
    getLikedVideos: builder.query({
      query: () => "/likes/videos",
      providesTags: ["LikedVideos"],
    }),
  }),
});

export const {
  useToggleVideoLikeMutation,
  useToggleCommentLikeMutation,
  useToggleTweetLikeMutation,
  useGetLikedVideosQuery,
} = likeApiSlice;
