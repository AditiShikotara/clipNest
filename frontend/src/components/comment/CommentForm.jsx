import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useAddCommentMutation } from "../../features/comment/commentApiSlice";
import { getErrorMessage } from "../../utils/format";

export default function CommentForm({ videoId }) {
  const user = useSelector(selectCurrentUser);
  const [content, setContent] = useState("");
  const [addComment, { isLoading }] = useAddCommentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await addComment({ videoId, content: content.trim() }).unwrap();
      setContent("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not post comment"));
    }
  };

  if (!user) {
    return <p className="text-sm text-text-muted">Sign in to leave a comment.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Avatar src={user.avatar} name={user.fullName} size={36} />
      <div className="flex-1">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border-b border-border bg-transparent pb-2 text-sm outline-none focus:border-brand"
        />
        {content.trim() && (
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setContent("")}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Comment
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
