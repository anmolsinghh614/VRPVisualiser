import React, { useMemo } from "react";
import styles from "./InputForm.module.css";

const InputForm = ({
  numCities,
  setNumCities,
  numVehicles,
  setNumVehicles,
  vehicleCapacity,
  setVehicleCapacity,
  setInputValid,
  setInputErrors,
}) => {
  const errors = useMemo(() => {
    const errs = [];
    if (numCities < 2) errs.push("Number of cities must be at least 2.");
    if (numVehicles < 1) errs.push("Number of vehicles must be at least 1.");
    if (vehicleCapacity < 1) errs.push("Vehicle capacity must be at least 1.");
    return errs;
  }, [numCities, numVehicles, vehicleCapacity]);

  React.useEffect(() => {
    setInputValid(errors.length === 0);
    setInputErrors(errors);
    // eslint-disable-next-line
  }, [errors]);

  return (
    <>
      <div className={styles.inputData}>
        <div>
          <label>Number of cities:</label>
          <input
            type="number"
            value={numCities}
            onChange={(e) => setNumCities(Number(e.target.value))}
            min={2}
          />
        </div>
        <div>
          <label>Number of vehicles:</label>
          <input
            type="number"
            value={numVehicles}
            onChange={(e) => setNumVehicles(Number(e.target.value))}
            min={1}
          />
        </div>
        <div>
          <label>Vehicle capacity:</label>
          <input
            type="number"
            value={vehicleCapacity}
            onChange={(e) => setVehicleCapacity(Number(e.target.value))}
            min={1}
          />
        </div>
      </div>
      {errors.length > 0 && (
        <div style={{ color: "#ff3b3b", marginTop: 8, fontWeight: 500, textAlign: "center" }}>
          {errors.map((err, idx) => (
            <div key={idx}>{err}</div>
          ))}
        </div>
      )}
    </>
  );
};

export default InputForm; 