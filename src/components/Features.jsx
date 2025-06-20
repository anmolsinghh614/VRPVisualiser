import React from "react";
import styles from "./Features.module.css";
import { FaProjectDiagram, FaChartLine, FaMagic } from "react-icons/fa";

const features = [
  {
    icon: <FaProjectDiagram size={32} color="#6c63ff" />,
    title: "Multiple Algorithms",
    desc: "Try exact, heuristic, and metaheuristic VRP solvers.",
  },
  {
    icon: <FaMagic size={32} color="#36a2eb" />,
    title: "Animated Visualization",
    desc: "See routes and vehicles move in real time.",
  },
  {
    icon: <FaChartLine size={32} color="#ff6384" />,
    title: "Comparison Table",
    desc: "Compare cost and time for all algorithms at a glance.",
  },
];

const Features = () => (
  <section className={styles.features}>
    {features.map((f, i) => (
      <div className={styles.featureCard} key={i}>
        <div>{f.icon}</div>
        <h3>{f.title}</h3>
        <p>{f.desc}</p>
      </div>
    ))}
  </section>
);

export default Features; 