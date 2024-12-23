// File Locaiton: src/app/photos/page.jsx

import React from "react";
import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import styles from "./photos.module.css";

export default function PhotosPage() {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <Header />

      {/* Navbar Section */}
      <Navbar />

      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.heading}>Photos</h1>
        <p className={styles.text}>
          Welcome to the Photos page! Add beautiful pictures here.
        </p>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
