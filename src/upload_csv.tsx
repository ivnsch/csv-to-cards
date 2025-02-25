import "./App.css";
import * as Papa from "papaparse";
import { CsvRow, useStore } from "./store";
import { useNavigate } from "react-router-dom";
import { deleteDone, deleteFilters, deletePage, MyCsv, saveCSV } from "./db";

function UploadCsv() {
  const setData = useStore((state) => state.setData);

  const navigate = useNavigate();

  const triggerFileInput = () => {
    document.getElementById("fileUpload")?.click();
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

        console.log(csvEntries);

        const csv = new MyCsv(file.name, csvEntries);

        setData(csv);

        saveCSV(csv);
        deleteFilters();
        deletePage();
        deleteDone();

        navigate("/card-settings");
      },
    });
  };

  return (
    <div style={styles.container}>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        id="fileUpload"
        style={styles.input}
      />
      <button
        type="button"
        onClick={triggerFileInput}
        style={styles.customButton}
      >
        Upload CSV
      </button>
    </div>
  );
}

export default UploadCsv;

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50px",
    width: "100%",
  },
  input: {
    display: "none",
  },
};
