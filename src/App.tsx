import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import UploadCsv from "./UploadCsv";
import SelectCols from "./SelectCols";
import PagerScreen from "./pager";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UploadCsv />} />
          <Route path="/select-cols" element={<SelectCols />} />
          <Route path="/pager" element={<PagerScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
