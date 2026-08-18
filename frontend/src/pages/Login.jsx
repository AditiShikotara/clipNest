import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Play } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useLoginUserMutation } from "../features/auth/authApiSlice";
import { setCredentials } from "../features/auth/authSlice";
import { getErrorMessage } from "../utils/format";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // backend accepts either { email, password } or { username, password }
    const isEmail = identifier.includes("@");
    const credentials = isEmail
      ? { email: identifier.trim(), password }
      : { username: identifier.trim(), password };

    try {
      const res = await loginUser(credentials).unwrap();
      const { user, accessToken } = res.data;
      dispatch(setCredentials({ user, accessToken }));
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Login failed"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand">
            <Play size={22} className="fill-white text-white" />
          </span>
          <h1 className="text-xl font-bold">Sign in to ClipNest</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Username or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="jane_doe or jane@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" loading={isLoading} className="mt-2 w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          New to ClipNest?{" "}
          <Link to="/register" className="font-semibold text-brand hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
