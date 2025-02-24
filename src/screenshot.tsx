import html2canvas from "html2canvas";
import { useRef } from "react";

const ScreenshotComponent = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const captureScreenshot = async () => {
    if (!divRef.current) return;

    const canvas = await html2canvas(divRef.current);
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "screenshot.png";
    link.click();
  };

  return (
    <div>
      <div ref={divRef} style={{ padding: 20, background: "lightgray" }}>
        This div will be captured!
      </div>
      <button onClick={captureScreenshot}>Take Screenshot</button>
    </div>
  );
};

export default ScreenshotComponent;
