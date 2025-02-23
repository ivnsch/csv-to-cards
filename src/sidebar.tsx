import { useNavigate } from "react-router-dom";

export const SideBar = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.sideBar}>
      <SideEntry text="Load CSV" onClick={() => navigate("/")} />
      <SideEntry text="Columns" onClick={() => navigate("/select-cols")} />
      <SideEntry text="Cards" onClick={() => navigate("/pager")} />
    </div>
  );
};

const SideEntry = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <div style={styles.entry} onClick={onClick}>
      {text}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sideBar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 200,
    height: "100%",
    backgroundColor: "black",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    borderRight: "0.5px solid gray",
    paddingTop: 100,
    paddingLeft: 20,
  },
  entry: {
    marginBottom: 20,
    cursor: "pointer",
  },
};
