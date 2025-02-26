import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/userinfo.email";

export const useGoogleAuth = (
  setIsSignedIn: (signedIn: boolean) => void,
  setAccessToken: (token: string) => void
) => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      await gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
      });

      const authInstance = gapi.auth2.getAuthInstance();
      const isSignedIn = authInstance.isSignedIn.get();

      setIsSignedIn(isSignedIn);

      // set email
      if (isSignedIn) {
        const user = authInstance.currentUser.get();
        setEmail(user.getBasicProfile().getEmail());
      }

      // set access token
      const accessToken = authInstance.currentUser
        .get()
        .getAuthResponse().access_token;
      setAccessToken(accessToken);

      // listen to changes of signedin status
      authInstance.isSignedIn.listen((signedIn: boolean) => {
        setIsSignedIn(signedIn);
        if (signedIn) {
          const user = authInstance.currentUser.get();
          setEmail(user.getBasicProfile().getEmail());
          const accessToken = authInstance.currentUser
            .get()
            .getAuthResponse().access_token;
          setAccessToken(accessToken);
        } else {
          setEmail(null);
        }
      });
    };

    gapi.load("client:auth2", initAuth);
  }, [setIsSignedIn, setAccessToken]);

  return { email };
};

export const signIn = async (
  setIsSignedIn: (signedIn: boolean) => void,
  setAccessToken: (token: string) => void
) => {
  const authInstance = gapi.auth2.getAuthInstance();
  await authInstance.signIn();
  setIsSignedIn(true);
  console.log("requesting access token");

  const accessToken = authInstance.currentUser
    .get()
    .getAuthResponse().access_token;
  console.log("got access token: " + accessToken);

  const user = gapi.auth2.getAuthInstance().currentUser.get();
  const email = user.getBasicProfile().getEmail();
  console.log("email: " + email);

  // authInstance.currentUser.get()
  setAccessToken(accessToken);
};

export const signOut = (
  setIsSignedIn: (signedIn: boolean) => void,
  setAccessToken: (token: string | null) => void
) => {
  gapi.auth2.getAuthInstance().signOut();
  setIsSignedIn(false);
  setAccessToken(null);
};

export const fetchSheets = async (accessToken: string): Promise<Sheet[]> => {
  const response = await fetch(
    "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const data = await response.json();
  return data.files;
};

export type Sheet = {
  id: string;
  name: string;
};

export const fetchSheetAsCSV = async (
  sheetId: string,
  accessToken: string
): Promise<string> => {
  const response = await fetch(
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch CSV");

  return await response.text();
};
