import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logOut, selectCurrentUser } from "../features/auth/authSlice";
import { useRefreshAccessTokenMutation } from "../features/auth/authApiSlice";
import Loader from "../components/common/Loader";

// On first load, if we have a persisted "logged-in" user in localStorage but no
// in-memory accessToken (e.g. page refresh), try to silently refresh the session
// using the httpOnly refreshToken cookie via POST /users/refresh-token.
export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();
  const persistedUser = useSelector(selectCurrentUser);
  const [refreshAccessToken] = useRefreshAccessTokenMutation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!persistedUser) {
        setReady(true);
        return;
      }

      try {
        const result = await refreshAccessToken().unwrap();
        if (!cancelled) {
          dispatch(setCredentials({ user: persistedUser, accessToken: result.data.accessToken }));
        }
      } catch {
        if (!cancelled) dispatch(logOut());
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return <Loader full />;

  return children;
}
