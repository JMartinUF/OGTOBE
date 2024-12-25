// File Location: src/app/rsvp/adminView.jsx

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Table from "../../components/table/table";
import nhost from "../../lib/nhost";
import styles from "./adminView.module.css";

export default function AdminView() {
  const [rsvpData, setRsvpData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const totalInvited = 150; // Replace this with your total invited count
  const COLORS = ["#00C49F", "#FF69B4", "#D3D3D3"]; // Green, Pink, Light Grey

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        query GetRSVPDetails {
          rsvp {
            guest_name
            is_attending
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

  const calculateChartData = (rsvpData) => {
    const attendingCount = rsvpData.filter((r) => r.is_attending).length;
    const notAttendingCount = rsvpData.filter((r) => !r.is_attending).length;
    const remainingCount = totalInvited - (attendingCount + notAttendingCount);

    setChartData([
      { name: "Attending", value: attendingCount, color: COLORS[0] },
      { name: "Not Attending", value: notAttendingCount, color: COLORS[1] },
      { name: "Remaining", value: remainingCount, color: COLORS[2] },
    ]);
  };

  const columns = ["Name", "Attending", "Plus Ones"];
  const rows = rsvpData.map((item) => [
    item.guest_name,
    item.is_attending ? "Yes" : "No",
    item.plus_ones.map((p) => p.plus_one_name).join(", "),
  ]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Admin RSVP Overview</h2>
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
                <span>{entry.name}: {entry.value}</span>
              </div>
            ))}
            <div className={styles.legendItem}>
              <span className={styles.totalInvited}>Total Invited: {totalInvited}</span>
            </div>
          </div>
        </div>

        <div className={styles.tableSection}>
          <Table columns={columns} rows={rows} />
        </div>
      </div>
    </div>
  );
}
