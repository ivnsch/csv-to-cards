import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import UploadCsv from "./upload_csv";
import SelectCols from "./select_cols";
import PagerScreen from "./pager";
import { TopBar } from "./topbar";
import { SideBar } from "./sidebar";
import { useState } from "react";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <BrowserRouter>
        <SideBar isOpen={isSidebarOpen} />
        <TopBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
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
