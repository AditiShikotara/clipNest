import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Search from "./pages/Search";
import WatchVideo from "./pages/WatchVideo";
import Channel from "./pages/Channel";
import Dashboard from "./pages/Dashboard";
import UploadVideo from "./pages/UploadVideo";
import EditVideo from "./pages/EditVideo";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import LikedVideos from "./pages/LikedVideos";
import WatchHistory from "./pages/WatchHistory";
import Tweets from "./pages/Tweets";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Public auth pages (no navbar/sidebar shell) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main app shell */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/watch/:videoId" element={<WatchVideo />} />
        <Route path="/channel/:username" element={<Channel />} />
        <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />

        {/* Routes that require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/edit-video/:videoId" element={<EditVideo />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/liked-videos" element={<LikedVideos />} />
          <Route path="/history" element={<WatchHistory />} />
          <Route path="/tweets" element={<Tweets />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
