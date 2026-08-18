import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Heart, MoreVertical } from "lucide-react";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useUpdateTweetMutation, useDeleteTweetMutation } from "../../features/tweet/tweetApiSlice";
import { useToggleTweetLikeMutation } from "../../features/like/likeApiSlice";
import { timeAgo, getErrorMessage } from "../../utils/format";

export default function TweetItem({ tweet }) {
  const user = useSelector(selectCurrentUser);
  const owner = tweet.owner || tweet.ownerDetails;
  const isOwner = user?._id === (tweet.owner?._id || tweet.owner);

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(tweet.content);
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const [updateTweet, { isLoading: updating }] = useUpdateTweetMutation();
  const [deleteTweet] = useDeleteTweetMutation();
  const [toggleTweetLike] = useToggleTweetLikeMutation();

  const handleUpdate = async () => {
    if (!content.trim()) return;
    try {
      await updateTweet({ tweetId: tweet._id, content: content.trim() }).unwrap();
      setEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTweet(tweet._id).unwrap();
      toast.success("Tweet deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleLike = async () => {
    if (!user) return toast.error("Sign in to like tweets");
    try {
      const res = await toggleTweetLike(tweet._id).unwrap();
      setLiked(res.data.isLiked);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="flex gap-3 rounded-xl border border-border bg-surface/40 p-4">
      <Avatar src={owner?.avatar} name={owner?.fullName} size={40} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{owner?.fullName}</span>
            <span className="text-xs text-text-muted">@{owner?.username}</span>
            <span className="text-xs text-text-muted">• {timeAgo(tweet.createdAt)}</span>
          </div>

          {isOwner && (
            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} className="rounded-full p-1 hover:bg-surface-hover">
                <MoreVertical size={16} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-1 w-32 overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
                    <button
                      onClick={() => {
                        setEditing(true);
                        setMenuOpen(false);
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-surface-hover"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleDelete();
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-surface-hover"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {editing ? (
          <div className="mt-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              className="w-full resize-none border-b border-border bg-transparent text-sm outline-none focus:border-brand"
              autoFocus
            />
            <div className="mt-2 flex gap-2">
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} loading={updating}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 whitespace-pre-wrap break-words text-sm">{tweet.content}</p>
        )}

        <button
          onClick={handleLike}
          className={`mt-2 flex items-center gap-1 text-xs ${
            liked ? "text-brand" : "text-text-muted hover:text-text"
          }`}
        >
          <Heart size={14} className={liked ? "fill-brand" : ""} /> Like
        </button>
      </div>
    </div>
  );
}
