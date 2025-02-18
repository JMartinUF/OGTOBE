// File Location: src/app/rsvp/guestView.jsx

import React, { useState } from "react";
import styles from "./guestView.module.css";
import nhost from "../../lib/nhost"; // Ensure Nhost client is correctly imported
import Modal from "../../components/modal/modal"; // Import the Modal component

export default function GuestView() {
  const [guestName, setGuestName] = useState("");
  const [attending, setAttending] = useState("");
  const [additionalNames, setAdditionalNames] = useState([]);
  const [newName, setNewName] = useState("");
  const [allergies, setAllergies] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [comments, setComments] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [modalMessage, setModalMessage] = useState(""); // State to control the modal message

  const handleAddName = () => {
    if (newName.trim()) {
      setAdditionalNames([...additionalNames, newName.trim()]);
      setNewName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!guestName || !attending || !phoneNumber) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    try {
      // Add main RSVP entry
      const rsvpMutation = `
      mutation AddRSVP($guest_name: String!, $is_attending: Boolean!, $allergies: String, $phone_number: String!, $comments: String) {
        insert_rsvp_one(object: {
          guest_name: $guest_name,
          is_attending: $is_attending,
          allergies: $allergies,
          phone_number: $phone_number,
          comments: $comments
        }) {
          id
        }
      }
    `;

      const variables = {
        guest_name: guestName,
        is_attending: attending === "yes",
        allergies,
        phone_number: phoneNumber,
        comments,
      };

      const rsvpResponse = await nhost.graphql.request(rsvpMutation, variables);

      if (rsvpResponse.error) {
        console.error("Error adding RSVP:", rsvpResponse.error);
        setErrorMessage(
          "There was an error submitting your RSVP. Please try again."
        );
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

        const plusOnesResponse = await nhost.graphql.request(
          plusOnesMutation,
          plusOnesVariables
        );

        if (plusOnesResponse.error) {
          console.error("Error adding Plus Ones:", plusOnesResponse.error);
          setErrorMessage(
            "There was an error adding additional names. Please try again."
          );
          return;
        }
      }

      // Set the modal message based on the RSVP response
      if (attending === "yes") {
        setModalMessage(
          "RSVP Submitted!\nThank you for your response. We look forward to seeing you!"
        );
      } else {
        setModalMessage(
          "RSVP Submitted!\nThank you for letting us know. We’re sorry you can’t make it, but we’ll miss you!"
        );
      }

      // Reset form and show success modal
      setIsModalOpen(true); // Open the modal
      setGuestName("");
      setAttending("");
      setAdditionalNames([]);
      setNewName("");
      setAllergies("");
      setPhoneNumber("");
      setComments("");
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
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label className={styles.label}>
          Best Phone Number to Reach You At:
          <input
            type="tel"
            className={styles.input}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </label>
        <label className={styles.label}>
          Any Food Allergies or Dietary Restrictions?
          <textarea
            className={styles.textarea}
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="Please list any food allergies or restrictions."
          />
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
        <label className={styles.label}>
          Any Comments or Questions for Us?
          <textarea
            className={styles.textarea}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Enter any additional comments or questions."
          />
        </label>
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
      <button className={styles.button} onClick={handleViewLocation}>
        View Rustic Rose Location
      </button>

      {/* Modal for success message */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{modalMessage.split("\n")[0]}</h2>
        <p>{modalMessage.split("\n")[1]}</p>
        <button className={styles.button} onClick={() => setIsModalOpen(false)}>
          Close
        </button>
      </Modal>
    </div>
  );
}
