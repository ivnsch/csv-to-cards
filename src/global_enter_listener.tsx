import { useEffect } from "react";

// note that this doesn't *not* react to enter pressed in inputs
const GlobalEnterListener = ({ onEnter }: { onEnter: () => void }) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          console.log("Enter pressed globally!");
          onEnter();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return null;
};

export default GlobalEnterListener;
