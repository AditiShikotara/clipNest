export default function Avatar({ src, name = "?", size = 40, className = "" }) {
  const dimension = { width: size, height: size };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={dimension}
        className={`rounded-full object-cover shrink-0 bg-surface ${className}`}
      />
    );
  }

  return (
    <div
      style={dimension}
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand/80 font-semibold text-white ${className}`}
    >
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}
