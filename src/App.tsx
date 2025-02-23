import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import UploadCsv from "./UploadCsv";
import SelectCols from "./SelectCols";
import PagerScreen from "./pager";
import { TopBar } from "./topbar";
import { SideBar } from "./sidebar";

function App() {
  return (
    <>
      <BrowserRouter>
        <SideBar />
        <TopBar />
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
