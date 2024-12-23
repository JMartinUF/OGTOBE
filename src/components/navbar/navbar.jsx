import React from "react";
import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
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
      </ul>
    </nav>
  );
}
