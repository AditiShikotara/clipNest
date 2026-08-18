import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Bell, BellRing, Users } from "lucide-react";
import { useGetUserChannelProfileQuery } from "../features/auth/authApiSlice";
import { useGetAllVideosQuery } from "../features/video/videoApiSlice";
import { useGetUserPlaylistsQuery } from "../features/playlist/playlistApiSlice";
import { useGetUserTweetsQuery } from "../features/tweet/tweetApiSlice";
import { useGetUserChannelSubscribersQuery } from "../features/subscription/subscriptionApiSlice";
import { useToggleSubscriptionMutation } from "../features/subscription/subscriptionApiSlice";
import { selectCurrentUser } from "../features/auth/authSlice";
import Avatar from "../components/common/Avatar";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import VideoGrid from "../components/video/VideoGrid";
import PlaylistCard from "../components/playlist/PlaylistCard";
import TweetItem from "../components/tweet/TweetItem";
import EmptyState from "../components/common/EmptyState";
import { formatCount, getErrorMessage } from "../utils/format";

const TABS = ["Videos", "Playlists", "Tweets", "Subscribers", "About"];

export default function Channel() {
  const { username } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const [tab, setTab] = useState("Videos");
  const [subscribed, setSubscribed] = useState(null);

  const { data, isLoading, refetch } = useGetUserChannelProfileQuery(username);
  const channel = data?.data;
  const isOwnChannel = currentUser?.username === username;
  const [toggleSubscription, { isLoading: subscribing }] = useToggleSubscriptionMutation();

  if (isLoading) return <Loader full />;
  if (!channel) {
    return (
      <EmptyState title="Channel not found" description="This channel does not exist." />
    );
  }

  const isSubscribed = subscribed === null ? channel.isSubscribed : subscribed;

  const handleSubscribe = async () => {
    if (!currentUser) return toast.error("Sign in to subscribe");
    try {
      const res = await toggleSubscription(channel._id).unwrap();
      setSubscribed(res.data.subscribed);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      {channel.coverImage && (
        <div className="mb-4 h-32 w-full overflow-hidden rounded-xl bg-surface sm:h-48">
          <img src={channel.coverImage} alt="cover" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Avatar src={channel.avatar} name={channel.fullName} size={80} />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold">{channel.fullName}</h1>
          <p className="text-sm text-text-muted">@{channel.username}</p>
          <p className="mt-1 text-sm text-text-muted">
            {formatCount(channel.subscribersCount)} subscribers •{" "}
            {formatCount(channel.channelsSubscribedToCount)} subscribed
          </p>
        </div>
        {!isOwnChannel && (
          <Button
            variant={isSubscribed ? "secondary" : "primary"}
            loading={subscribing}
            onClick={handleSubscribe}
          >
            {isSubscribed ? <BellRing size={16} /> : <Bell size={16} />}
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        )}
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t
                ? "border-brand text-text"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Videos" && <ChannelVideos userId={channel._id} />}
      {tab === "Playlists" && <ChannelPlaylists userId={channel._id} />}
      {tab === "Tweets" && <ChannelTweets userId={channel._id} />}
      {tab === "Subscribers" && <ChannelSubscribers channelId={channel._id} />}
      {tab === "About" && <ChannelAbout channel={channel} />}
    </div>
  );
}

function ChannelVideos({ userId }) {
  const { data, isLoading } = useGetAllVideosQuery({ userId, limit: 20 });
  if (isLoading) return <Loader />;
  return <VideoGrid videos={data?.data?.docs} emptyTitle="No videos published yet" />;
}

function ChannelPlaylists({ userId }) {
  const { data, isLoading } = useGetUserPlaylistsQuery(userId);
  if (isLoading) return <Loader />;
  const playlists = data?.data || [];
  if (!playlists.length) return <EmptyState title="No playlists yet" />;
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {playlists.map((p) => (
        <PlaylistCard key={p._id} playlist={p} />
      ))}
    </div>
  );
}

function ChannelTweets({ userId }) {
  const { data, isLoading } = useGetUserTweetsQuery(userId);
  if (isLoading) return <Loader />;
  const tweets = data?.data || [];
  if (!tweets.length) return <EmptyState title="No tweets yet" />;
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      {tweets.map((t) => (
        <TweetItem key={t._id} tweet={{ ...t, owner: t.ownerDetails }} />
      ))}
    </div>
  );
}

function ChannelSubscribers({ channelId }) {
  const { data, isLoading } = useGetUserChannelSubscribersQuery(channelId);
  if (isLoading) return <Loader />;
  const subs = data?.data || [];
  if (!subs.length) return <EmptyState icon={Users} title="No subscribers yet" />;
  return (
    <div className="flex flex-col gap-3">
      {subs.map((s) => (
        <div key={s._id} className="flex items-center gap-3">
          <Avatar src={s.subscriber?.avatar} name={s.subscriber?.fullName} size={44} />
          <div>
            <p className="text-sm font-semibold">{s.subscriber?.fullName}</p>
            <p className="text-xs text-text-muted">@{s.subscriber?.username}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChannelAbout({ channel }) {
  return (
    <div className="max-w-xl space-y-2 text-sm">
      <p>
        <span className="font-semibold text-text-muted">Full name: </span>
        {channel.fullName}
      </p>
      <p>
        <span className="font-semibold text-text-muted">Username: </span>@{channel.username}
      </p>
      {channel.email && (
        <p>
          <span className="font-semibold text-text-muted">Email: </span>
          {channel.email}
        </p>
      )}
    </div>
  );
}
