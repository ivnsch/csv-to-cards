import "./App.css";
import * as Papa from "papaparse";
import { CsvRow, useStore } from "./store";
import { useNavigate } from "react-router-dom";
import { loadCSV, MyCsv, saveCSV } from "./db";
import { useEffect } from "react";

function UploadCsv() {
  const setData = useStore((state) => state.setData);
  const data = useStore((state) => state.data);

  const navigate = useNavigate();

  // load existing file if there's any
  useEffect(() => {
    const setFromCsv = async () => {
      const saved = await loadCSV();
      if (saved) {
        setData(saved);
      }
    };
    setFromCsv();
  }, [setData]);

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
      {data && <div>{data.name}</div>}
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
}

export default UploadCsv;
