import { ThumbsUp } from "lucide-react";
import { useGetLikedVideosQuery } from "../features/like/likeApiSlice";
import VideoGrid from "../components/video/VideoGrid";
import Loader from "../components/common/Loader";

export default function LikedVideos() {
  const { data, isLoading } = useGetLikedVideosQuery();

  const videos = (data?.data || []).map((item) => item.video).filter(Boolean);

  return (
    <div>
      <h1 className="mb-5 flex items-center gap-2 text-xl font-bold">
        <ThumbsUp size={20} /> Liked videos
      </h1>
      {isLoading ? (
        <Loader full />
      ) : (
        <VideoGrid
          videos={videos}
          emptyTitle="No liked videos yet"
          emptyDescription="Videos you like will show up here."
        />
      )}
    </div>
  );
}
