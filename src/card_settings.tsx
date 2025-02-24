import { useNavigate } from "react-router-dom";
import "./App.css";
import { useStore } from "./store";
import { saveFilters } from "./db";
import { CheckboxRow } from "./checkbox_row";

function CardSettingsView() {
  const settings = useStore((state) => state.cardSettings);
  const toggleShowHeaders = useStore((state) => state.toggleShowHeaders);

  const navigate = useNavigate();

  const toggleShowHeadersAndSave = () => {
    toggleShowHeaders();
    saveSettings();
  };

  const saveSettings = () => {
    const updatedFilters = useStore.getState().filters;
    saveFilters(updatedFilters);
  };

  return (
    <div style={styles.container}>
      <div style={styles.label}>Card settings</div>
      <CheckboxRow
        key={"headers"}
        value={"Show headers"}
        isChecked={() => settings.showHeaders}
        toggleCheckbox={() => toggleShowHeadersAndSave()}
      />
      <button
        onClick={() => {
          navigate("/select-cols");
        }}
      >
        Select columns
      </button>
    </div>
  );
}

export default CardSettingsView;

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  label: {
    marginBottom: "20px",
  },
  startButton: {
    bottom: 50,
  },
};
