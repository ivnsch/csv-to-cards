import { useNavigate } from "react-router-dom";
import "./App.css";
import { useStore } from "./store";
import { saveFilters, saveTemplate } from "./db";
import { CheckboxRow } from "./checkbox_row";
import { Tooltip } from "react-tooltip";

function SelectCols() {
  const filters = useStore((state) => state.filters);
  const setTemplate = useStore((state) => state.setTemplate);
  const template = useStore((state) => state.template);

  const toggleFilter = useStore((state) => state.toggleFilter);
  const navigate = useNavigate();

  const toggleFilterAndSave = (header: string) => {
    toggleFilter(header);

    const updatedFilters = useStore.getState().filters;
    saveFilters(updatedFilters);
  };

  const setAndSaveTemplate = async (layout: string) => {
    setTemplate(layout);
    await saveTemplate(layout);
  };

  return (
    <div style={styles.container}>
      <div style={styles.scrollContainer}>
        <div style={styles.label}>Default layout</div>
        {Object.keys(filters).map((header) => (
          <CheckboxRow
            key={header}
            value={header}
            isChecked={(value) => filters[value]}
            toggleCheckbox={toggleFilterAndSave}
          />
        ))}
        <Separator />
        <div style={styles.templateRow}>
          <div style={styles.label}>Template</div>
          <div
            data-tooltip-id="help-tooltip"
            style={styles.helpIcon}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundImage = "url('help_white.svg')")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundImage = "url('help_grey.svg')")
            }
          />
          <Tooltip
            id="help-tooltip"
            place="top"
            content="Enter a template with column names like this: $column"
          />
        </div>

        <textarea
          onChange={(e) => setAndSaveTemplate(e.target.value)}
          value={template}
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

const Separator = () => {
  return (
    <div style={styles.separatorContainer}>
      <hr style={styles.leftLine} />
      <span style={styles.text}>OR</span>
      <hr style={styles.rightLine} />
    </div>
  );
};

export default SelectCols;

const styles: Record<string, React.CSSProperties> = {
  separatorContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  leftLine: {
    flex: 1,
    border: "none",
    borderTop: "1px solid white",
    marginRight: 10,
  },
  rightLine: {
    flex: 1,
    border: "none",
    borderTop: "1px solid white",
    marginLeft: 10,
  },
  text: {
    padding: "0 10px",
    whiteSpace: "nowrap",
  },
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
    textAlign: "start",
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
    // padding: 10,
  },
  templateRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
  },
  helpIcon: {
    width: 25,
    height: 25,
    marginLeft: "auto",
    cursor: "pointer",
    backgroundImage: "url('/help_grey.svg')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
};
