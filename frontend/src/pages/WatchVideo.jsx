import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ThumbsUp, Share2, ListPlus, Bell, BellRing } from "lucide-react";
import { useGetVideoByIdQuery } from "../features/video/videoApiSlice";
import { useToggleVideoLikeMutation } from "../features/like/likeApiSlice";
import { useToggleSubscriptionMutation } from "../features/subscription/subscriptionApiSlice";
import { selectCurrentUser } from "../features/auth/authSlice";
import Avatar from "../components/common/Avatar";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import CommentList from "../components/comment/CommentList";
import AddToPlaylistModal from "../components/playlist/AddToPlaylistModal";
import { formatCount, timeAgo, getErrorMessage } from "../utils/format";

export default function WatchVideo() {
  const { videoId } = useParams();
  const user = useSelector(selectCurrentUser);
  const { data, isLoading, error } = useGetVideoByIdQuery(videoId);

  const [toggleVideoLike, { isLoading: liking }] = useToggleVideoLikeMutation();
  const [toggleSubscription, { isLoading: subscribing }] = useToggleSubscriptionMutation();

  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(null); // null = unknown/not applicable
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  if (isLoading) return <Loader full />;

  if (error || !data?.data) {
    return (
      <div className="py-20 text-center text-text-muted">
        This video could not be found or is unavailable.
      </div>
    );
  }

  const video = data.data;
  const owner = video.owner;
  const isOwnVideo = user?._id === owner?._id;
  const isSubscribed = subscribed === null ? owner?.isSubscribed : subscribed;

  const handleLike = async () => {
    if (!user) return toast.error("Sign in to like videos");
    try {
      const res = await toggleVideoLike(video._id).unwrap();
      setLiked(res.data.isLiked);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleSubscribe = async () => {
    if (!user) return toast.error("Sign in to subscribe");
    try {
      const res = await toggleSubscription(owner._id).unwrap();
      setSubscribed(res.data.subscribed);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <video
          key={video._id}
          src={video.videoFile}
          poster={video.thumbnail}
          controls
          autoPlay
          className="h-full w-full"
        />
      </div>

      <h1 className="text-lg font-bold sm:text-xl">{video.title}</h1>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {owner && (
          <Link to={`/channel/${owner.username}`} className="flex items-center gap-3">
            <Avatar src={owner.avatar} name={owner.fullName} size={44} />
            <div>
              <p className="text-sm font-semibold">{owner.fullName}</p>
              <p className="text-xs text-text-muted">@{owner.username}</p>
            </div>
          </Link>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {!isOwnVideo && owner && (
            <Button
              variant={isSubscribed ? "secondary" : "primary"}
              loading={subscribing}
              onClick={handleSubscribe}
            >
              {isSubscribed ? <BellRing size={16} /> : <Bell size={16} />}
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          )}
          <Button
            variant={liked ? "secondary" : "outline"}
            loading={liking}
            onClick={handleLike}
          >
            <ThumbsUp size={16} className={liked ? "fill-brand text-brand" : ""} /> Like
          </Button>
          {user && (
            <Button variant="outline" onClick={() => setShowPlaylistModal(true)}>
              <ListPlus size={16} /> Save
            </Button>
          )}
          <Button variant="outline" onClick={handleShare}>
            <Share2 size={16} /> Share
          </Button>
        </div>
      </div>

      <div className="rounded-xl bg-surface/60 p-4">
        <p className="text-sm font-medium text-text-muted">
          {formatCount(video.views)} views • {timeAgo(video.createdAt)}
        </p>
        <p
          className={`mt-2 whitespace-pre-wrap break-words text-sm ${
            showFullDesc ? "" : "line-clamp-3"
          }`}
        >
          {video.description}
        </p>
        {video.description?.length > 150 && (
          <button
            onClick={() => setShowFullDesc((s) => !s)}
            className="mt-1 text-sm font-semibold text-text-muted hover:text-text"
          >
            {showFullDesc ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      <CommentList videoId={video._id} />

      {showPlaylistModal && (
        <AddToPlaylistModal videoId={video._id} onClose={() => setShowPlaylistModal(false)} />
      )}
    </div>
  );
}
