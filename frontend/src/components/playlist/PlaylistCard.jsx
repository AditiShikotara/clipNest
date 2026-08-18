import { Link } from "react-router-dom";
import { ListVideo } from "lucide-react";

export default function PlaylistCard({ playlist }) {
  const count = playlist.videoCount ?? playlist.videos?.length ?? 0;
  const cover = playlist.videos?.[0]?.thumbnail;

  return (
    <Link to={`/playlist/${playlist._id}`} className="group flex flex-col gap-2.5">
      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-surface">
        {cover ? (
          <img
            src={cover}
            alt={playlist.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ListVideo size={32} className="text-text-muted" />
        )}
        <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          <ListVideo size={12} /> {count} video{count === 1 ? "" : "s"}
        </span>
      </div>
      <div>
        <p className="line-clamp-1 text-sm font-semibold">{playlist.name}</p>
        <p className="line-clamp-1 text-xs text-text-muted">{playlist.description}</p>
      </div>
    </Link>
  );
}
