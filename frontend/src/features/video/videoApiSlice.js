import { apiSlice } from "../api/apiSlice";

// Mirrors backend: app.use('/api/v1/videos', videoRouter) -> src/routes/video.routes.js
export const videoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /videos?page&limit&query&sortBy&sortType&userId
    getAllVideos: builder.query({
      query: (params = {}) => ({
        url: "/videos",
        params,
      }),
      providesTags: (result) =>
        result?.data?.docs
          ? [
              ...result.data.docs.map(({ _id }) => ({ type: "Video", id: _id })),
              { type: "Video", id: "LIST" },
            ]
          : [{ type: "Video", id: "LIST" }],
    }),

    // GET /videos/:videoId
    getVideoById: builder.query({
      query: (videoId) => `/videos/${videoId}`,
      providesTags: (result, error, videoId) => [{ type: "Video", id: videoId }],
    }),

    // POST /videos  (multipart: videoFile, thumbnail) { title, description }
    publishAVideo: builder.mutation({
      query: (formData) => ({
        url: "/videos",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Video", id: "LIST" }, "DashboardVideos", "DashboardStats"],
    }),

    // PATCH /videos/:videoId  (multipart optional: thumbnail) { title, description }
    updateVideo: builder.mutation({
      query: ({ videoId, formData }) => ({
        url: `/videos/${videoId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { videoId }) => [
        { type: "Video", id: videoId },
        "DashboardVideos",
      ],
    }),

    // DELETE /videos/:videoId
    deleteVideo: builder.mutation({
      query: (videoId) => ({
        url: `/videos/${videoId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Video", id: "LIST" }, "DashboardVideos", "DashboardStats"],
    }),

    // PATCH /videos/toggle/publish/:videoId
    togglePublishStatus: builder.mutation({
      query: (videoId) => ({
        url: `/videos/toggle/publish/${videoId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, videoId) => [
        { type: "Video", id: videoId },
        "DashboardVideos",
      ],
    }),
  }),
});

export const {
  useGetAllVideosQuery,
  useGetVideoByIdQuery,
  usePublishAVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useTogglePublishStatusMutation,
} = videoApiSlice;
