import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./Graphs.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graphs = ({ timeTaken, costTaken }) => {
  if (!timeTaken.length || !costTaken.length) return null;
  const labels = timeTaken.map((_, i) => `Run ${i + 1}`);
  const timeData = {
    labels,
    datasets: [
      {
        label: "Time Taken (ms)",
        data: timeTaken,
        borderColor: "#6c63ff",
        backgroundColor: "rgba(108,99,255,0.2)",
      },
    ],
  };
  const costData = {
    labels,
    datasets: [
      {
        label: "Cost",
        data: costTaken,
        borderColor: "#ff6384",
        backgroundColor: "rgba(255,99,132,0.2)",
      },
    ],
  };
  return (
    <div className={styles.graphContainer}>
      <div style={{ width: "100%", maxWidth: 600, margin: "20px auto" }}>
        <h3 className={styles.title}>Time Taken per Run</h3>
        <Line data={timeData} />
      </div>
      <div style={{ width: "100%", maxWidth: 600, margin: "20px auto" }}>
        <h3 className={styles.title}>Cost per Run</h3>
        <Line data={costData} />
      </div>
    </div>
  );
};

export default Graphs; 