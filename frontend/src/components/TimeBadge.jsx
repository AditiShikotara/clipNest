function formatTimecode(seconds = 0) {
  const s = Math.floor(seconds % 60)
  const m = Math.floor((seconds / 60) % 60)
  const h = Math.floor(seconds / 3600)
  const pad = (n) => String(n).padStart(2, "0")
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

export default function TimeBadge({ seconds }) {
  return (
    <span className="font-mono absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-ink">
      {formatTimecode(seconds)}
    </span>
  )
}
