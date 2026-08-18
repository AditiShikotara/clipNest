import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Settings as SettingsIcon } from "lucide-react";
import { selectCurrentUser, updateUser } from "../features/auth/authSlice";
import {
  useUpdateAccountDetailsMutation,
  useUpdateUserAvatarMutation,
  useUpdateUserCoverImageMutation,
  useChangeCurrentPasswordMutation,
} from "../features/auth/authApiSlice";
import Avatar from "../components/common/Avatar";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { getErrorMessage } from "../utils/format";

export default function Settings() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 flex items-center gap-2 text-xl font-bold">
        <SettingsIcon size={20} /> Account settings
      </h1>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-text-muted">Profile images</h2>
        <ImageSection user={user} dispatch={dispatch} />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-text-muted">Account details</h2>
        <AccountDetailsForm user={user} dispatch={dispatch} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-text-muted">Change password</h2>
        <PasswordForm />
      </section>
    </div>
  );
}

function ImageSection({ user, dispatch }) {
  const [updateUserAvatar, { isLoading: avatarLoading }] = useUpdateUserAvatarMutation();
  const [updateUserCoverImage, { isLoading: coverLoading }] = useUpdateUserCoverImageMutation();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await updateUserAvatar(formData).unwrap();
      dispatch(updateUser(res.data));
      toast.success("Avatar updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("coverImage", file);
    try {
      const res = await updateUserCoverImage(formData).unwrap();
      dispatch(updateUser(res.data));
      toast.success("Cover image updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface/50 p-4">
      <div className="flex items-center gap-4">
        <Avatar src={user?.avatar} name={user?.fullName} size={64} />
        <div>
          <p className="mb-1 text-sm font-medium">Avatar</p>
          <label className="cursor-pointer text-xs font-semibold text-brand hover:underline">
            {avatarLoading ? "Uploading..." : "Change avatar"}
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={avatarLoading} />
          </label>
        </div>
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">Cover image</p>
        {user?.coverImage && (
          <img src={user.coverImage} alt="cover" className="mb-2 h-24 w-full rounded-lg object-cover" />
        )}
        <label className="cursor-pointer text-xs font-semibold text-brand hover:underline">
          {coverLoading ? "Uploading..." : "Change cover image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} disabled={coverLoading} />
        </label>
      </div>
    </div>
  );
}

function AccountDetailsForm({ user, dispatch }) {
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [updateAccountDetails, { isLoading }] = useUpdateAccountDetailsMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateAccountDetails({ fullName: fullName.trim(), email: email.trim() }).unwrap();
      dispatch(updateUser(res.data));
      toast.success("Account updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-border bg-surface/50 p-4">
      <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Button type="submit" loading={isLoading} className="self-start">
        Save changes
      </Button>
    </form>
  );
}

function PasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changeCurrentPassword, { isLoading }] = useChangeCurrentPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changeCurrentPassword({ oldPassword, newPassword }).unwrap();
      setOldPassword("");
      setNewPassword("");
      toast.success("Password changed");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not change password"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-border bg-surface/50 p-4">
      <Input
        label="Current password"
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
      />
      <Input
        label="New password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <Button type="submit" loading={isLoading} className="self-start">
        Update password
      </Button>
    </form>
  );
}
