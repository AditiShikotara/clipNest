export default function Input({ label, error, className = "", textarea = false, ...props }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && <span className="font-medium text-text-muted">{label}</span>}
      <Tag
        className={`w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-text outline-none placeholder:text-text-muted focus:border-brand ${
          textarea ? "min-h-[100px] resize-y" : ""
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
}
