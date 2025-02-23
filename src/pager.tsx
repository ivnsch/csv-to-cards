import { useEffect, useState } from "react";
import { CsvRow, Filters, useStore } from "./store";

export default function PagerScreen() {
  const data = useStore((state) => state.data);
  const filters = useStore((state) => state.filters);

  const [index, setIndex] = useState(0);

  const nextCard = () =>
    setIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));

  const prevCard = () => setIndex((prev) => (prev > 0 ? prev - 1 : prev));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") nextCard();
      if (event.key === "ArrowLeft") prevCard();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div style={styles.container}>
      <div>
        <div>
          <Page
            key={index}
            content={data[index]}
            index={index}
            filters={filters}
            pageCount={data.length}
          />
        </div>
        <button
          style={styles.previousButton}
          onClick={prevCard}
          disabled={index === 0}
        >
          Previous
        </button>
        <button onClick={nextCard} disabled={index === data.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
}

const Page = ({
  content,
  index,
  filters,
  pageCount,
}: {
  content: CsvRow;
  index: number;
  filters: Filters;
  pageCount: number;
}) => {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {Object.entries(content)
          .filter(([key, _]) => filters[key])
          .map((entry) => (
            <PageEntry key={entry[0]} entry={entry} />
          ))}
        <div style={styles.pageIndexContainer}>
          <div style={styles.pageIndex}>
            {index + 1} / {pageCount}
          </div>
        </div>
      </div>
    </div>
  );
};

const PageEntry = ({ entry }: { entry: [string, string] }) => {
  const [key, value] = entry;
  return (
    <div style={{ flexDirection: "column", marginBottom: 5 }}>
      <div style={styles.header}>{key}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
};

const styles = {
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "#1E1E1E",
    marginBottom: "20px",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    position: "relative",
  },
  header: { color: "#999999" },
  cell: { flex: 1, padding: 8, textAlign: "center", color: "white" },

  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  value: {
    color: "#EAEAEA",
    fontSize: 24,
    marginBottom: 10,
    whiteSpace: "pre-line",
  },
  text: {
    color: "#EAEAEA",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  pageIndex: {
    textAlign: "right",
    color: "#999999",
    fontSize: 12,
  },
  pageIndexContainer: {
    position: "absolute",
    width: "100%",
    left: "-10px",
    bottom: "10px",
  },
  previousButton: {
    marginRight: "10px",
  },
};
