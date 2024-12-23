// File Location: src/components/modal/modal.jsx

import React from "react";
import styles from "./modal.module.css";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
