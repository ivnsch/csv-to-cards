import { useEffect } from "react";
import { loadCSV, loadDone, loadFilters, loadPage, MyCsv } from "./db";
import { CsvRow, useStore } from "./store";

// TODO move loading of db data to root component, like App
// it's functionally ok here since topbar is always shown currently but not quite right
export const TopBar = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  const setData = useStore((state) => state.setData);
  const data = useStore((state) => state.data);
  const setFilters = useStore((state) => state.setFilters);
  const setDone = useStore((state) => state.setDone);
  const setCardIndex = useStore((state) => state.setCardIndex);

  // load db data into zusand
  useEffect(() => {
    const setFromCsv = async () => {
      const savedCsv = await loadCSV();
      if (savedCsv) {
        setData(savedCsv);
      }
      const savedFilters = await loadFilters();
      if (savedFilters) {
        setFilters(savedFilters);
      }

      const savedDone = await loadDone();
      if (savedDone) {
        setDone(savedDone);
      }

      const cardIndex = await loadPage();
      if (cardIndex) {
        setCardIndex(cardIndex);
      }
    };
    setFromCsv();
  }, [setData, setFilters, setDone, setCardIndex]);

  const downloadCsv = () => {
    if (data) {
      downloadAsCSV(data);
    }
  };

  return (
    <div style={styles.topBar}>
      <img
        style={styles.menuImg}
        src="/menu_button.svg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      {title(data)}
      {data && (
        <img
          style={styles.downloadImg}
          src="/download_white.svg"
          onClick={() => downloadCsv()}
        />
      )}
    </div>
  );
};

const title = (data: MyCsv | null): string => {
  return data?.name ?? "Load CSV";
};

const styles: Record<string, React.CSSProperties> = {
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    textAlign: "center",
    width: "100%",
    backgroundColor: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    borderBottom: "0.5px solid gray",
    zIndex: 3,
  },
  menuImg: {
    width: 25,
    height: 25,
    position: "absolute",
    left: 0,
    marginLeft: 20,
    backgroundColor: "none",
    cursor: "pointer",
  },
  downloadImg: {
    width: 25,
    height: 25,
    right: 0,
    marginRight: 20,
    backgroundColor: "none",
    cursor: "pointer",
    position: "absolute",
  },
};

const downloadAsCSV = (data: MyCsv) => {
  const csvString = toString(data.rows);
  triggerDownload(data.name, csvString);
};

const toString = (rows: CsvRow[]): string => {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escapeNewlines(row[h])).join(",")),
  ].join("\n");
};

const triggerDownload = (fileName: string, csvString: string) => {
  const url = toBlobUrl(csvString);
  clickFakeLinkToDownloadUrl(fileName, url);
};

const toBlobUrl = (csvString: string): string => {
  const blob = new Blob([csvString], { type: "text/csv" });
  return URL.createObjectURL(blob);
};

const clickFakeLinkToDownloadUrl = (fileName: string, url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// if we don't do this, multiple lines inside cells will appear as new rows
const escapeNewlines = (value: string) => {
  if (value.includes("\n")) {
    return `"${value}"`;
  }
  return value;
};
