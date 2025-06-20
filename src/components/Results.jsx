import React from "react";
import styles from "./Results.module.css";

const Results = ({ result }) => {
  if (!result) return null;
  return (
    <div className={styles.resultsContainer}>
      <h2>Results</h2>
      <div><strong>Total Cost:</strong> {result.cost}</div>
      <div>
        <strong>Routes:</strong>
        <ul>
          {result.routes && result.routes.length > 0 ? (
            result.routes.map((route, idx) => (
              <li key={idx}>{route.join(" - ")}</li>
            ))
          ) : (
            <li>No routes found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Results; 