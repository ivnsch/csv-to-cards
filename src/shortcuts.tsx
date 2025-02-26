import "./App.css";

function Shortcuts() {
  const shortcuts = [
    { short: "↵ Enter", descr: 'Mark cards as "done"' },
    { short: "← → Arrows", descr: "Previous / next card " },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.title}>Shortcuts</div>
      {shortcuts.map((s) => (
        <ShortcutEntry shortcut={s} />
      ))}
    </div>
  );
}

const ShortcutEntry = ({ shortcut }: { shortcut: Shortcut }) => {
  return (
    <div style={styles.shortcut}>
      <span style={styles.short}>{shortcut.short}:&nbsp;</span>
      <span>{shortcut.descr}</span>
    </div>
  );
};

type Shortcut = {
  short: string;
  descr: string;
};

export default Shortcuts;

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  shortcut: {
    display: "flex",
    flexDirection: "row",
  },
  short: {
    fontWeight: "bold",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
  },
};
