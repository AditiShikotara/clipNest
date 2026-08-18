import { useState } from "react"
import toast from "react-hot-toast"
import { tweetApi } from "../api/endpoints"
import { useAuth } from "../context/AuthContext"

export default function TweetComposer({ onPosted }) {
  const { user } = useAuth()
  const [text, setText] = useState("")
  const [posting, setPosting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setPosting(true)
    try {
      await tweetApi.create(text.trim())
      setText("")
      onPosted?.()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setPosting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex gap-3 rounded-xl border border-border bg-surface p-4"
    >
      <img src={user?.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share something with your subscribers"
          rows={2}
          className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted"
        />
        <div className="flex justify-end">
          <button
            disabled={posting || !text.trim()}
            className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-bg disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </div>
    </form>
  )
}
