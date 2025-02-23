import "./App.css";
import * as Papa from "papaparse";
import { CsvRow, useStore } from "./store";
import { useNavigate } from "react-router-dom";
import { MyCsv, saveCSV } from "./db";

function UploadCsv() {
  const setData = useStore((state) => state.setData);
  const data = useStore((state) => state.data);

  const navigate = useNavigate();

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

        navigate("/select-cols");
      },
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
}

export default UploadCsv;
