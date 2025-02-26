import "./App.css";
import * as Papa from "papaparse";
import { CsvRow, useStore } from "./store";
import { useNavigate } from "react-router-dom";
import {
  deleteCSV,
  deleteDone,
  deleteFilters,
  deletePage,
  MyCsv,
  saveCSV,
} from "./db";
import GoogleLogin from "./google_login";
import { useState } from "react";
import { gapi } from "gapi-script";
import { signOut, useGoogleAuth } from "./google";

function UploadCsv() {
  const setData = useStore((state) => state.setData);
  const setFilters = useStore((state) => state.setFilters);
  const setDone = useStore((state) => state.setDone);
  const setCardIndex = useStore((state) => state.setCardIndex);

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { email } = useGoogleAuth(setIsSignedIn);

  const navigate = useNavigate();

  const triggerFileInput = () => {
    document.getElementById("fileUpload")?.click();
  };

  const clearAllState = () => {
    // zustand
    setData(null);
    setFilters({});
    setCardIndex(0);
    setDone([]);

    // storage
    deleteCSV();
    deleteFilters();
    deletePage();
    deleteDone();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("loaded file: " + file.name);

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: Papa.ParseResult<CsvRow>) => {
        const csvEntries = result.data;
        const headers = result.meta.fields || [];

        const csv = new MyCsv(file.name, headers, csvEntries);

        clearAllState();

        setData(csv);
        saveCSV(csv);

        navigate("/card-settings");
      },
    });
  };

  return isSignedIn ? (
    <SignedInView
      email={email}
      onSignout={() => signOut(setIsSignedIn, setAccessToken)}
    />
  ) : (
    <SignedOutView
      onChange={handleFileUpload}
      onUploadClick={triggerFileInput}
    />
  );
}

export default UploadCsv;

const SignedInView = ({
  email,
  onSignout,
}: {
  email: string | null;
  onSignout: () => void;
}) => {
  return (
    <div>
      {email && <div style={styles.email}>{email}</div>}
      <button onClick={onSignout}>Sign Out</button>
    </div>
  );
};

const SignedOutView = ({
  onChange,
  onUploadClick,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadClick: () => void;
}) => {
  return (
    <div style={styles.container}>
      <GoogleLogin />
      <div style={styles.or}>Or</div>
      <input
        type="file"
        accept=".csv"
        onChange={onChange}
        id="fileUpload"
        style={styles.input}
      />
      <button type="button" onClick={onUploadClick} style={styles.customButton}>
        Upload CSV
      </button>
      {/* <SheetsList /> */}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50px",
    width: "100%",
    flexDirection: "column",
  },
  input: {
    display: "none",
  },
  email: {
    marginBottom: 10,
  },
  or: {
    marginTop: 10,
    marginBottom: 10,
  },
};

const SheetsList = () => {
  const [sheets, setSheets] = useState<{ id: string; name: string }[]>([]);

  const fetchSheets = async () => {
    const accessToken = gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().access_token;
    console.log("token?" + accessToken);

    const response = await fetch(
      "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const data = await response.json();
    setSheets(data.files);
  };

  return (
    <div>
      <button onClick={fetchSheets}>List My Google Sheets</button>
      <ul>
        {sheets.map((sheet) => (
          <li key={sheet.id}>{sheet.name}</li>
        ))}
      </ul>
    </div>
  );
};
