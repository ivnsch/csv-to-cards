import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { CsvRow, Filters, useStore } from "./store";
import { loadPage, savePage } from "./db";
import html2canvas from "html2canvas";

export default function PagerScreen() {
  const data = useStore((state) => state.data);
  const filters = useStore((state) => state.filters);
  const showHeaders = useStore((state) => state.cardSettings.showHeaders);

  const cardRef = useRef<HTMLDivElement>(null);

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

  const captureScreenshot = async () => {
    console.log("???");

    if (!cardRef.current) return;
    console.log("!!!");

    const canvas = await html2canvas(cardRef.current);
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "screenshot.png";
    link.click();
  };

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
              showHeaders={showHeaders}
              cardRef={cardRef}
              onShare={captureScreenshot}
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
  showHeaders,
  cardRef,
  onShare,
}: {
  content: CsvRow;
  index: number;
  filters: Filters;
  pageCount: number;
  showHeaders: boolean;
  cardRef: RefObject<HTMLDivElement | null>;
  onShare: () => void;
}) => {
  return (
    <div style={styles.page}>
      <PageTopbar index={index} pageCount={pageCount} onShare={onShare} />
      <div style={styles.card} ref={cardRef}>
        {Object.entries(content)
          .filter(([key, _]) => filters[key])
          .map((entry) => (
            <PageEntry key={entry[0]} entry={entry} showKey={showHeaders} />
          ))}
      </div>
    </div>
  );
};

const PageEntry = ({
  entry,
  showKey,
}: {
  entry: [string, string];
  showKey: boolean;
}) => {
  const [key, value] = entry;
  return (
    <div style={styles.entry}>
      {showKey && <div style={styles.header}>{key}</div>}
      {isImageUrl(value) ? (
        <ImageValue src={value} />
      ) : isValidUrl(value) ? (
        <LinkValue href={value} />
      ) : (
        <PlainTextValue text={value} />
      )}
    </div>
  );
};

const ImageValue = ({ src }: { src: string }) => {
  return (
    <div style={styles.imageContainer}>
      <img src={src} alt="Loaded content" style={styles.image} />
      <div style={styles.imageText}>{src}</div>
    </div>
  );
};

const LinkValue = ({ href }: { href: string }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.valueLink}
    >
      {href}
    </a>
  );
};

const PlainTextValue = ({ text }: { text: string }) => {
  return <div style={styles.value}>{text}</div>;
};

const PageTopbar = ({
  index,
  pageCount,
  onShare,
}: {
  index: number;
  pageCount: number;
  onShare: () => void;
}) => {
  return (
    <div style={styles.pageTopBar}>
      <div style={styles.pageIndex}>
        {index + 1} / {pageCount}
      </div>
      <div
        style={styles.shareIcon}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundImage =
            "url('camera_button_white.svg')")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundImage =
            "url('camera_button_grey.svg')")
        }
        onClick={() => onShare()}
      />
    </div>
  );
};

const isValidUrl = (text: string): boolean => {
  try {
    new URL(text);
    return true;
  } catch (_) {
    return false;
  }
};

const isImageUrl = (url: string): boolean => {
  return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url.trim());
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
  shareIcon: {
    width: 25,
    height: 25,
    marginLeft: "auto",
    cursor: "pointer",
    backgroundImage: "url('/camera_button_grey.svg')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  card: {
    width: "90%",
    padding: 20,
    marginBottom: "20px",
    borderLeft: "0.5px solid white",
    backgroundColor: "black",
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
  imageText: {
    ...baseValue,
    fontSize: 12,
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
    color: "#999999",
    fontSize: 14,
  },
  pageTopBar: {
    display: "flex",
    position: "absolute",
    width: "100%",
    top: -40,
    alignItems: "flex-end",
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
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
};
