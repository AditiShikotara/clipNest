import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ThumbsUp, MoreVertical } from "lucide-react";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { selectCurrentUser } from "../../features/auth/authSlice";
import {
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "../../features/comment/commentApiSlice";
import { useToggleCommentLikeMutation } from "../../features/like/likeApiSlice";
import { timeAgo, getErrorMessage } from "../../utils/format";

export default function CommentItem({ comment, videoId }) {
  const user = useSelector(selectCurrentUser);
  const isOwner = user?._id === comment.owner?._id;

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const [updateComment, { isLoading: updating }] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [toggleCommentLike] = useToggleCommentLikeMutation();

  const handleUpdate = async () => {
    if (!content.trim()) return;
    try {
      await updateComment({ commentId: comment._id, content: content.trim(), videoId }).unwrap();
      setEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update comment"));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment({ commentId: comment._id, videoId }).unwrap();
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete comment"));
    }
  };

  const handleLike = async () => {
    if (!user) return toast.error("Sign in to like comments");
    try {
      const res = await toggleCommentLike(comment._id).unwrap();
      setLiked(res.data.isLiked);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="flex gap-3">
      <Avatar src={comment.owner?.avatar} name={comment.owner?.fullName} size={36} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{comment.owner?.fullName}</span>
          <span className="text-xs text-text-muted">{timeAgo(comment.createdAt)}</span>
        </div>

        {editing ? (
          <div className="mt-1">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border-b border-border bg-transparent pb-1 text-sm outline-none focus:border-brand"
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
          <p className="mt-0.5 whitespace-pre-wrap break-words text-sm">{comment.content}</p>
        )}

        <div className="mt-1 flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs ${
              liked ? "text-brand" : "text-text-muted hover:text-text"
            }`}
          >
            <ThumbsUp size={14} /> Like
          </button>
        </div>
      </div>

      {isOwner && !editing && (
        <div className="relative shrink-0">
          <button onClick={() => setMenuOpen((o) => !o)} className="rounded-full p-1.5 hover:bg-surface-hover">
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
  );
}
