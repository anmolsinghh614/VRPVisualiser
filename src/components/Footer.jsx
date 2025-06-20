import React from "react";
import styles from "./Footer.module.css";

const Footer = () => (
  <footer className={styles.footer}>
    <span>
      &copy; {new Date().getFullYear()} VRP Visualizer &mdash; <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer">GitHub</a>
    </span>
  </footer>
);

export default Footer; 