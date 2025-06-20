import React, { useRef, useEffect, useState } from "react";
import styles from "./Animation.module.css";

// Helper to generate deterministic random coordinates for cities
function getCityCoords(numCities, width, height, margin = 40) {
  // Use a fixed seed for repeatability
  const coords = [];
  let seed = numCities * 12345;
  function rand() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }
  for (let i = 0; i < numCities; i++) {
    const angle = (2 * Math.PI * i) / numCities;
    // Place depot in center, others in a circle
    if (i === 0) {
      coords.push({ x: width / 2, y: height / 2 });
    } else {
      const r = Math.min(width, height) / 2 - margin;
      coords.push({
        x: width / 2 + r * Math.cos(angle),
        y: height / 2 + r * Math.sin(angle),
      });
    }
  }
  return coords;
}

const COLORS = [
  "#6c63ff", "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40"
];

const VEHICLE_RADIUS = 7;
const CITY_RADIUS = 12;
const DEPOT_RADIUS = 16;
const ANIMATION_SPEED = 0.012; // Lower is slower

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function interpolatePoints(p1, p2, t) {
  return {
    x: lerp(p1.x, p2.x, t),
    y: lerp(p1.y, p2.y, t),
  };
}

const Animation = ({ result }) => {
  const width = 520;
  const height = 400;
  const [progress, setProgress] = useState([]); // progress per route
  const requestRef = useRef();

  // Setup city coordinates
  const numCities = result && result.routes && result.routes[0] ? Math.max(...result.routes.flat()) + 1 : 0;
  const coords = numCities > 0 ? getCityCoords(numCities, width, height) : [];

  // Animation loop
  useEffect(() => {
    if (!result || !result.routes || result.routes.length === 0) return;
    setProgress(Array(result.routes.length).fill(0));
    let running = true;
    function animate() {
      setProgress(prev =>
        prev.map((p, i) => {
          if (!result.routes[i] || result.routes[i].length < 2) return 1;
          const next = p + ANIMATION_SPEED;
          return next > result.routes[i].length - 1 ? 0 : next;
        })
      );
      if (running) requestRef.current = requestAnimationFrame(animate);
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line
  }, [result]);

  if (!result || !result.routes || result.routes.length === 0 || coords.length === 0) {
    return (
      <div className={styles.animationContainer}>
        <div style={{ padding: 40, textAlign: "center", color: "#555" }}>
          No routes to animate.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.animationContainer}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: width, maxHeight: height }}>
        {/* Draw all routes */}
        {result.routes.map((route, idx) => (
          <polyline
            key={idx}
            fill="none"
            stroke={COLORS[idx % COLORS.length]}
            strokeWidth={4}
            points={route.map(cityIdx => `${coords[cityIdx].x},${coords[cityIdx].y}`).join(" ")}
            opacity={0.7}
          />
        ))}
        {/* Draw cities */}
        {coords.map((pt, i) => (
          <g key={i}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={i === 0 ? DEPOT_RADIUS : CITY_RADIUS}
              fill={i === 0 ? "#6c63ff" : "#fff"}
              stroke="#333"
              strokeWidth={i === 0 ? 4 : 2}
            />
            <text
              x={pt.x}
              y={pt.y + 5}
              textAnchor="middle"
              fontSize={i === 0 ? 18 : 15}
              fontWeight={i === 0 ? 700 : 500}
              fill={i === 0 ? "#fff" : "#333"}
            >
              {i}
            </text>
          </g>
        ))}
        {/* Animate vehicles */}
        {result.routes.map((route, idx) => {
          if (!route || route.length < 2) return null;
          // Find which segment the vehicle is on
          const prog = progress[idx] || 0;
          const seg = Math.floor(prog);
          const t = prog - seg;
          if (seg >= route.length - 1) return null;
          const from = coords[route[seg]];
          const to = coords[route[seg + 1]];
          const pos = interpolatePoints(from, to, t);
          return (
            <circle
              key={"vehicle-" + idx}
              cx={pos.x}
              cy={pos.y}
              r={VEHICLE_RADIUS}
              fill={COLORS[idx % COLORS.length]}
              stroke="#222"
              strokeWidth={2}
              opacity={0.95}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Animation; 