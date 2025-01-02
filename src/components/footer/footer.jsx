// File Location: src/components/footer/footer.jsx

import React from "react";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>O & J</p>
      <div className={styles.divider}></div>
      <p>3.13.2026</p>
    </footer>
  );
}
