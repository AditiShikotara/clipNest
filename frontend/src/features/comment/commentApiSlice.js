import { apiSlice } from "../api/apiSlice";

// Mirrors backend: app.use('/api/v1/comments', commentRouter) -> src/routes/comment.routes.js
export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /comments/:videoId?page&limit
    getVideoComments: builder.query({
      query: ({ videoId, page = 1, limit = 10 }) => ({
        url: `/comments/${videoId}`,
        params: { page, limit },
      }),
      providesTags: (result, error, { videoId }) => [{ type: "Comment", id: videoId }],
    }),

    // POST /comments/:videoId  { content }
    addComment: builder.mutation({
      query: ({ videoId, content }) => ({
        url: `/comments/${videoId}`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, { videoId }) => [{ type: "Comment", id: videoId }],
    }),

    // PATCH /comments/c/:commentId  { content }
    updateComment: builder.mutation({
      query: ({ commentId, content, videoId }) => ({
        url: `/comments/c/${commentId}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: (result, error, { videoId }) => [{ type: "Comment", id: videoId }],
    }),

    // DELETE /comments/c/:commentId
    deleteComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `/comments/c/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { videoId }) => [{ type: "Comment", id: videoId }],
    }),
  }),
});

export const {
  useGetVideoCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApiSlice;
