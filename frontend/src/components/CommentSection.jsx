import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Pencil, Trash2, Check, X } from "lucide-react"
import toast from "react-hot-toast"
import { commentApi } from "../api/endpoints"
import { useAuth } from "../context/AuthContext"
import Loader from "./Loader"

export default function CommentSection({ videoId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")
  const [posting, setPosting] = useState(false)

  const loadComments = async () => {
    try {
      const data = await commentApi.getForVideo(videoId)
      setComments(data.docs || [])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [videoId])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setPosting(true)
    try {
      await commentApi.add(videoId, text.trim())
      setText("")
      loadComments()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setPosting(false)
    }
  }

  const handleUpdate = async (commentId) => {
    if (!editText.trim()) return
    try {
      await commentApi.update(commentId, editText.trim())
      setEditingId(null)
      loadComments()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await commentApi.delete(commentId)
      loadComments()
      toast.success("Comment deleted")
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <h3 className="font-display mb-4 text-base font-semibold">
        {comments.length} comments
      </h3>

      {user && (
        <form onSubmit={handleAdd} className="mb-6 flex gap-3">
          <img
            src={user.avatar}
            alt=""
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
          <div className="flex-1">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment"
              className="w-full border-b border-border bg-transparent pb-2 text-sm outline-none focus:border-accent"
            />
            {text && (
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setText("")}
                  className="rounded-full px-3 py-1.5 text-sm text-muted hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  disabled={posting}
                  className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-bg disabled:opacity-50"
                >
                  Comment
                </button>
              </div>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <Loader label="Loading comments" />
      ) : (
        <div className="flex flex-col gap-5">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-3">
              <img
                src={c.owner?.avatar}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">{c.owner?.username}</span>
                  <span className="font-mono text-xs text-muted">
                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {editingId === c._id ? (
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 border-b border-accent bg-transparent pb-1 text-sm outline-none"
                      autoFocus
                    />
                    <button onClick={() => handleUpdate(c._id)} className="text-mint">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-muted">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <p className="mt-0.5 text-sm text-ink/90">{c.content}</p>
                )}

                {user?._id === c.owner?._id && editingId !== c._id && (
                  <div className="mt-1 flex gap-3">
                    <button
                      onClick={() => {
                        setEditingId(c._id)
                        setEditText(c.content)
                      }}
                      className="flex items-center gap-1 text-xs text-muted hover:text-ink"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="flex items-center gap-1 text-xs text-muted hover:text-accent"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-muted">No comments yet. Be the first.</p>
          )}
        </div>
      )}
    </div>
  )
}
