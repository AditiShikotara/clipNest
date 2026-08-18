import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Pencil, Trash2, ThumbsUp, Check, X } from "lucide-react"
import toast from "react-hot-toast"
import { tweetApi, likeApi } from "../api/endpoints"
import { useAuth } from "../context/AuthContext"

export default function TweetCard({ tweet, onChange }) {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(tweet.content)
  const [liked, setLiked] = useState(false)

  const handleUpdate = async () => {
    if (!text.trim()) return
    try {
      await tweetApi.update(tweet._id, text.trim())
      setEditing(false)
      onChange?.()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async () => {
    try {
      await tweetApi.delete(tweet._id)
      onChange?.()
      toast.success("Post deleted")
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleLike = async () => {
    if (!user) return toast.error("Sign in to like posts")
    try {
      const res = await likeApi.toggleTweet(tweet._id)
      setLiked(res.isLiked)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted">
          {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
        </span>
        {user?._id === tweet.owner && (
          <div className="flex gap-3">
            <button onClick={() => setEditing((v) => !v)} className="text-muted hover:text-ink">
              <Pencil size={14} />
            </button>
            <button onClick={handleDelete} className="text-muted hover:text-accent">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="mt-2 flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border-b border-accent bg-transparent pb-1 text-sm outline-none"
          />
          <button onClick={handleUpdate} className="text-mint">
            <Check size={16} />
          </button>
          <button onClick={() => setEditing(false)} className="text-muted">
            <X size={16} />
          </button>
        </div>
      ) : (
        <p className="mt-2 text-sm text-ink/90">{tweet.content}</p>
      )}

      <button
        onClick={handleLike}
        className={`mt-3 flex items-center gap-1.5 text-xs ${
          liked ? "text-accent" : "text-muted hover:text-ink"
        }`}
      >
        <ThumbsUp size={14} /> {liked ? "Liked" : "Like"}
      </button>
    </div>
  )
}
