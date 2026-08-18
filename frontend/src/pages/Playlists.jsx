import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Plus, ListVideo } from "lucide-react";
import { selectCurrentUser } from "../features/auth/authSlice";
import {
  useGetUserPlaylistsQuery,
  useCreatePlaylistMutation,
} from "../features/playlist/playlistApiSlice";
import PlaylistCard from "../components/playlist/PlaylistCard";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { getErrorMessage } from "../utils/format";

export default function Playlists() {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading } = useGetUserPlaylistsQuery(user?._id, { skip: !user });
  const [createPlaylist, { isLoading: creating }] = useCreatePlaylistMutation();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const playlists = data?.data || [];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    try {
      await createPlaylist({ name: name.trim(), description: description.trim() }).unwrap();
      setName("");
      setDescription("");
      setShowForm(false);
      toast.success("Playlist created");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Your playlists</h1>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus size={16} /> New playlist
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-surface/50 p-4"
        >
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My favorites"
            required
          />
          <Input
            label="Description"
            textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this playlist about?"
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={creating}>
              Create
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <Loader full />
      ) : playlists.length === 0 ? (
        <EmptyState icon={ListVideo} title="No playlists yet" description="Create your first playlist to organize videos." />
      ) : (
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlists.map((p) => (
            <PlaylistCard key={p._id} playlist={p} />
          ))}
        </div>
      )}
    </div>
  );
}
