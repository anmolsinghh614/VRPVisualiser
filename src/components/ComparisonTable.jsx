import React, { useState } from "react";

const ComparisonTable = ({ numCities, numVehicles, vehicleCapacity, costMatrix, demandArray, algorithms, algorithmLabels }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    setResults([]);
    // Run all algorithms sequentially (could be parallel if all are async)
    const res = [];
    for (const key of Object.keys(algorithms)) {
      const label = algorithmLabels[key] || key;
      const start = performance.now();
      let solution = { cost: "-", routes: [] };
      try {
        solution = algorithms[key](numCities, numVehicles, vehicleCapacity, costMatrix, demandArray);
      } catch (e) {
        solution = { cost: "Error", routes: [] };
      }
      const end = performance.now();
      res.push({
        algorithm: label,
        cost: solution.cost,
        time: (end - start).toFixed(2),
        routes: solution.routes,
      });
    }
    setResults(res);
    setLoading(false);
  };

  return (
    <div style={{ margin: "40px auto", width: "100%", maxWidth: 900 }}>
      <button
        onClick={handleCompare}
        style={{
          padding: "12px 28px",
          fontSize: "1rem",
          background: "#6c63ff",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
          marginBottom: 18,
        }}
        disabled={loading}
      >
        {loading ? "Comparing..." : "Compare All Algorithms"}
      </button>
      {loading && (
        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <span style={{ fontSize: 22, color: "#6c63ff" }}>⏳</span>
        </div>
      )}
      {results.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
            <thead>
              <tr style={{ background: "#f4f4f4" }}>
                <th style={{ padding: 12, borderBottom: "2px solid #eee", textAlign: "left" }}>Algorithm</th>
                <th style={{ padding: 12, borderBottom: "2px solid #eee" }}>Cost</th>
                <th style={{ padding: 12, borderBottom: "2px solid #eee" }}>Time (ms)</th>
                <th style={{ padding: 12, borderBottom: "2px solid #eee" }}>Routes</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 10, fontWeight: 500 }}>{row.algorithm}</td>
                  <td style={{ padding: 10 }}>{row.cost}</td>
                  <td style={{ padding: 10 }}>{row.time}</td>
                  <td style={{ padding: 10, fontFamily: "monospace", fontSize: 13 }}>
                    {row.routes && row.routes.length > 0
                      ? row.routes.map((r, i) => <div key={i}>{r.join(" → ")}</div>)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComparisonTable; 