// File Location: src/app/rsvp/guestView.jsx

import React, { useState } from "react";
import styles from "./guestView.module.css";
import nhost from "../../lib/nhost"; // Ensure Nhost client is correctly imported

export default function GuestView() {
  const [guestName, setGuestName] = useState("");
  const [attending, setAttending] = useState("");
  const [additionalNames, setAdditionalNames] = useState([]);
  const [newName, setNewName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddName = () => {
    if (newName.trim()) {
      setAdditionalNames([...additionalNames, newName.trim()]);
      setNewName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!guestName || !attending) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    try {
      // Add main RSVP entry
      const rsvpMutation = `
        mutation AddRSVP($guest_name: String!, $is_attending: Boolean!) {
          insert_rsvp_one(object: {
            guest_name: $guest_name,
            is_attending: $is_attending
          }) {
            id
          }
        }
      `;

      const variables = {
        guest_name: guestName,
        is_attending: attending === "yes",
      };

      const rsvpResponse = await nhost.graphql.request(rsvpMutation, variables);

      if (rsvpResponse.error) {
        console.error("Error adding RSVP:", rsvpResponse.error);
        setErrorMessage("There was an error submitting your RSVP. Please try again.");
        return;
      }

      const rsvpId = rsvpResponse.data.insert_rsvp_one.id;

      // Add additional names as plus ones
      if (additionalNames.length > 0) {
        const plusOnesMutation = `
          mutation AddPlusOnes($plus_ones: [plus_ones_insert_input!]!) {
            insert_plus_ones(objects: $plus_ones) {
              affected_rows
            }
          }
        `;

        const plusOnesVariables = {
          plus_ones: additionalNames.map((name) => ({
            rsvp_id: rsvpId,
            plus_one_name: name,
          })),
        };

        const plusOnesResponse = await nhost.graphql.request(plusOnesMutation, plusOnesVariables);

        if (plusOnesResponse.error) {
          console.error("Error adding Plus Ones:", plusOnesResponse.error);
          setErrorMessage("There was an error adding additional names. Please try again.");
          return;
        }
      }

      // Reset form and show success message
      alert("RSVP submitted successfully!");
      setGuestName("");
      setAttending("");
      setAdditionalNames([]);
      setErrorMessage("");

    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const handleViewLocation = () => {
    window.open(
      "https://www.google.com/maps/place/Rustic+Rose+Barn/@35.7916603,-97.6239276,15z",
      "_blank"
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>RSVP</h1>
      <p className={styles.text}>
        Please RSVP below to let us know if you can attend our special day.
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
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

        <label className={styles.label}>
          Add an Additional Name:
          <input
            type="text"
            className={styles.input}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter additional name"
          />
          <button
            type="button"
            className={styles.button}
            onClick={handleAddName}
          >
            Add Name
          </button>
        </label>

        {additionalNames.length > 0 && (
          <div className={styles.additionalNames}>
            <h3>Additional Names:</h3>
            <ul>
              {additionalNames.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>

      <button className={styles.button} onClick={handleViewLocation}>
        View Rustic Rose Location
      </button>
    </div>
  );
}
