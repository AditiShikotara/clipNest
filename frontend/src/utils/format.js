import { formatDistanceToNowStrict } from "date-fns";

export function formatDuration(seconds = 0) {
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export function formatCount(count = 0) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

export function timeAgo(date) {
  if (!date) return "";
  try {
    return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
  } catch {
    return "";
  }
}

// Pulls a readable message out of an RTK Query error object
// (backend wraps every error in ApiError -> { success, message, statusCode }).
export function getErrorMessage(error, fallback = "Something went wrong") {
  if (!error) return fallback;
  return (
    error?.data?.message ||
    error?.error ||
    (typeof error === "string" ? error : null) ||
    fallback
  );
}
