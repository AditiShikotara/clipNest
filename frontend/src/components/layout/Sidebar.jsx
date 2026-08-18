import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  ThumbsUp,
  History,
  ListVideo,
  LayoutDashboard,
  UploadCloud,
  User,
  MessageCircle,
} from "lucide-react";
import { selectCurrentUser } from "../../features/auth/authSlice";

const item =
  "flex items-center gap-4 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-surface-hover";
const activeItem = "bg-surface-hover text-brand";

export default function Sidebar({ open, onClose }) {
  const user = useSelector(selectCurrentUser);

  const links = [{ to: "/", label: "Home", icon: Home, end: true }];

  const authLinks = user
    ? [
        { to: "/liked-videos", label: "Liked videos", icon: ThumbsUp },
        { to: "/history", label: "Watch history", icon: History },
        { to: "/playlists", label: "Playlists", icon: ListVideo },
        { to: "/tweets", label: "Tweets", icon: MessageCircle },
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/upload", label: "Upload video", icon: UploadCloud },
        { to: `/channel/${user.username}`, label: "Your channel", icon: User },
      ]
    : [];

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 shrink-0 transform overflow-y-auto border-r border-border bg-bg pt-16 transition-transform lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:pt-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-1 p-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => `${item} ${isActive ? activeItem : ""}`}
            >
              <Icon size={20} /> {label}
            </NavLink>
          ))}

          {authLinks.length > 0 && (
            <>
              <div className="my-2 border-t border-border" />
              {authLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) => `${item} ${isActive ? activeItem : ""}`}
                >
                  <Icon size={20} /> {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
