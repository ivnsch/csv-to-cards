import { useNavigate } from "react-router-dom";
import "./App.css";
import { useStore } from "./store";
import { saveFilters } from "./db";
import { CheckboxRow } from "./checkbox_row";

function SelectCols() {
  const filters = useStore((state) => state.filters);
  const setCustomLayout = useStore((state) => state.setCustomLayout);
  const customLayout = useStore((state) => state.customLayout);

  const toggleFilter = useStore((state) => state.toggleFilter);
  const navigate = useNavigate();

  const toggleFilterAndSave = (header: string) => {
    toggleFilter(header);

    const updatedFilters = useStore.getState().filters;
    saveFilters(updatedFilters);
  };

  return (
    <div style={styles.container}>
      <div style={styles.scrollContainer}>
        <div style={styles.label}>Select columns to show</div>
        {Object.keys(filters).map((header) => (
          <CheckboxRow
            key={header}
            value={header}
            isChecked={(value) => filters[value]}
            toggleCheckbox={toggleFilterAndSave}
          />
        ))}
        <div style={styles.label}>Custom layout</div>
        <textarea
          placeholder="Enter custom format"
          onChange={(e) => setCustomLayout(e.target.value)}
          value={customLayout}
          style={styles.textarea}
        />
      </div>

      <button
        onClick={() => {
          navigate("/pager");
        }}
      >
        Show cards
      </button>
    </div>
  );
}

export default SelectCols;

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  scrollContainer: {
    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: "calc(100vh - 300px)",
    marginBottom: 50,
    paddingRight: 30,
  },
  label: {
    marginBottom: "20px",
  },
  header: {
    color: "white",
    marginBottom: 50,
    fontSize: 20,
  },
  filterText: {
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
  startButton: {
    bottom: 50,
  },
  textarea: {
    width: "100%",
    height: 100,
    background: "transparent",
    padding: 10,
  },
};
