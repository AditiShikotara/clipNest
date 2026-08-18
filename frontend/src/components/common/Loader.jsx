export default function Loader({ size = "md", full = false }) {
  const sizes = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };

  const spinner = (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-2 border-white/20 border-t-brand`}
    />
  );

  if (full) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
