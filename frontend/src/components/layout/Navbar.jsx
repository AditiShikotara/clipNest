import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Search, Upload, LogOut, User, LayoutDashboard, Play } from "lucide-react";
import toast from "react-hot-toast";
import Avatar from "../common/Avatar";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useLogoutUserMutation } from "../../features/auth/authApiSlice";
import { logOut } from "../../features/auth/authSlice";

export default function Navbar({ onToggleSidebar }) {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch {
      // even if the API call fails, clear local state
    }
    dispatch(logOut());
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-bg/95 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-full p-2 hover:bg-surface-hover lg:hidden"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
            <Play size={16} className="fill-white text-white" />
          </span>
          <span className="hidden text-lg font-bold tracking-tight sm:block">ClipNest</span>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex w-full max-w-xl items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos"
          className="w-full rounded-l-full border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="rounded-r-full border border-l-0 border-border bg-surface-hover px-4 py-2 hover:bg-white/10"
        >
          <Search size={18} />
        </button>
      </form>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link
              to="/upload"
              className="hidden items-center gap-2 rounded-full p-2 hover:bg-surface-hover sm:flex"
              title="Upload video"
            >
              <Upload size={20} />
            </Link>
            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} className="block">
                <Avatar src={user.avatar} name={user.fullName} size={36} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
                    <div className="border-b border-border px-4 py-3">
                      <p className="line-clamp-1 text-sm font-semibold">{user.fullName}</p>
                      <p className="line-clamp-1 text-xs text-text-muted">@{user.username}</p>
                    </div>
                    <Link
                      to={`/channel/${user.username}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-hover"
                    >
                      <User size={16} /> Your channel
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-hover"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-400 hover:bg-surface-hover"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
