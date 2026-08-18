import { apiSlice } from "../api/apiSlice";

// Mirrors backend: app.use('/api/v1/subscriptions', subscriptionRouter) -> src/routes/subscription.routes.js
export const subscriptionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /subscriptions/c/:channelId
    toggleSubscription: builder.mutation({
      query: (channelId) => ({
        url: `/subscriptions/c/${channelId}`,
        method: "POST",
      }),
      invalidatesTags: ["ChannelProfile", "Subscription"],
    }),

    // GET /subscriptions/c/:channelId  (subscribers of this channel)
    getUserChannelSubscribers: builder.query({
      query: (channelId) => `/subscriptions/c/${channelId}`,
      providesTags: ["Subscription"],
    }),

    // GET /subscriptions/u/:subscriberId  (channels this user subscribed to)
    getSubscribedChannels: builder.query({
      query: (subscriberId) => `/subscriptions/u/${subscriberId}`,
      providesTags: ["Subscription"],
    }),
  }),
});

export const {
  useToggleSubscriptionMutation,
  useGetUserChannelSubscribersQuery,
  useGetSubscribedChannelsQuery,
} = subscriptionApiSlice;
