import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UploadCloud, Film, Image as ImageIcon } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { usePublishAVideoMutation } from "../features/video/videoApiSlice";
import { getErrorMessage } from "../utils/format";

export default function UploadVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [publishAVideo, { isLoading }] = usePublishAVideoMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) return toast.error("Please select a video file");
    if (!thumbnail) return toast.error("Please select a thumbnail image");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    try {
      const res = await publishAVideo(formData).unwrap();
      toast.success("Video published!");
      navigate(`/watch/${res.data._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Upload failed"));
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 flex items-center gap-2 text-xl font-bold">
        <UploadCloud size={22} /> Upload a video
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FilePicker
          label="Video file (required)"
          icon={Film}
          accept="video/*"
          file={videoFile}
          onChange={setVideoFile}
        />
        <FilePicker
          label="Thumbnail (required)"
          icon={ImageIcon}
          accept="image/*"
          file={thumbnail}
          onChange={setThumbnail}
        />

        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your video a title"
          required
        />
        <Input
          label="Description"
          textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell viewers about your video"
          required
        />

        <Button type="submit" loading={isLoading} className="mt-2 w-full">
          Publish video
        </Button>
      </form>
    </div>
  );
}

function FilePicker({ label, icon: Icon, accept, file, onChange }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-text-muted">{label}</span>
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-3 py-3">
        <Icon size={20} className="shrink-0 text-text-muted" />
        <input
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="flex-1 text-xs text-text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-hover file:px-3 file:py-1.5 file:text-xs file:text-text"
        />
      </div>
      {file && <span className="text-xs text-text-muted">Selected: {file.name}</span>}
    </label>
  );
}
