import "./App.css";

export const Privacy = () => {
  return (
    <div style={styles.container}>
      <div style={styles.title}>Privacy policy</div>
      <div>
        CSV To Cards (the "App") respects your privacy. This Privacy Policy
        explains how we handle your information when you use the App.
      </div>

      <b>1. No Data Collection</b>

      <div>
        We do not collect, store, or process any personal data from users. The
        App does not require user accounts, track user activity, or collect any
        personally identifiable information.
      </div>

      <b>2. Changes to This Policy</b>

      <div>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on the Website.
      </div>
      <div>
        By using this App, you acknowledge that you have read and understood
        this Privacy Policy.
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    maxWidth: 400,
    textAlign: "start",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
  },
};
