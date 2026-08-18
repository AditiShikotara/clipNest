import { apiSlice } from "../api/apiSlice";

// Mirrors backend: app.use('/api/v1/tweets', tweetRouter) -> src/routes/tweet.routes.js
export const tweetApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /tweets  { content }
    createTweet: builder.mutation({
      query: (body) => ({
        url: "/tweets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tweet"],
    }),

    // GET /tweets/user/:userId
    getUserTweets: builder.query({
      query: (userId) => `/tweets/user/${userId}`,
      providesTags: ["Tweet"],
    }),

    // PATCH /tweets/:tweetId  { content }
    updateTweet: builder.mutation({
      query: ({ tweetId, content }) => ({
        url: `/tweets/${tweetId}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: ["Tweet"],
    }),

    // DELETE /tweets/:tweetId
    deleteTweet: builder.mutation({
      query: (tweetId) => ({
        url: `/tweets/${tweetId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tweet"],
    }),
  }),
});

export const {
  useCreateTweetMutation,
  useGetUserTweetsQuery,
  useUpdateTweetMutation,
  useDeleteTweetMutation,
} = tweetApiSlice;
