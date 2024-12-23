import React from "react";
import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import styles from "./ourstory.module.css";

export default function OurStory() {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <Header />
      
      {/* Navbar Section */}
      <Navbar />
      
      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.heading}>Our Story</h1>
        <p className={styles.text}>
          This is where we share our beautiful journey together!
        </p>
      </main>
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
}
