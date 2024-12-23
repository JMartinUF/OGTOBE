// File Location: src/components/navbar/navbar.jsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./navbar.module.css";
import MenuButton from "../../../public/MenuButton.svg"; // Adjust the path if necessary

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle window resize to toggle between mobile and desktop views
  useEffect(() => {
    const handleResize = () => {
      // Check if the screen width is mobile size
      if (window.innerWidth <= 768) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
        setIsMenuOpen(false); // Close the menu when switching to desktop view
      }
    };

    // Initial check and event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      {/* Menu Button for Mobile View */}
      {isMobileView && (
        <button className={styles.menuButton} onClick={toggleMenu}>
          <img src={MenuButton.src} alt="Menu" />
        </button>
      )}

      {/* Full Navbar */}
      <ul
        className={`${styles.navList} ${
          isMobileView
            ? isMenuOpen
              ? styles.navListOpen
              : styles.navListClosed
            : styles.navListDesktop
        }`}
      >
        <li className={styles.navItem}>
          <Link href="/">Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/ourstory">Our Story</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/photos">Photos</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/weddingparty">Wedding Party</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/qanda">Q + A</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/travel">Travel</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/thingstodo">Things to Do</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/registry">Registry</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/rsvp">RSVP</Link>
        </li>
      </ul>
    </nav>
  );
}
