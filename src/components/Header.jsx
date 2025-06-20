import React from "react";
import styles from "./Header.module.css";

const Header = () => (
  <header>
    <div className={styles.heading}>
      <h1>Vehicle Routing Problem Visualizer</h1>
    </div>
  </header>
);

export default Header; 