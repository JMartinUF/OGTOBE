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
  const [plusOne, setPlusOne] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rsvpData, setRsvpData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const COLORS = ["#D3D3D3", "#00C49F", "#FF69B4"]; // Light Grey, Green, Pink

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        query GetRSVPs {
          rsvp {
            is_attending
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
    const totalInvited = 10; // Replace this with your total invited number
    const attendingCount = rsvpData.filter((r) => r.is_attending === true).length;
    const notAttendingCount = rsvpData.filter((r) => r.is_attending === false).length;

    const chartData = [
      { name: "Invited", value: totalInvited - attendingCount - notAttendingCount },
      { name: "Attending", value: attendingCount },
      { name: "Not Attending", value: notAttendingCount },
    ];
    setChartData(chartData);
  };

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
                <span>Invited</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: COLORS[1] }}></span>
                <span>Attending</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: COLORS[2] }}></span>
                <span>Not Attending</span>
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









// "use client";

// import React, { useState } from "react";
// import Header from "../../components/header/header";
// import Navbar from "../../components/navbar/navbar";
// import Footer from "../../components/footer/footer";
// import Modal from "../../components/modal/modal";
// import nhost from "../../lib/nhost"; // Import Nhost client
// import styles from "./rsvp.module.css";

// export default function RSVPPage() {
//   const [guestName, setGuestName] = useState("");
//   const [email, setEmail] = useState("");
//   const [attending, setAttending] = useState("");
//   const [plusOne, setPlusOne] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const mutation = `
//       mutation AddRSVP($guest_name: String!, $email: String!, $is_attending: Boolean!, $plus_one_name: String) {
//         insert_rsvp_one(object: {
//           guest_name: $guest_name,
//           email: $email,
//           is_attending: $is_attending,
//           plus_one_name: $plus_one_name
//         }) {
//           id
//         }
//       }
//     `;

//     const variables = {
//       guest_name: guestName,
//       email: email,
//       is_attending: attending === "yes",
//       plus_one_name: plusOne || null,
//     };

//     try {
//       const { error } = await nhost.graphql.request(mutation, variables);

//       if (error) {
//         console.error("Error adding RSVP:", error);
//         alert("There was an error submitting your RSVP. Please try again.");
//       } else {
//         setIsModalOpen(true); // Show modal on successful submission
//       }
//     } catch (err) {
//       console.error("Unexpected error:", err);
//       alert("An unexpected error occurred. Please try again.");
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className={styles.container}>
//       {/* Header Section */}
//       <Header />

//       {/* Navbar Section */}
//       <Navbar />

//       {/* Main Content */}
//       <main className={styles.main}>
//         <h1 className={styles.heading}>RSVP</h1>
//         <p className={styles.text}>
//           Please RSVP below to let us know if you can attend our special day.
//         </p>

//         {/* RSVP Form */}
//         <form className={styles.form} onSubmit={handleSubmit}>
//           <label className={styles.label}>
//             Name:
//             <input
//               type="text"
//               className={styles.input}
//               value={guestName}
//               onChange={(e) => setGuestName(e.target.value)}
//               required
//             />
//           </label>
//           <label className={styles.label}>
//             Email:
//             <input
//               type="email"
//               className={styles.input}
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </label>
//           <label className={styles.label}>
//             Will you be attending?
//             <select
//               className={styles.select}
//               value={attending}
//               onChange={(e) => setAttending(e.target.value)}
//               required
//             >
//               <option value="">-- Select --</option>
//               <option value="yes">Yes</option>
//               <option value="no">No</option>
//             </select>
//           </label>
//           {attending === "yes" && (
//             <label className={styles.label}>
//               Plus One Name (Optional):
//               <input
//                 type="text"
//                 className={styles.input}
//                 value={plusOne}
//                 onChange={(e) => setPlusOne(e.target.value)}
//               />
//             </label>
//           )}
//           <button type="submit" className={styles.button}>
//             Submit
//           </button>
//         </form>

//         {/* Modal */}
//         <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
//           <h2>Thank You!</h2>
//           <p>
//             Thank you for RSVPing! We're excited to celebrate this special day
//             with you.
//           </p>
//         </Modal>

//         {/* Google Map Section */}
//         <div className={styles.mapContainer}>
//           <h2 className={styles.subheading}>Wedding Venue</h2>
//           <iframe
//             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3244.449709771364!2d-97.6239276!3d35.7916603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87b1fb3978e54445%3A0x404e71d4357ddbe!2sRustic%20Rose%20Barn!5e0!3m2!1sen!2sus!4v1699388107046!5m2!1sen!2sus"
//             width="100%"
//             height="400"
//             allowFullScreen=""
//             loading="lazy"
//             referrerPolicy="no-referrer-when-downgrade"
//             className={styles.map}
//           ></iframe>
//         </div>
//       </main>

//       {/* Footer Section */}
//       <Footer />
//     </div>
//   );
// }
