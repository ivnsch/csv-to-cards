import { useEffect } from "react";
import { loadCSV, loadFilters, MyCsv } from "./db";
import { useStore } from "./store";

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

  // load existing csv and filters if there's any
  useEffect(() => {
    const setFromCsv = async () => {
      const savedCsv = await loadCSV();
      if (savedCsv) {
        setData(savedCsv);
      }
      const savedFilters = await loadFilters();
      console.log("loading saved filters: " + JSON.stringify(savedFilters));

      if (savedFilters) {
        setFilters(savedFilters);
      }
    };
    setFromCsv();
  }, [setData, setFilters]);

  return (
    <div style={styles.topBar}>
      <img
        style={styles.menuImg}
        src="/menu_button.svg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      {title(data)}
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
    width: 30,
    height: 50,
    position: "absolute",
    left: 0,
    marginLeft: 20,
    backgroundColor: "none",
    cursor: "pointer",
  },
};
