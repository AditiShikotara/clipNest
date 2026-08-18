import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useCreateTweetMutation } from "../../features/tweet/tweetApiSlice";
import { getErrorMessage } from "../../utils/format";

export default function TweetForm() {
  const user = useSelector(selectCurrentUser);
  const [content, setContent] = useState("");
  const [createTweet, { isLoading }] = useCreateTweetMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await createTweet({ content: content.trim() }).unwrap();
      setContent("");
      toast.success("Tweet posted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not post tweet"));
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 rounded-xl border border-border bg-surface/40 p-4">
      <Avatar src={user.avatar} name={user.fullName} size={40} />
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          rows={2}
          className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-text-muted"
        />
        <div className="mt-2 flex justify-end">
          <Button type="submit" disabled={!content.trim()} loading={isLoading}>
            Tweet
          </Button>
        </div>
      </div>
    </form>
  );
}
