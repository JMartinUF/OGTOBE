import React from "react";
import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import styles from "./timeline.module.css";

export default function timeline() {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <Header />

      {/* Navbar Section */}
      <Navbar />

      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.heading}>Timeline</h1>
        <p className={styles.text}>
          This is the Timeline page! Add more information here.
        </p>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
