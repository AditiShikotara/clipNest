import Loader from "./Loader";

const variants = {
  primary: "bg-brand hover:bg-brand-hover text-white",
  secondary: "bg-surface-hover hover:bg-white/20 text-text",
  outline: "border border-border hover:bg-surface-hover text-text",
  ghost: "hover:bg-surface-hover text-text",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader size="sm" />}
      {children}
    </button>
  );
}
