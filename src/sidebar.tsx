import { useLocation, useNavigate } from "react-router-dom";

export const SideBar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div style={{ ...styles.sideBar, left: isOpen ? "0" : "-220px" }}>
      <SideEntry text="CSV" image="/upload.svg" path="/" />
      <SideEntry text="Settings" image="/gear.svg" path="/card-settings" />
      <SideEntry text="Columns" image="/columns.svg" path="/select-cols" />
      <SideEntry text="Cards" image="card.svg" path="/pager" />
      <div style={styles.separator} />
      <SideEntry text="Shortcuts" image="keyboard.svg" path="/shortcuts" />
      <SideEntry text="Terms" image="legal.svg" path="/terms" />
    </div>
  );
};

const SideEntry = ({
  text,
  path,
  image,
}: {
  text: string;
  path: string;
  image: string;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SideEntryInternal
      text={text}
      highlighted={location.pathname === path}
      image={image}
      onClick={() => navigate(path)}
    />
  );
};

const SideEntryInternal = ({
  text,
  highlighted,
  image,
  onClick,
}: {
  text: string;
  highlighted: boolean;
  image: string;
  onClick: () => void;
}) => {
  return (
    <div style={styles.entryContainer}>
      <img src={image} style={styles.entryImg} />
      <div
        style={{
          ...styles.entry,
          fontWeight: highlighted ? "bold" : "normal",
        }}
        onClick={onClick}
      >
        {text}
      </div>
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
  entryContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
    gap: "8px",
  },
  entryImg: {
    width: 25,
    height: 25,
    verticalAlign: "middle",
    display: "inline-block",
    marginBottom: 4,
  },
  entry: {
    cursor: "pointer",
  },
  separator: {
    borderBottom: "0.5px solid gray",
    // marginTop: 20,
    marginBottom: 30,
    height: 20,
    // backgroundColor: "red",
    width: "80%",
  },
};
