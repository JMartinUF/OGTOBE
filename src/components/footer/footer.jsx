import React from "react";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>J & O</p>
      <hr className={styles.divider} />
      <p>3.13.2026</p>
    </footer>
  );
}
