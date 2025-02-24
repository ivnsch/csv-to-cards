import { useNavigate } from "react-router-dom";

export const SideBar = ({ isOpen }: { isOpen: boolean }) => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.sideBar, left: isOpen ? "0" : "-220px" }}>
      <SideEntry text="Load CSV" onClick={() => navigate("/")} />
      <SideEntry text="Settings" onClick={() => navigate("/card-settings")} />
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
    width: "200px",
    height: "100%",
    backgroundColor: "black",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    borderRight: "0.5px solid gray",
    paddingTop: 100,
    paddingLeft: 20,
    transition: "left 0.3s ease-in-out",
    zIndex: 2,
  },
  entry: {
    marginBottom: 20,
    cursor: "pointer",
  },
};
