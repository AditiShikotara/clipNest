import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, Image as ImageIcon } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { useGetVideoByIdQuery, useUpdateVideoMutation } from "../features/video/videoApiSlice";
import { getErrorMessage } from "../utils/format";

export default function EditVideo() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetVideoByIdQuery(videoId);
  const [updateVideo, { isLoading: saving }] = useUpdateVideoMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (data?.data) {
      setTitle(data.data.title);
      setDescription(data.data.description);
    }
  }, [data]);

  if (isLoading) return <Loader full />;

  const video = data?.data;
  if (!video) return <p className="text-text-muted">Video not found.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      await updateVideo({ videoId, formData }).unwrap();
      toast.success("Video updated");
      navigate(`/watch/${videoId}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Update failed"));
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 flex items-center gap-2 text-xl font-bold">
        <Pencil size={20} /> Edit video
      </h1>

      <div className="mb-5 aspect-video w-full overflow-hidden rounded-xl bg-surface">
        <img
          src={thumbnail ? URL.createObjectURL(thumbnail) : video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover"
        />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-text-muted">Replace thumbnail (optional)</span>
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-3 py-3">
            <ImageIcon size={20} className="shrink-0 text-text-muted" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              className="flex-1 text-xs text-text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-hover file:px-3 file:py-1.5 file:text-xs file:text-text"
            />
          </div>
        </label>

        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input
          label="Description"
          textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <Button type="submit" loading={saving} className="mt-2 w-full">
          Save changes
        </Button>
      </form>
    </div>
  );
}
