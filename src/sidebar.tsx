import { useLocation, useNavigate } from "react-router-dom";

export const SideBar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div style={{ ...styles.sideBar, left: isOpen ? "0" : "-220px" }}>
      <SideEntry text="Load CSV" path="/" />
      <SideEntry text="Settings" path="/card-settings" />
      <SideEntry text="Columns" path="/select-cols" />
      <SideEntry text="Cards" path="/pager" />
    </div>
  );
};

const SideEntry = ({ text, path }: { text: string; path: string }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SideEntryInternal
      text={text}
      highlighted={location.pathname === path}
      onClick={() => navigate(path)}
    />
  );
};

const SideEntryInternal = ({
  text,
  highlighted,
  onClick,
}: {
  text: string;
  highlighted: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      style={{
        ...styles.entry,
        fontWeight: highlighted ? "bold" : "normal",
      }}
      onClick={onClick}
    >
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
