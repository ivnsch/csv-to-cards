import { useCallback, useEffect, useState } from "react";
import { CsvRow, Filters, useStore } from "./store";
import { loadPage, savePage } from "./db";

export default function PagerScreen() {
  const data = useStore((state) => state.data);
  const filters = useStore((state) => state.filters);

  const [index, setIndex] = useState(0);

  // load index if saved
  useEffect(() => {
    const initPage = async () => {
      const savedPage = await loadPage();
      if (savedPage) {
        setIndex(savedPage);
      }
    };
    initPage();
  }, []);

  const setIndexAndSave = useCallback((updater: (prev: number) => number) => {
    setIndex((prev) => {
      const newIndex = updater(prev);
      savePage(newIndex);
      return newIndex;
    });
  }, []);

  const nextCard = useCallback(() => {
    if (!data?.rows) return;
    setIndexAndSave((prev) => (prev < data.rows.length - 1 ? prev + 1 : prev));
  }, [data, setIndexAndSave]);

  const prevCard = useCallback(() => {
    setIndexAndSave((prev) => (prev > 0 ? prev - 1 : prev));
  }, [setIndexAndSave]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") nextCard();
      if (event.key === "ArrowLeft") prevCard();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextCard, prevCard]);

  return (
    <div style={styles.container}>
      {data && (
        <div>
          <div>
            <Page
              key={index}
              content={data.rows[index]}
              index={index}
              filters={filters}
              pageCount={data.rows.length}
            />
          </div>
          <button
            style={styles.previousButton}
            onClick={prevCard}
            disabled={index === 0}
          >
            Previous
          </button>
          <button onClick={nextCard} disabled={index === data.rows.length - 1}>
            Next
          </button>
        </div>
      )}
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
      <div style={styles.pageIndexContainer}>
        <div style={styles.pageIndex}>
          {index + 1} / {pageCount}
        </div>
      </div>
      <div style={styles.card}>
        {Object.entries(content)
          .filter(([key, _]) => filters[key])
          .map((entry) => (
            <PageEntry key={entry[0]} entry={entry} />
          ))}
      </div>
    </div>
  );
};

const PageEntry = ({ entry }: { entry: [string, string] }) => {
  const [key, value] = entry;
  return (
    <div style={styles.entry}>
      <div style={styles.header}>{key}</div>
      {isValidUrl(value) ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.value}
        >
          {value}
        </a>
      ) : (
        <div style={styles.value}>{value}</div>
      )}
    </div>
  );
};

const isValidUrl = (text: string): boolean => {
  try {
    new URL(text); // ✅ This will throw an error if it's not a valid URL
    return true;
  } catch (_) {
    return false;
  }
};

const baseValue: React.CSSProperties = {
  color: "#EAEAEA",
  fontSize: 24,
  marginBottom: 10,
  whiteSpace: "pre-line",
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    position: "relative",
  },
  card: {
    width: "90%",
    padding: 20,
    marginBottom: "20px",
    borderLeft: "0.5px solid white",
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
    ...baseValue,
  },
  valueLink: {
    ...baseValue,
    cursor: "pointer",
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
    textAlign: "center",
    color: "#ffffff",
    fontSize: 12,
  },
  pageIndexContainer: {
    position: "absolute",
    width: "100%",
    top: -40,
  },
  previousButton: {
    marginRight: "10px",
  },
  entry: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 5,
    alignItems: "flex-start",
  },
};
