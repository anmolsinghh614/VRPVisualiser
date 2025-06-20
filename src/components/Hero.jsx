import React from "react";
import styles from "./Hero.module.css";

const Hero = ({ onScrollToForm }) => (
  <section className={styles.hero}>
    <div className={styles.heroContent}>
      <h1>Vehicle Routing Problem Visualizer</h1>
      <p>
        Experiment with multiple VRP algorithms, visualize solutions, and compare results—all in one interactive tool.
      </p>
      <button className={styles.ctaButton} onClick={onScrollToForm}>
        Get Started
      </button>
    </div>
  </section>
);

export default Hero; 