import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { CsvRow, Filters, useStore } from "./store";
import { loadPage, saveCSV, saveDone, savePage } from "./db";
import html2canvas from "html2canvas";
import GlobalEnterListener from "./global_enter_listener";

export default function PagerScreen() {
  const data = useStore((state) => state.data);
  const filters = useStore((state) => state.filters);
  const showHeaders = useStore((state) => state.cardSettings.showHeaders);
  const toggleDone = useStore((state) => state.toggleDone);
  const done = useStore((state) => state.done);
  const index = useStore((state) => state.cardIndex);
  const setIndex = useStore((state) => state.setCardIndex);

  const isDone = (rowIndex: number) => done[rowIndex] ?? false;

  const cardRef = useRef<HTMLDivElement>(null);

  // load index if saved
  useEffect(() => {
    const initPage = async () => {
      const savedPage = await loadPage();
      if (savedPage != null) {
        setIndex(savedPage);
      }
    };
    initPage();
  }, [setIndex]);

  const setIndexAndSave = useCallback(
    (updater: (prev: number) => number) => {
      const newIndex = updater(useStore.getState().cardIndex);
      setIndex(newIndex);
      savePage(newIndex);
    },
    [setIndex]
  );

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
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current);
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "screenshot.png";
    link.click();
  };

  const toggleDoneAndSave = async () => {
    const savedPage = await loadPage();
    if (savedPage != null) {
      toggleDone(savedPage);
    }
    const latestDone = useStore.getState().done;
    saveDone(latestDone);
  };

  return (
    <div style={styles.container}>
      <GlobalEnterListener onEnter={async () => toggleDoneAndSave()} />
      {data && (
        <div>
          <div>
            <Page
              key={index}
              content={data.rows[index]}
              index={index}
              setIndex={setIndex}
              filters={filters}
              pageCount={data.rows.length}
              showHeaders={showHeaders}
              cardRef={cardRef}
              onShare={captureScreenshot}
              isDone={isDone(index)}
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
  setIndex,
  filters,
  pageCount,
  showHeaders,
  cardRef,
  onShare,
  isDone,
}: {
  content: CsvRow;
  index: number;
  setIndex: (index: number) => void;
  filters: Filters;
  pageCount: number;
  showHeaders: boolean;
  cardRef: RefObject<HTMLDivElement | null>;
  onShare: () => void;
  isDone: boolean;
}) => {
  const pageStyle = {
    ...styles.page,
    ...(isDone ? styles.cardGreenLeftBorder : styles.cardWhiteLeftBorder),
  };

  return (
    <div style={pageStyle}>
      <PageTopbar
        index={index}
        setIndex={setIndex}
        pageCount={pageCount}
        onShare={onShare}
      />
      <div style={styles.card} ref={cardRef}>
        {Object.entries(content)
          .filter(([key, _]) => filters[key])
          .map((entry) => (
            <PageEntry
              index={index}
              key={entry[0]}
              entry={entry}
              showKey={showHeaders}
            />
          ))}
      </div>
    </div>
  );
};

const PageEntry = ({
  index,
  entry,
  showKey,
}: {
  index: number;
  entry: [string, string];
  showKey: boolean;
}) => {
  const [key, value] = entry;
  return (
    <div style={styles.entry}>
      {showKey && <div style={styles.header}>{key}</div>}
      <div style={styles.valueRow}>
        <Value index={index} column={key} />
        <CopyButton value={value} />
      </div>
    </div>
  );
};

const CopyButton = ({ value }: { value: string }) => {
  return (
    <div
      style={styles.copyIcon}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundImage = "url('copy_white.svg')")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundImage = "url('copy_grey.svg')")
      }
      onClick={() => copyToClipboard(value)}
    />
  );
};

const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Copied to clipboard:", text);
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
    });
};

const Value = ({ index, column }: { index: number; column: string }) => {
  return <EditableValue index={index} column={column} />;
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

const EditableValue = ({
  index,
  column,
}: {
  index: number;
  column: string;
}) => {
  const cell = useStore((state) => state.cell);
  const updateCell = useStore((state) => state.updateCell);

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (newValue: string) => {
    updateCell(index, column, newValue);
    const latestData = useStore.getState().data;
    if (latestData) {
      saveCSV(latestData);
    }
  };

  const value = (): string => {
    return cell(index, column);
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={value()}
          autoFocus
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          style={styles.editInput}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") {
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <span onClick={() => setIsEditing(true)} style={styles.value}>
          {value()}
        </span>
      )}
    </div>
  );
};

const PageTopbar = ({
  index,
  setIndex,
  pageCount,
  onShare,
}: {
  index: number;
  setIndex: (index: number) => void;
  pageCount: number;
  onShare: () => void;
}) => {
  return (
    <div style={styles.pageTopBar}>
      <CurrentPageIndicator
        index={index}
        setIndex={setIndex}
        pageCount={pageCount}
      />
      <CameraButton onShare={onShare} />
    </div>
  );
};

const CurrentPageIndicator = ({
  index,
  setIndex,
  pageCount,
}: {
  index: number;
  setIndex: (index: number) => void;
  pageCount: number;
}) => {
  const pageNumber = index + 1;

  const [isEditing, setIsEditing] = useState(false);
  const [tmpPageNumber, setTmpPageNumber] = useState(`${pageNumber}`);

  return (
    <div style={styles.pageIndex}>
      {isEditing ? (
        <input
          type="text"
          value={tmpPageNumber}
          autoFocus
          onChange={(e) => setTmpPageNumber(e.target.value)}
          onBlur={() => setIsEditing(false)}
          style={styles.editPageInput}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") {
              setIsEditing(false);
              if (e.key === "Enter") {
                const res = parseInt(tmpPageNumber);
                if (res) {
                  setIndex(res - 1);
                }
              }
            }
          }}
        />
      ) : (
        <span style={{ cursor: "pointer" }} onClick={() => setIsEditing(true)}>
          {pageNumber}
        </span>
      )}
      <span> / {pageCount} </span>
    </div>
  );
};

const CameraButton = ({ onShare }: { onShare: () => void }) => {
  return (
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
  whiteSpace: "pre-line",
};

const editInputBase: React.CSSProperties = {
  border: "none",
  borderBottom: "1px solid white",
  outline: "none",
  background: "transparent",
  color: "white",
  padding: "5px 0",
  fontSize: "16px",
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
  copyIcon: {
    width: 25,
    height: 25,
    cursor: "pointer",
    backgroundImage: "url('/copy_grey.svg')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    marginLeft: 10,
    marginBottom: 6,
  },
  card: {
    width: "100%",
    padding: 20,
    marginBottom: "20px",
    backgroundColor: "black",
  },
  cardWhiteLeftBorder: {
    borderLeft: "0.5px solid white",
  },
  cardGreenLeftBorder: {
    borderLeft: "0.5px solid #39FF14",
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
    cursor: "pointer",
  },
  valueRow: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: 10,
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
  editInput: {
    ...editInputBase,
  },
  editPageInput: {
    ...editInputBase,
    width: 30,
  },
};
