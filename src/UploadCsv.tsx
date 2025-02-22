import "./App.css";
import * as Papa from "papaparse";
import { CsvRow, useStore } from "./store";

function UploadCsv() {
  const setData = useStore((state) => state.setData);
  const data = useStore((state) => state.data);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: Papa.ParseResult<CsvRow>) => {
        setData(result.data);
        console.log(result.data);
      },
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val as string}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UploadCsv;
