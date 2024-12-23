// File Location: src/app/rsvp/page.jsx

"use client";

import React, { useState } from "react";
import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import Modal from "../../components/modal/modal";
import nhost from "../../lib/nhost"; // Import Nhost client
import styles from "./rsvp.module.css";

export default function RSVPPage() {
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [attending, setAttending] = useState("");
  const [plusOne, setPlusOne] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mutation = `
      mutation AddRSVP($guest_name: String!, $email: String!, $is_attending: Boolean!, $plus_one_name: String) {
        insert_rsvp_one(object: {
          guest_name: $guest_name,
          email: $email,
          is_attending: $is_attending,
          plus_one_name: $plus_one_name
        }) {
          id
        }
      }
    `;

    const variables = {
      guest_name: guestName,
      email: email,
      is_attending: attending === "yes",
      plus_one_name: plusOne || null,
    };

    try {
      const { error } = await nhost.graphql.request(mutation, variables);

      if (error) {
        console.error("Error adding RSVP:", error);
        alert("There was an error submitting your RSVP. Please try again.");
      } else {
        setIsModalOpen(true); // Show modal on successful submission
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <Header />

      {/* Navbar Section */}
      <Navbar />

      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.heading}>RSVP</h1>
        <p className={styles.text}>
          Please RSVP below to let us know if you can attend our special day.
        </p>

        {/* RSVP Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Name:
            <input
              type="text"
              className={styles.input}
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
            />
          </label>
          <label className={styles.label}>
            Email:
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className={styles.label}>
            Will you be attending?
            <select
              className={styles.select}
              value={attending}
              onChange={(e) => setAttending(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          {attending === "yes" && (
            <label className={styles.label}>
              Plus One Name (Optional):
              <input
                type="text"
                className={styles.input}
                value={plusOne}
                onChange={(e) => setPlusOne(e.target.value)}
              />
            </label>
          )}
          <button type="submit" className={styles.button}>
            Submit
          </button>
        </form>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <h2>Thank You!</h2>
          <p>
            Thank you for RSVPing! We're excited to celebrate this special day
            with you.
          </p>
        </Modal>

        {/* Google Map Section */}
        <div className={styles.mapContainer}>
          <h2 className={styles.subheading}>Wedding Venue</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3244.449709771364!2d-97.6239276!3d35.7916603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87b1fb3978e54445%3A0x404e71d4357ddbe!2sRustic%20Rose%20Barn!5e0!3m2!1sen!2sus!4v1699388107046!5m2!1sen!2sus"
            width="100%"
            height="400"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={styles.map}
          ></iframe>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
