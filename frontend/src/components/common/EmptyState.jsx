export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface/40 px-6 py-16 text-center">
      {Icon && <Icon size={40} className="text-text-muted" />}
      <p className="text-lg font-medium">{title}</p>
      {description && <p className="max-w-sm text-sm text-text-muted">{description}</p>}
      {action}
    </div>
  );
}
