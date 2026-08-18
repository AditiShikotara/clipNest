import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { X, Plus, Check } from "lucide-react";
import { selectCurrentUser } from "../../features/auth/authSlice";
import {
  useGetUserPlaylistsQuery,
  useAddVideoToPlaylistMutation,
  useRemoveVideoFromPlaylistMutation,
} from "../../features/playlist/playlistApiSlice";
import Loader from "../common/Loader";
import { getErrorMessage } from "../../utils/format";

export default function AddToPlaylistModal({ videoId, onClose }) {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading } = useGetUserPlaylistsQuery(user?._id, { skip: !user });
  const [addVideoToPlaylist] = useAddVideoToPlaylistMutation();
  const [removeVideoFromPlaylist] = useRemoveVideoFromPlaylistMutation();

  const playlists = data?.data || [];

  const toggle = async (playlist) => {
    const isInPlaylist = playlist.videos?.some((v) => v === videoId || v?._id === videoId);
    try {
      if (isInPlaylist) {
        await removeVideoFromPlaylist({ videoId, playlistId: playlist._id }).unwrap();
      } else {
        await addVideoToPlaylist({ videoId, playlistId: playlist._id }).unwrap();
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Save to playlist</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-surface-hover">
            <X size={18} />
          </button>
        </div>

        {isLoading ? (
          <Loader />
        ) : playlists.length === 0 ? (
          <p className="py-4 text-sm text-text-muted">
            You don't have any playlists yet. Create one from the Playlists page.
          </p>
        ) : (
          <div className="flex max-h-72 flex-col gap-1 overflow-y-auto">
            {playlists.map((playlist) => {
              const inPlaylist = playlist.videos?.some(
                (v) => v === videoId || v?._id === videoId
              );
              return (
                <button
                  key={playlist._id}
                  onClick={() => toggle(playlist)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-hover"
                >
                  <span className="line-clamp-1">{playlist.name}</span>
                  {inPlaylist ? (
                    <Check size={16} className="text-brand" />
                  ) : (
                    <Plus size={16} className="text-text-muted" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
