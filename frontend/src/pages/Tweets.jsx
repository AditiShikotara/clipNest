import { useSelector } from "react-redux";
import { MessageCircle } from "lucide-react";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useGetUserTweetsQuery } from "../features/tweet/tweetApiSlice";
import TweetForm from "../components/tweet/TweetForm";
import TweetItem from "../components/tweet/TweetItem";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

export default function Tweets() {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading } = useGetUserTweetsQuery(user?._id, { skip: !user });

  const tweets = data?.data || [];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-5 flex items-center gap-2 text-xl font-bold">
        <MessageCircle size={20} /> Your tweets
      </h1>

      <div className="mb-6">
        <TweetForm />
      </div>

      {isLoading ? (
        <Loader />
      ) : tweets.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No tweets yet" description="Share your first thought above." />
      ) : (
        <div className="flex flex-col gap-3">
          {tweets.map((t) => (
            <TweetItem key={t._id} tweet={{ ...t, owner: t.ownerDetails }} />
          ))}
        </div>
      )}
    </div>
  );
}
