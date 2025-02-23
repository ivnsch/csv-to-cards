import { useState } from "react";
import { useStore } from "./store";

export default function PagerScreen() {
  const data = useStore((state) => state.data);
  const filters = useStore((state) => state.filters);

  const [index, setIndex] = useState(0);

  const nextCard = () =>
    setIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));
  const prevCard = () => setIndex((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <div style={styles.container}>
      <div>
        <div
          style={{
            border: "1px solid black",
            padding: "20px",
            marginBottom: "10px",
          }}
        >
          {JSON.stringify(data[index])}
        </div>
        <button onClick={prevCard} disabled={index === 0}>
          Previous
        </button>
        <button onClick={nextCard} disabled={index === data.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "#1E1E1E",

    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Android shadow
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
    bottom: 20,
    right: 30,
    textAlign: "right",
    position: "absolute",

    color: "#999999",
    fontSize: 16,
  },
  pageIndexContainer: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
};
