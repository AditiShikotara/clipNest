# ClipNest — Frontend

React + Redux Toolkit (RTK Query) + Tailwind CSS frontend for the ClipNest backend
(Express/MongoDB video-sharing + micro-blogging API).

## Stack
- React 19 + Vite
- Redux Toolkit / RTK Query for all API calls & caching
- React Router v7
- Tailwind CSS v4
- react-hot-toast, lucide-react, date-fns

## Setup

```bash
npm install
cp .env.example .env   # already provided as .env, edit if your backend runs elsewhere
npm run dev
```

The app expects the backend from your uploaded zip running at
`http://localhost:8000/api/v1` (see `.env` -> `VITE_API_BASE_URL`).
CORS_ORIGIN on the backend must be `http://localhost:5173` (already set in your `.env`).

## Structure

```
src/
  app/                  # redux store + auth bootstrap (silent refresh-token on load)
  features/
    api/apiSlice.js      # base RTK Query instance w/ cookie auth + 401 refresh retry
    auth/                 # authSlice (user/token) + authApiSlice (/users/*)
    video/                # videoApiSlice (/videos/*)
    comment/               # commentApiSlice (/comments/*)
    like/                   # likeApiSlice (/likes/*)
    playlist/               # playlistApiSlice (/playlist/*)
    subscription/           # subscriptionApiSlice (/subscriptions/*)
    tweet/                   # tweetApiSlice (/tweets/*)
    dashboard/               # dashboardApiSlice (/dashboard/*)
  components/            # Navbar, Sidebar, VideoCard, CommentList, TweetItem, etc.
  pages/                 # one file per route
```

Every RTK Query endpoint mirrors the backend route file 1:1 (same param names,
same body field names, same response shape: `{ statusCode, data, message, success }`).

## Auth model
The backend sets httpOnly `accessToken`/`refreshToken` cookies AND also returns
`accessToken` in the login response body. This frontend keeps that access token in
Redux memory (attached as `Authorization: Bearer <token>` on every request) and
relies on the cookie for refreshing it via `POST /users/refresh-token` — both on
a 401 response and once on page load if a previously logged-in user is detected
in localStorage.

## Pages / routes
- `/login`, `/register`
- `/` home feed (sort: newest / oldest / most viewed)
- `/search?query=`
- `/watch/:videoId` — player, like, subscribe, save to playlist, comments
- `/channel/:username` — videos / playlists / tweets / subscribers / about tabs
- `/dashboard` — channel stats + manage own videos (edit / delete / publish toggle)
- `/upload`, `/edit-video/:videoId`
- `/playlists`, `/playlist/:playlistId`
- `/liked-videos`, `/history`
- `/tweets`
- `/settings` — profile, avatar/cover image, password
