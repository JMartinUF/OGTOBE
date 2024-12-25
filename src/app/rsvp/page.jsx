// File Location: src/app/rsvp/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import Modal from "../../components/modal/modal";
import nhost from "../../lib/nhost"; // Import Nhost client
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styles from "./rsvp.module.css";

export default function RSVPPage() {
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [attending, setAttending] = useState("");
  const [plusOneNames, setPlusOneNames] = useState([]);
  const [newPlusOne, setNewPlusOne] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rsvpData, setRsvpData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalInvited] = useState(10); // Static total number of invited guests

  const COLORS = ["#D3D3D3", "#00C49F", "#FF69B4"]; // Light Grey, Green, Pink

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        query GetRSVPs {
          rsvp {
            is_attending
            plus_ones {
              id
            }
          }
        }
      `;
      const { data, error } = await nhost.graphql.request(query);
      if (error) {
        console.error("Error fetching RSVP data:", error);
      } else {
        setRsvpData(data.rsvp);
        calculateChartData(data.rsvp);
      }
    };

    fetchData();
  }, []);

  const calculateChartData = (rsvpData) => {
    const attendingCount = rsvpData
      .filter((r) => r.is_attending)
      .reduce((total, rsvp) => total + 1 + rsvp.plus_ones.length, 0);

    const notAttendingCount = rsvpData.filter((r) => !r.is_attending).length;

    const chartData = [
      { name: "Invited", value: totalInvited },
      { name: "Attending", value: attendingCount },
      { name: "Not Attending", value: notAttendingCount },
    ];

    setChartData(chartData);
  };

  const handleAddPlusOne = () => {
    if (newPlusOne.trim()) {
      setPlusOneNames([...plusOneNames, newPlusOne.trim()]);
      setNewPlusOne("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Insert RSVP first
      const rsvpMutation = `
        mutation AddRSVP($guest_name: String!, $email: String!, $is_attending: Boolean!) {
          insert_rsvp_one(object: {
            guest_name: $guest_name,
            email: $email,
            is_attending: $is_attending
          }) {
            id
          }
        }
      `;

      const rsvpVariables = {
        guest_name: guestName,
        email: email,
        is_attending: attending === "yes",
      };

      const rsvpResponse = await nhost.graphql.request(rsvpMutation, rsvpVariables);

      if (rsvpResponse.error) {
        console.error("Error adding RSVP:", rsvpResponse.error);
        alert("There was an error submitting your RSVP. Please try again.");
        return;
      }

      const rsvpId = rsvpResponse.data.insert_rsvp_one.id;

      // Insert Plus Ones (if any)
      if (plusOneNames.length > 0) {
        const plusOnesMutation = `
          mutation AddPlusOnes($plus_ones: [plus_ones_insert_input!]!) {
            insert_plus_ones(objects: $plus_ones) {
              affected_rows
            }
          }
        `;

        const plusOnesVariables = {
          plus_ones: plusOneNames.map((name) => ({
            rsvp_id: rsvpId,
            plus_one_name: name,
          })),
        };

        const plusOnesResponse = await nhost.graphql.request(plusOnesMutation, plusOnesVariables);

        if (plusOnesResponse.error) {
          console.error("Error adding Plus Ones:", plusOnesResponse.error);
          alert("There was an error submitting your Plus One. Please try again.");
          return;
        }
      }

      // Show success modal and reset form
      setIsModalOpen(true);
      setGuestName("");
      setEmail("");
      setAttending("");
      setPlusOneNames([]);
      const updatedData = [...rsvpData, { is_attending: attending === "yes", plus_ones: plusOneNames }];
      setRsvpData(updatedData);
      calculateChartData(updatedData);
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
        <div className={styles.topSection}>
          {/* RSVP Form */}
          <div className={styles.formContainer}>
            <h1 className={styles.heading}>RSVP</h1>
            <p className={styles.text}>
              Please RSVP below to let us know if you can attend our special day.
            </p>
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

              <label className={styles.label}>
                Add a Plus One?
                <input
                  type="text"
                  className={styles.input}
                  value={newPlusOne}
                  onChange={(e) => setNewPlusOne(e.target.value)}
                  placeholder="Enter Plus One Name"
                />
                <button
                  type="button"
                  className={styles.button}
                  onClick={handleAddPlusOne}
                >
                  Add Plus One
                </button>
              </label>

              {plusOneNames.length > 0 && (
                <div className={styles.plusOneList}>
                  <h3>Plus Ones:</h3>
                  <ul>
                    {plusOneNames.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button type="submit" className={styles.button}>
                Submit
              </button>
            </form>
          </div>

          {/* RSVP Chart */}
          <div className={styles.chartContainer}>
            <h2 className={styles.subheading}>RSVP Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: COLORS[0] }}></span>
                <span>Invited: {chartData[0]?.value}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: COLORS[1] }}></span>
                <span>Attending: {chartData[1]?.value}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: COLORS[2] }}></span>
                <span>Not Attending: {chartData[2]?.value}</span>
              </div>
            </div>
          </div>
        </div>

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
