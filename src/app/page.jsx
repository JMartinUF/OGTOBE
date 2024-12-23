// File Location: src/app/page.jsx

import styles from "./page.module.css";
import Header from "../components/header/header";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <Header />

      {/* Navbar Section */}
      <Navbar />

      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.heading}>Welcome to Our Wedding Website</h1>
        <p className={styles.text}>
          Join us as we celebrate our special day! Explore our website to learn
          more about our story, the wedding party, and all the exciting details.
        </p>
        {/* Correct Link for RSVP */}
        <Link href="/rsvp" className={styles.rsvpButton}>
          RSVP Now
        </Link>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
