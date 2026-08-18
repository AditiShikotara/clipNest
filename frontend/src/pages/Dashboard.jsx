import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, Video as VideoIcon, Users, ThumbsUp, Pencil, Trash2, EyeOff } from "lucide-react";
import { useGetChannelStatsQuery, useGetChannelVideosQuery } from "../features/dashboard/dashboardApiSlice";
import {
  useDeleteVideoMutation,
  useTogglePublishStatusMutation,
} from "../features/video/videoApiSlice";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { formatCount, formatDuration, timeAgo, getErrorMessage } from "../utils/format";

const STAT_ICONS = {
  totalVideos: VideoIcon,
  totalViews: Eye,
  totalSubscribers: Users,
  totalLikes: ThumbsUp,
};

const STAT_LABELS = {
  totalVideos: "Total videos",
  totalViews: "Total views",
  totalSubscribers: "Subscribers",
  totalLikes: "Total likes",
};

export default function Dashboard() {
  const { data: statsData, isLoading: statsLoading } = useGetChannelStatsQuery();
  const { data: videosData, isLoading: videosLoading } = useGetChannelVideosQuery();

  const stats = statsData?.data || {};
  const videos = videosData?.data || [];

  return (
    <div>
      <h1 className="mb-5 text-xl font-bold">Channel dashboard</h1>

      {statsLoading ? (
        <Loader />
      ) : (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.keys(STAT_LABELS).map((key) => {
            const Icon = STAT_ICONS[key];
            return (
              <div key={key} className="rounded-xl border border-border bg-surface/50 p-4">
                <Icon size={20} className="mb-2 text-brand" />
                <p className="text-xl font-bold">{formatCount(stats[key] || 0)}</p>
                <p className="text-xs text-text-muted">{STAT_LABELS[key]}</p>
              </div>
            );
          })}
        </div>
      )}

      <h2 className="mb-4 text-base font-semibold">Your videos</h2>

      {videosLoading ? (
        <Loader />
      ) : videos.length === 0 ? (
        <EmptyState
          icon={VideoIcon}
          title="No videos uploaded yet"
          description="Upload your first video to see it here."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-surface/50 text-text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Video</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Views</th>
                <th className="px-4 py-3 font-medium">Likes</th>
                <th className="px-4 py-3 font-medium">Uploaded</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <DashboardVideoRow key={video._id} video={video} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DashboardVideoRow({ video }) {
  const [deleteVideo, { isLoading: deleting }] = useDeleteVideoMutation();
  const [togglePublishStatus, { isLoading: toggling }] = useTogglePublishStatusMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteVideo(video._id).unwrap();
      toast.success("Video deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleTogglePublish = async () => {
    try {
      await togglePublishStatus(video._id).unwrap();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <tr className="border-b border-border last:border-0 hover:bg-surface/40">
      <td className="px-4 py-3">
        <Link to={`/watch/${video._id}`} className="flex items-center gap-3">
          <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md bg-surface">
            <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />
            <span className="absolute bottom-0.5 right-0.5 rounded bg-black/80 px-1 text-[10px] text-white">
              {formatDuration(video.duration)}
            </span>
          </div>
          <span className="line-clamp-2 max-w-xs font-medium">{video.title}</span>
        </Link>
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            video.isPublished ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {video.isPublished ? "Published" : "Unlisted"}
        </span>
      </td>
      <td className="px-4 py-3">{formatCount(video.views)}</td>
      <td className="px-4 py-3">{formatCount(video.likesCount || 0)}</td>
      <td className="px-4 py-3 text-text-muted">{timeAgo(video.createdAt)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            title={video.isPublished ? "Unpublish" : "Publish"}
            onClick={handleTogglePublish}
            disabled={toggling}
            className="rounded-full p-1.5 hover:bg-surface-hover disabled:opacity-50"
          >
            <EyeOff size={16} />
          </button>
          <Link
            to={`/edit-video/${video._id}`}
            title="Edit"
            className="rounded-full p-1.5 hover:bg-surface-hover"
          >
            <Pencil size={16} />
          </Link>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-full px-2 py-1 text-xs hover:bg-surface-hover"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              title="Delete"
              onClick={() => setConfirmDelete(true)}
              className="rounded-full p-1.5 text-red-400 hover:bg-surface-hover"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
