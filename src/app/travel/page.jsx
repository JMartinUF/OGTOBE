import React from "react";
import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import styles from "./travel.module.css";

export default function travel() {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <Header />

      {/* Navbar Section */}
      <Navbar />

      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.heading}>travel</h1>
        <p className={styles.text}>
          This is the travel page! Add more information here.
        </p>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
