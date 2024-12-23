import React from "react";
import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import styles from "./qanda.module.css";

export default function qanda() {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <Header />

      {/* Navbar Section */}
      <Navbar />

      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.heading}>qanda</h1>
        <p className={styles.text}>
          Welcome to the qanda page! Ask any questions here.
        </p>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
