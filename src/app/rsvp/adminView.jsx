// File Location: src/app/rsvp/adminView.jsx

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Table from "../../components/table/table";
import Pagination from "../../components/Pagination/Pagination";
import nhost from "../../lib/nhost";
import styles from "./adminView.module.css";

export default function AdminView() {
  const [rsvpData, setRsvpData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const totalInvited = 150; // Replace this with your total invited count
  const COLORS = ["#1e783c", "#FF69B4", "#D3D3D3"]; // Green, Pink, Light Grey

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        query GetRSVPDetails {
          rsvp {
            id
            guest_name
            is_attending
            phone_number
            allergies
            comments
            plus_ones {
              plus_one_name
            }
          }
        }
      `;
      const { data, error } = await nhost.graphql.request(query);
      if (error) {
        console.error("Error fetching RSVP details:", error);
      } else {
        setRsvpData(data.rsvp);
        calculateChartData(data.rsvp);
      }
    };

    fetchData();
  }, []);

  const calculateChartData = (data) => {
    let attendingCount = 0;
    let notAttendingCount = 0;

    data.forEach((rsvp) => {
      if (rsvp.is_attending) {
        // Count the RSVP guest and their plus ones
        attendingCount += 1 + (rsvp.plus_ones?.length || 0);
      } else {
        // Only count the RSVP guest (plus ones are irrelevant if not attending)
        notAttendingCount += 1;
      }
    });

    const remainingCount = totalInvited - (attendingCount + notAttendingCount);

    setChartData([
      { name: "Attending", value: attendingCount, color: COLORS[0] },
      { name: "Not Attending", value: notAttendingCount, color: COLORS[1] },
      { name: "Remaining", value: remainingCount, color: COLORS[2] },
    ]);
  };

  const handleDelete = async (id) => {
    const mutation = `
      mutation DeleteRSVP($id: Int!) {
        delete_rsvp_by_pk(id: $id) {
          id
        }
      }
    `;
    const variables = { id };

    try {
      const { data, error } = await nhost.graphql.request(mutation, variables);
      if (error) {
        console.error("Error deleting RSVP:", error);
        return;
      }
      // Remove the RSVP from the local state and recalculate chart data
      const updatedData = rsvpData.filter((rsvp) => rsvp.id !== id);
      setRsvpData(updatedData);
      calculateChartData(updatedData);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rsvpData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const columns = [
    "Actions",
    "Attending",
    "Guest",
    "Phone Number",
    "Other Attendees",
    "Allergies",
    "Comments",
  ];

  const rows = currentRows.map((item) => [
    <img
      key={`delete-${item.id}`}
      src="/DeleteButton.svg"
      alt="Delete"
      className={styles.deleteButton}
      onClick={() => handleDelete(item.id)}
    />,
    item.is_attending ? "Yes" : "No",
    item.guest_name,
    item.phone_number || "N/A",
    item.plus_ones.length > 0
      ? `${item.plus_ones.length} (${item.plus_ones
          .map((p) => p.plus_one_name)
          .join(", ")})`
      : "None",
    item.allergies || "None",
    item.comments || "None",
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Admin RSVP Overview</div>

      <div className={styles.flexContainer}>
        <div className={styles.chartSection}>
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.legend}>
            {chartData.map((entry, index) => (
              <div key={index} className={styles.legendItem}>
                <span
                  className={styles.legendColor}
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span>
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
            <div className={styles.legendItem}>
              <span className={styles.totalInvited}>
                Total Invited: {totalInvited}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.tableSection}>
          {rsvpData.length > 0 && ( // Only show Pagination if there is data
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(rsvpData.length / rowsPerPage)}
              onPageChange={handlePageChange}
            />
          )}
          <Table columns={columns} rows={rows} />
        </div>
      </div>
    </div>
  );
}
