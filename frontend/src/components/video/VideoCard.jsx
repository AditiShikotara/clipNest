import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import { formatDuration, formatCount, timeAgo } from "../../utils/format";

export default function VideoCard({ video }) {
  if (!video) return null;
  const owner = video.owner || video.ownerDetails;

  return (
    <Link to={`/watch/${video._id}`} className="group flex flex-col gap-2.5">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-surface">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatDuration(video.duration)}
        </span>
        {video.isPublished === false && (
          <span className="absolute left-1.5 top-1.5 rounded bg-yellow-500/90 px-1.5 py-0.5 text-xs font-semibold text-black">
            Unlisted
          </span>
        )}
      </div>
      <div className="flex gap-2.5">
        {owner && <Avatar src={owner.avatar} name={owner.fullName} size={36} className="mt-0.5" />}
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-semibold leading-snug">{video.title}</p>
          {owner && (
            <p className="mt-1 line-clamp-1 text-xs text-text-muted">{owner.fullName}</p>
          )}
          <p className="line-clamp-1 text-xs text-text-muted">
            {formatCount(video.views)} views • {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
