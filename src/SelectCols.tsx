import { useNavigate } from "react-router-dom";
import "./App.css";
import { useStore } from "./store";
import { saveFilters } from "./db";

function SelectCols() {
  const filters = useStore((state) => state.filters);

  const toggleFilter = useStore((state) => state.toggleFilter);
  const navigate = useNavigate();

  const toggleFilterAndSave = (header: string) => {
    toggleFilter(header);

    const updatedFilters = useStore.getState().filters;
    saveFilters(updatedFilters);
  };

  return (
    <div>
      <div style={styles.label}>Select columns to show</div>
      {Object.keys(filters).map((header) => (
        <FilterRow
          key={header}
          header={header}
          filters={filters}
          toggleFilter={toggleFilterAndSave}
        />
      ))}
      <button
        onClick={() => {
          navigate("/pager");
        }}
      >
        Cards
      </button>
    </div>
  );
}

const FilterRow = ({
  header,
  filters,
  toggleFilter,
}: {
  header: string;
  filters: Record<string, boolean>;
  toggleFilter: (header: string) => void;
}) => {
  return (
    <div key={header} style={styles.filter}>
      <button onClick={() => toggleFilter(header)} style={styles.checkbox}>
        {filters[header] && <span style={styles.checkmark}>✔</span>}
      </button>
      <span style={styles.filterText}>{header}</span>
    </div>
  );
};

export default SelectCols;

const styles: Record<string, React.CSSProperties> = {
  label: {
    marginBottom: "20px",
  },
  container: {
    display: "flex",
    alignItems: "center",
    marginTop: 100,
  },
  header: {
    color: "white",
    marginBottom: 50,
    fontSize: 20,
  },
  filter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 20,
  },
  containerInScrollView: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: 5,
    alignItems: "flex-start",
    width: "100%",
  },
  filterText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginLeft: 10,
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  checkbox: {
    display: "flex",
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: { color: "#BB86FC", fontSize: 20 },
  startButton: {
    bottom: 50,
  },
};
