"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
  const [daysToGo, setDaysToGo] = useState(0);

  useEffect(() => {
    const targetDate = new Date("March 13, 2026");
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysToGo(diffDays);
  }, []);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.headerLink}>
        <h1>OLIVIA & JOSHUA</h1>
        <p>MARCH 13, 2026 • GUTHRIE, OK</p>
        <p>{daysToGo} DAYS TO GO!</p>
      </Link>
    </header>
  );
}
