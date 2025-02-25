import { useStore } from "./store";

export const RightBar = () => {
  const data = useStore((state) => state.data);
  const cardIndex = useStore((state) => state.cardIndex);

  return (
    <div style={styles.rightBar}>
      {data &&
        data.rows.map((_, index) => (
          <RowEntry
            key={index}
            index={index}
            highlighted={index == cardIndex}
          />
        ))}
    </div>
  );
};

const RowEntry = ({
  index,
  highlighted,
}: {
  index: number;
  highlighted: boolean;
}) => {
  return (
    <div
      style={{
        ...styles.entry,
        fontWeight: highlighted ? "bold" : "normal",
      }}
    >
      {index}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  rightBar: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "60px",
    height: "100%",
    backgroundColor: "black",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: 60,
    zIndex: 2,
    borderLeft: "0.5px solid gray",
  },
  entry: {
    width: "100%",
    borderBottom: "0.5px solid gray",
    paddingLeft: 10,
    textAlign: "start",
  },
};
