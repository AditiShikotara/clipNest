import { useState } from "react";
import { useGetVideoCommentsQuery } from "../../features/comment/commentApiSlice";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import Loader from "../common/Loader";
import Button from "../common/Button";
import { formatCount } from "../../utils/format";

export default function CommentList({ videoId }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetVideoCommentsQuery({ videoId, page, limit: 10 });

  const result = data?.data;
  const comments = result?.docs || [];

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-base font-semibold">
        {result?.totalDocs ? formatCount(result.totalDocs) : 0} Comments
      </h3>

      <div className="mb-6">
        <CommentForm videoId={videoId} />
      </div>

      {isLoading ? (
        <Loader />
      ) : comments.length === 0 ? (
        <p className="text-sm text-text-muted">No comments yet. Be the first to comment.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} videoId={videoId} />
          ))}
        </div>
      )}

      {result && result.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            disabled={!result.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-text-muted">
            Page {result.page} of {result.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={!result.hasNextPage}
            loading={isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
