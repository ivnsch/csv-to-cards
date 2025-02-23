import { useEffect } from "react";
import { loadCSV, loadFilters, MyCsv } from "./db";
import { useStore } from "./store";

export const TopBar = () => {
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

  return <div style={styles.topBar}>{title(data)}</div>;
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
    fontWeight: "bold",
    fontSize: "18px",
    borderBottom: "0.5px solid gray",
  },
};
