// File Location: src/app/rsvp/page.jsx

"use client";

import React, { useState } from "react";
import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import PasswordModal from "../../components/passwordModal/passwordModal";
import AdminView from "./adminView";
import GuestView from "./guestView";
import styles from "./rsvp.module.css";

export default function RSVPPage() {
  const [role, setRole] = useState(""); // Role: 'admin' or 'guest'
  const [accessGranted, setAccessGranted] = useState(false);

  if (!accessGranted) {
    return (
      <PasswordModal
        isOpen={!accessGranted}
        onVerify={(verifiedRole) => {
          setRole(verifiedRole);
          setAccessGranted(true);
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <Navbar />
      <main className={styles.main}>
        {role === "admin" ? <AdminView /> : <GuestView />}
      </main>
      <Footer />
    </div>
  );
}