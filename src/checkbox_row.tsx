export const CheckboxRow = ({
  value,
  isChecked,
  toggleCheckbox,
}: {
  value: string;
  isChecked: (value: string) => boolean;
  toggleCheckbox: (value: string) => void;
}) => {
  return (
    <div key={value} style={styles.filter}>
      <button onClick={() => toggleCheckbox(value)} style={styles.checkbox}>
        {isChecked(value) && <span style={styles.checkmark}>✔</span>}
      </button>
      <span style={styles.filterText}>{value}</span>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  filter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 20,
  },
  filterText: {
    textAlign: "center",
    color: "white",
    marginLeft: 10,
    fontSize: 20,
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
};
