import { useState } from "react";
import { signIn, signOut, useGoogleAuth } from "./google";

const GoogleLogin = ({
  setAccessToken,
}: {
  setAccessToken: (token: string | null) => void;
}) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useGoogleAuth(setIsSignedIn, setAccessToken);

  return (
    <div>
      {isSignedIn ? (
        <button onClick={() => signOut(setIsSignedIn, setAccessToken)}>
          Sign Out
        </button>
      ) : (
        <button onClick={() => signIn(setIsSignedIn, setAccessToken)}>
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default GoogleLogin;
