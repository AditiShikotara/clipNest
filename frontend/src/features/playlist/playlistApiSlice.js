import { apiSlice } from "../api/apiSlice";

// Mirrors backend: app.use('/api/v1/playlist', playlistRouter) -> src/routes/playlist.routes.js
export const playlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /playlist  { name, description }
    createPlaylist: builder.mutation({
      query: (body) => ({
        url: "/playlist",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Playlist", id: "LIST" }],
    }),

    // GET /playlist/:playlistId
    getPlaylistById: builder.query({
      query: (playlistId) => `/playlist/${playlistId}`,
      providesTags: (result, error, playlistId) => [{ type: "Playlist", id: playlistId }],
    }),

    // PATCH /playlist/:playlistId  { name, description }
    updatePlaylist: builder.mutation({
      query: ({ playlistId, ...body }) => ({
        url: `/playlist/${playlistId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { playlistId }) => [
        { type: "Playlist", id: playlistId },
        { type: "Playlist", id: "LIST" },
      ],
    }),

    // DELETE /playlist/:playlistId
    deletePlaylist: builder.mutation({
      query: (playlistId) => ({
        url: `/playlist/${playlistId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Playlist", id: "LIST" }],
    }),

    // PATCH /playlist/add/:videoId/:playlistId
    addVideoToPlaylist: builder.mutation({
      query: ({ videoId, playlistId }) => ({
        url: `/playlist/add/${videoId}/${playlistId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { playlistId }) => [
        { type: "Playlist", id: playlistId },
        { type: "Playlist", id: "LIST" },
      ],
    }),

    // PATCH /playlist/remove/:videoId/:playlistId
    removeVideoFromPlaylist: builder.mutation({
      query: ({ videoId, playlistId }) => ({
        url: `/playlist/remove/${videoId}/${playlistId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { playlistId }) => [
        { type: "Playlist", id: playlistId },
        { type: "Playlist", id: "LIST" },
      ],
    }),

    // GET /playlist/user/:userId
    getUserPlaylists: builder.query({
      query: (userId) => `/playlist/user/${userId}`,
      providesTags: [{ type: "Playlist", id: "LIST" }],
    }),
  }),
});

export const {
  useCreatePlaylistMutation,
  useGetPlaylistByIdQuery,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useAddVideoToPlaylistMutation,
  useRemoveVideoFromPlaylistMutation,
  useGetUserPlaylistsQuery,
} = playlistApiSlice;
