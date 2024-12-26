// File Location: src/app/rsvp/page.jsx

"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    // Check local storage for persisted role
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
      setAccessGranted(true);
    }
  }, []);

  const handleVerify = (verifiedRole) => {
    setRole(verifiedRole);
    setAccessGranted(true);
    localStorage.setItem("role", verifiedRole); // Persist role in local storage
  };

  const handleLogout = () => {
    setRole("");
    setAccessGranted(false);
    localStorage.removeItem("role"); // Clear the persisted role
  };

  const handleSwitchRole = () => {
    setRole(role === "admin" ? "guest" : "admin"); // Toggle between roles
    localStorage.setItem("role", role === "admin" ? "guest" : "admin");
  };

  if (!accessGranted) {
    return <PasswordModal isOpen={!accessGranted} onVerify={handleVerify} />;
  }

  return (
    <div className={styles.container}>
      <Header />
      <Navbar />
      <main className={styles.main}>
        <div className={styles.switchRoleContainer}>
          <button
            className={styles.switchRoleButton}
            onClick={handleSwitchRole}
          >
            Switch to {role === "admin" ? "Guest" : "Admin"} View
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
        {role === "admin" ? <AdminView /> : <GuestView />}
      </main>
      <Footer />
    </div>
  );
}
