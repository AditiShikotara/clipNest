import { useSearchParams } from "react-router-dom";
import { useGetAllVideosQuery } from "../features/video/videoApiSlice";
import VideoGrid from "../components/video/VideoGrid";
import Loader from "../components/common/Loader";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const { data, isLoading } = useGetAllVideosQuery({ query, limit: 20 }, { skip: !query });

  return (
    <div>
      <h1 className="mb-5 text-lg font-semibold">
        Search results for <span className="text-brand">"{query}"</span>
      </h1>
      {isLoading ? (
        <Loader full />
      ) : (
        <VideoGrid
          videos={data?.data?.docs}
          emptyTitle="No results found"
          emptyDescription="Try a different search term."
        />
      )}
    </div>
  );
}
