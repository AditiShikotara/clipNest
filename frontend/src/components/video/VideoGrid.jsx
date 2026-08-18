import VideoCard from "./VideoCard";
import EmptyState from "../common/EmptyState";
import { Film } from "lucide-react";

export default function VideoGrid({ videos = [], emptyTitle = "No videos found", emptyDescription }) {
  if (!videos.length) {
    return <EmptyState icon={Film} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}
