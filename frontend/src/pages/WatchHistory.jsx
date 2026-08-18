import { History } from "lucide-react";
import { useGetWatchHistoryQuery } from "../features/auth/authApiSlice";
import VideoGrid from "../components/video/VideoGrid";
import Loader from "../components/common/Loader";

export default function WatchHistory() {
  const { data, isLoading } = useGetWatchHistoryQuery();

  return (
    <div>
      <h1 className="mb-5 flex items-center gap-2 text-xl font-bold">
        <History size={20} /> Watch history
      </h1>
      {isLoading ? (
        <Loader full />
      ) : (
        <VideoGrid
          videos={data?.data}
          emptyTitle="No watch history yet"
          emptyDescription="Videos you watch will show up here."
        />
      )}
    </div>
  );
}
