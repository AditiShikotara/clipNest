import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Play, ImagePlus } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useRegisterUserMutation } from "../features/auth/authApiSlice";
import { getErrorMessage } from "../utils/format";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!avatar) {
      toast.error("Avatar image is required");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", form.fullName.trim());
    formData.append("email", form.email.trim());
    formData.append("username", form.username.trim().toLowerCase());
    formData.append("password", form.password);
    formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      await registerUser(formData).unwrap();
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(getErrorMessage(err, "Registration failed"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand">
            <Play size={22} className="fill-white text-white" />
          </span>
          <h1 className="text-xl font-bold">Create your ClipNest account</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Full name" value={form.fullName} onChange={update("fullName")} required />
          <Input label="Username" value={form.username} onChange={update("username")} required />
          <Input label="Email" type="email" value={form.email} onChange={update("email")} required />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={update("password")}
            required
          />

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-text-muted">Avatar (required)</span>
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2.5">
              <ImagePlus size={18} className="text-text-muted" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                className="flex-1 text-xs text-text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-hover file:px-3 file:py-1.5 file:text-xs file:text-text"
                required
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-text-muted">Cover image (optional)</span>
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2.5">
              <ImagePlus size={18} className="text-text-muted" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                className="flex-1 text-xs text-text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-hover file:px-3 file:py-1.5 file:text-xs file:text-text"
              />
            </div>
          </label>

          <Button type="submit" loading={isLoading} className="mt-2 w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
