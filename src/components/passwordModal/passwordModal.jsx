// File Location: src/components/passwordModal/passwordModal.jsx

import React, { useState } from "react";
import styles from "./passwordModal.module.css";

export default function PasswordModal({ isOpen, onVerify }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    const adminPassword = "admin2026"; // Admin password
    const guestPassword = "guest2026"; // Guest password

    if (password === adminPassword) {
      onVerify("admin"); // Pass role as 'admin'
    } else if (password === guestPassword) {
      onVerify("guest"); // Pass role as 'guest'
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Enter Password</h2>
        <input
          type="password"
          className={styles.input}
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} onClick={handleVerify}>
          Verify
        </button>
      </div>
    </div>
  );
}
