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
import {
  fetchSheetAsCSV,
  fetchSheets,
  Sheet,
  //   signOut,
  //   useGoogleAuth,
} from "./google";

function UploadCsv() {
  const setData = useStore((state) => state.setData);
  const setFilters = useStore((state) => state.setFilters);
  const setDone = useStore((state) => state.setDone);
  const setCardIndex = useStore((state) => state.setCardIndex);

  //   const [isSignedIn, setIsSignedIn] = useState(false);
  //   const [accessToken, setAccessToken] = useState<string | null>(null);
  //   const { email } = useGoogleAuth(setIsSignedIn, setAccessToken);

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

  const onParsedCsv = (fileName: string, result: Papa.ParseResult<CsvRow>) => {
    const csvEntries = result.data;
    const headers = result.meta.fields || [];

    const csv = new MyCsv(fileName, headers, csvEntries);
    initCsv(csv);
  };

  const initCsv = (csv: MyCsv) => {
    clearAllState();

    setData(csv);
    saveCSV(csv);

    navigate("/card-settings");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: Papa.ParseResult<CsvRow>) => {
        onParsedCsv(file.name, result);
      },
    });
  };

  return (
    <DefaultView onChange={handleFileUpload} onUploadClick={triggerFileInput} />
  );

  //   return isSignedIn ? (
  //     <SignedInView
  //       email={email}
  //       accessToken={accessToken}
  //       onSignout={() => signOut(setIsSignedIn, setAccessToken)}
  //       onParsedSelectedCsv={(fileName, result) => onParsedCsv(fileName, result)}
  //     />
  //   ) : (
  //     <SignedOutView
  //       onChange={handleFileUpload}
  //       onUploadClick={triggerFileInput}
  //       setAccessToken={setAccessToken}
  //     />
  //   );
}

export default UploadCsv;

const DefaultView = ({
  onChange,
  onUploadClick,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadClick: () => void;
}) => {
  return (
    <div style={styles.container}>
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

// @ts-ignore
const SignedInView = ({
  email,
  accessToken,
  onSignout,
  onParsedSelectedCsv,
}: {
  email: string | null;
  accessToken: string | null;
  onSignout: () => void;
  onParsedSelectedCsv: (
    fileName: string,
    parseResult: Papa.ParseResult<CsvRow>
  ) => void;
}) => {
  return (
    <div>
      {email && <div style={styles.email}>{email}</div>}
      <button onClick={onSignout}>Sign Out</button>
      {accessToken && (
        <SheetsList
          accessToken={accessToken}
          onParsedSelectedCsv={onParsedSelectedCsv}
        />
      )}
    </div>
  );
};

// @ts-ignore
const foo = () => {
  console.log("Hello");
};

// @ts-ignore
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

const SheetsList = ({
  accessToken,
  onParsedSelectedCsv,
}: {
  accessToken: string;
  onParsedSelectedCsv: (
    fileName: string,
    parseResult: Papa.ParseResult<CsvRow>
  ) => void;
}) => {
  const [sheets, setSheets] = useState<Sheet[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const sheets = await fetchSheets(accessToken);
      setSheets(sheets);
    };
    fetch();
  }, [accessToken]);

  const fetchSheet = async (sheet: Sheet) => {
    const csvString = await fetchSheetAsCSV(sheet.id, accessToken);
    console.log("csv: " + JSON.stringify(csvString));
    const parsed = parseCsvString(csvString);
    console.log("parsed: " + JSON.stringify(parsed));
    onParsedSelectedCsv(sheet.name, parsed);
  };

  return (
    <div>
      <div style={styles.sheets}>
        <div style={styles.sheetsLabel}>Select a sheet</div>
        {sheets.map((sheet) => (
          <div
            key={sheet.id}
            style={styles.sheetEntry}
            onClick={() => fetchSheet(sheet)}
          >
            {sheet.name}
          </div>
        ))}
      </div>
    </div>
  );
};

const parseCsvString = (str: string): Papa.ParseResult<CsvRow> => {
  return Papa.parse<CsvRow>(str, {
    header: true,
    skipEmptyLines: true,
  });
};
