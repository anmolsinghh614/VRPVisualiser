import React from "react";
import styles from "./MatrixInput.module.css";

const MatrixInput = ({ numCities, costMatrix, setCostMatrix }) => {
  // Ensure costMatrix is always numCities x numCities
  React.useEffect(() => {
    const newMatrix = Array.from({ length: numCities }, (_, i) =>
      Array.from({ length: numCities }, (_, j) =>
        costMatrix[i] && costMatrix[i][j] !== undefined ? costMatrix[i][j] : (i === j ? 0 : "")
      )
    );
    setCostMatrix(newMatrix);
    // eslint-disable-next-line
  }, [numCities]);

  const handleChange = (i, j, value) => {
    const newMatrix = costMatrix.map((row, rowIdx) =>
      row.map((cell, colIdx) =>
        rowIdx === i && colIdx === j ? Number(value) : cell
      )
    );
    setCostMatrix(newMatrix);
  };

  if (numCities < 2) return null;

  return (
    <div className={styles.matrixContainer}>
      <table>
        <tbody>
          {Array.from({ length: numCities }, (_, i) => (
            <tr key={i}>
              {Array.from({ length: numCities }, (_, j) => (
                <td key={j}>
                  <input
                    type="number"
                    value={costMatrix[i] && costMatrix[i][j] !== undefined ? costMatrix[i][j] : (i === j ? 0 : "")}
                    onChange={e => handleChange(i, j, e.target.value)}
                    disabled={i === j}
                    className={styles.matrixInputStyle}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatrixInput; 