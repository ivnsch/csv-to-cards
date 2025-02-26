import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import UploadCsv from "./upload_csv";
import SelectCols from "./select_cols";
import PagerScreen from "./pager";
import { TopBar } from "./topbar";
import { SideBar } from "./sidebar";
import { useState } from "react";
import CardSettingsView from "./card_settings";
import { RightBar } from "./rightbar";
import Shortcuts from "./shortcuts";
import { Terms } from "./terms";

function App() {
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <SideBar isOpen={isSidebarOpen} />
      {location.pathname === "/pager" && <RightBar />}
      <TopBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Routes>
        <Route path="/" element={<UploadCsv />} />
        <Route path="/card-settings" element={<CardSettingsView />} />
        <Route path="/select-cols" element={<SelectCols />} />
        <Route path="/pager" element={<PagerScreen />} />
        <Route path="/shortcuts" element={<Shortcuts />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </>
  );
}

export default App;
