// File Location: src/app/registry/page.jsx

"use client";

import React from "react";
import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import styles from "./registry.module.css";

export default function Registry() {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <Header />

      {/* Navbar Section */}
      <Navbar />

      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.heading}>Our Registry</h1>
        <p className={styles.text}>
          Visit our wedding registry to browse items we’ve selected:
        </p>
        <a
          href="https://www.blueprintregistry.com/registry/joshua-golob-wedding-registry-3-13-2026"
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Our Registry
        </a>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
