import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Pencil, Trash2, X } from "lucide-react";
import { selectCurrentUser } from "../features/auth/authSlice";
import {
  useGetPlaylistByIdQuery,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useRemoveVideoFromPlaylistMutation,
} from "../features/playlist/playlistApiSlice";
import VideoCard from "../components/video/VideoCard";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { getErrorMessage } from "../utils/format";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { data, isLoading } = useGetPlaylistByIdQuery(playlistId);
  const [updatePlaylist, { isLoading: saving }] = useUpdatePlaylistMutation();
  const [deletePlaylist] = useDeletePlaylistMutation();
  const [removeVideoFromPlaylist] = useRemoveVideoFromPlaylistMutation();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (isLoading) return <Loader full />;

  const playlist = data?.data;
  if (!playlist) return <p className="text-text-muted">Playlist not found.</p>;

  const isOwner = user?._id === playlist.owner?._id;

  const startEdit = () => {
    setName(playlist.name);
    setDescription(playlist.description);
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updatePlaylist({ playlistId, name: name.trim(), description: description.trim() }).unwrap();
      setEditing(false);
      toast.success("Playlist updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await deletePlaylist(playlistId).unwrap();
      toast.success("Playlist deleted");
      navigate("/playlists");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      await removeVideoFromPlaylist({ videoId, playlistId }).unwrap();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      {editing ? (
        <form onSubmit={handleSave} className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-surface/50 p-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input
            label="Description"
            textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">{playlist.name}</h1>
            <p className="mt-1 text-sm text-text-muted">{playlist.description}</p>
            {playlist.owner && (
              <Link to={`/channel/${playlist.owner.username}`} className="mt-1 inline-block text-xs text-text-muted hover:text-text">
                by {playlist.owner.fullName}
              </Link>
            )}
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={startEdit}>
                <Pencil size={16} /> Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          )}
        </div>
      )}

      {playlist.videos?.length ? (
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlist.videos.map((video) => (
            <div key={video._id} className="relative">
              <VideoCard video={video} />
              {isOwner && (
                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  title="Remove from playlist"
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="This playlist is empty" description="Add videos from the watch page using Save." />
      )}
    </div>
  );
}
