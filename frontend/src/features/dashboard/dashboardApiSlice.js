import { apiSlice } from "../api/apiSlice";

// Mirrors backend: app.use('/api/v1/dashboard', dashboardRouter) -> src/routes/dashboard.routes.js
export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /dashboard/stats
    getChannelStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["DashboardStats"],
    }),

    // GET /dashboard/videos
    getChannelVideos: builder.query({
      query: () => "/dashboard/videos",
      providesTags: ["DashboardVideos"],
    }),
  }),
});

export const { useGetChannelStatsQuery, useGetChannelVideosQuery } = dashboardApiSlice;
