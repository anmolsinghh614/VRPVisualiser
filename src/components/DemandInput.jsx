import React from "react";
import styles from "./DemandInput.module.css";

const DemandInput = ({ numCities, demandArray, setDemandArray }) => {
  // Ensure demandArray is always numCities length
  React.useEffect(() => {
    const newArray = Array.from({ length: numCities }, (_, i) =>
      demandArray[i] !== undefined ? demandArray[i] : (i === 0 ? 0 : "")
    );
    setDemandArray(newArray);
    // eslint-disable-next-line
  }, [numCities]);

  const handleChange = (i, value) => {
    const newArray = demandArray.map((cell, idx) =>
      idx === i ? Number(value) : cell
    );
    setDemandArray(newArray);
  };

  if (numCities < 2) return null;

  return (
    <div className={styles.demandArrayContainer}>
      <label>Demand Array:</label>
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        {Array.from({ length: numCities }, (_, i) => (
          <input
            key={i}
            type="number"
            value={demandArray[i] !== undefined ? demandArray[i] : (i === 0 ? 0 : "")}
            onChange={e => handleChange(i, e.target.value)}
            disabled={i === 0}
            className={styles.demandArrayInputStyle}
          />
        ))}
      </div>
    </div>
  );
};

export default DemandInput; 