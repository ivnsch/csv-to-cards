import { useState } from "react";
import { signIn, signOut, useGoogleAuth } from "./google";

const GoogleLogin = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useGoogleAuth(setIsSignedIn);

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
