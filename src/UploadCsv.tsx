import { useState } from "react";
import "./App.css";
import * as Papa from "papaparse";

function UploadCsv() {
  const [data, setData] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true, // Set to false if you don't want headers
      skipEmptyLines: true,
      complete: (result) => {
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
