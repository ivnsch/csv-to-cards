import { useNavigate } from "react-router-dom";
import "./App.css";
import { useStore } from "./store";
import { saveFilters } from "./db";
import { CheckboxRow } from "./checkbox_row";

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
    <div style={styles.container}>
      <div style={styles.label}>Select columns to show</div>
      {Object.keys(filters).map((header) => (
        <CheckboxRow
          key={header}
          value={header}
          isChecked={(value) => filters[value]}
          toggleCheckbox={toggleFilterAndSave}
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

export default SelectCols;

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
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
};
