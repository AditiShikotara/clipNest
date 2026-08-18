import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-6xl font-bold text-brand">404</h1>
      <p className="text-lg font-medium">Page not found</p>
      <p className="max-w-sm text-sm text-text-muted">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button className="mt-2">Go home</Button>
      </Link>
    </div>
  );
}
