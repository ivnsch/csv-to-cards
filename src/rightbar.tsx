import { useEffect, useRef } from "react";
import { savePage } from "./db";
import { useStore } from "./store";

export const RightBar = () => {
  const data = useStore((state) => state.data);
  const cardIndex = useStore((state) => state.cardIndex);
  const setCardIndex = useStore((state) => state.setCardIndex);
  const done = useStore((state) => state.done);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const isDone = (rowIndex: number) => done[rowIndex] ?? false;

  const setIndexAndSave = (index: number) => {
    setCardIndex(index);
    savePage(index);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current.children[cardIndex] as HTMLElement;
    if (element) {
      containerRef.current.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  }, [cardIndex]);

  return (
    <div ref={containerRef} style={styles.rightBar}>
      {data &&
        data.rows.map((_, index) => (
          <RowEntry
            key={index}
            index={index}
            highlighted={index == cardIndex}
            done={isDone(index)}
            onClick={() => setIndexAndSave(index)}
          />
        ))}
    </div>
  );
};

const RowEntry = ({
  index,
  highlighted,
  done,
  onClick,
}: {
  index: number;
  highlighted: boolean;
  done: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      style={{
        ...styles.entry,
        ...(done && styles.entryDone),
        fontWeight: highlighted ? "bold" : "normal",
      }}
      onClick={onClick}
    >
      {index + 1}
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
    marginTop: 60,
    zIndex: 2,
    borderLeft: "0.5px solid gray",
    overflowY: "auto",
    overflowX: "hidden",
  },
  entry: {
    width: "100%",
    borderBottom: "0.5px solid gray",
    paddingLeft: 10,
    textAlign: "start",
    cursor: "pointer",
  },
  entryDone: {
    borderLeft: "1px solid #39FF14",
  },
};
