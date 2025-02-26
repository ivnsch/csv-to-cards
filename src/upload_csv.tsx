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
import { useEffect, useState } from "react";
import { fetchSheets, Sheet, signOut, useGoogleAuth } from "./google";

function UploadCsv() {
  const setData = useStore((state) => state.setData);
  const setFilters = useStore((state) => state.setFilters);
  const setDone = useStore((state) => state.setDone);
  const setCardIndex = useStore((state) => state.setCardIndex);

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { email } = useGoogleAuth(setIsSignedIn, setAccessToken);

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

  // TODO bundle this? not quite right to have to check for multiple fields here
  return isSignedIn ? (
    <SignedInView
      email={email}
      accessToken={accessToken}
      onSignout={() => signOut(setIsSignedIn, setAccessToken)}
    />
  ) : (
    <SignedOutView
      onChange={handleFileUpload}
      onUploadClick={triggerFileInput}
      setAccessToken={setAccessToken}
    />
  );
}

export default UploadCsv;

const SignedInView = ({
  email,
  accessToken,
  onSignout,
}: {
  email: string | null;
  accessToken: string | null;
  onSignout: () => void;
}) => {
  console.log("??? access token: " + accessToken);

  return (
    <div>
      {email && <div style={styles.email}>{email}</div>}
      <button onClick={onSignout}>Sign Out</button>
      {accessToken && <SheetsList accessToken={accessToken} />}
    </div>
  );
};

const SignedOutView = ({
  onChange,
  onUploadClick,
  setAccessToken,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadClick: () => void;
  setAccessToken: (token: string | null) => void;
}) => {
  return (
    <div style={styles.container}>
      <GoogleLogin setAccessToken={setAccessToken} />
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
  sheets: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
  sheetEntry: {
    cursor: "pointer",
    marginBottom: 10,
  },
  sheetsLabel: {
    marginBottom: 10,
    marginTop: 20,
  },
};

const SheetsList = ({ accessToken }: { accessToken: string }) => {
  const [sheets, setSheets] = useState<Sheet[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const sheets = await fetchSheets(accessToken);
      setSheets(sheets);
    };
    fetch();
  }, [accessToken]);

  return (
    <div>
      <div style={styles.sheets}>
        <div style={styles.sheetsLabel}>Select a sheet</div>
        {sheets.map((sheet) => (
          <div key={sheet.id} style={styles.sheetEntry}>
            {sheet.name}
          </div>
        ))}
      </div>
    </div>
  );
};
