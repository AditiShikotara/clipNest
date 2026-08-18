import { Video } from "lucide-react"
import EmptyState from "../components/common/EmptyState"
import Loader from "../components/common/Loader"
import VideoCard from "../components/video/VideoCard"
import { useGetAllVideosQuery } from "../features/video/videoApiSlice"

export default function Home() {
  const { data, isLoading, isError, error } = useGetAllVideosQuery({
    page: 1,
    limit: 24,
    sortBy: "createdAt",
    sortType: "desc",
  })

  const videos = data?.data?.docs || []

  if (isLoading) return <Loader full />

  if (isError) {
    return (
      <EmptyState
        icon={Video}
        title="Couldn't load videos"
        description={error?.data?.message || "Something went wrong. Please try again."}
      />
    )
  }

  if (videos.length === 0) {
    return (
      <EmptyState
        icon={Video}
        title="No videos yet"
        description="Be the first to publish something on ClipNest."
      />
    )
  }

  return (
    <div className="pb-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Recommended</h1>
        <span className="text-xs text-text-muted">{videos.length} videos</span>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  )
}