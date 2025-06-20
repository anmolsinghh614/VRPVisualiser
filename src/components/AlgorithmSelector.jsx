import React, { useState } from "react";
import styles from "./AlgorithmSelector.module.css";

const algorithms = [
  { value: "branchAndBound", label: "Branch and Bound" },
  { value: "simulatedAnnealing", label: "Simulated Annealing" },
  { value: "clarkeAndWright", label: "Clarke and Wright" },
  { value: "sweepMethod", label: "Sweep Method" },
  { value: "tabuSearch", label: "Tabu Search" },
  { value: "dynamicProgramming", label: "Dynamic Programming" },
  { value: "antColonyOptimization", label: "Ant Colony Optimization" },
  { value: "neuralNetwork", label: "Neural Network" },
  { value: "geneticAlgorithm", label: "Genetic Algorithm" },
  { value: "adaptiveMemorySearch", label: "Adaptive Memory Search" },
];

const algorithmDescriptions = {
  branchAndBound: "Exact method. Explores all possible routes using a tree structure to find the optimal solution. Best for small instances.",
  simulatedAnnealing: "Metaheuristic. Uses randomization and gradual cooling to escape local minima and find good solutions.",
  clarkeAndWright: "Heuristic. Merges routes based on savings to quickly build efficient solutions.",
  sweepMethod: "Heuristic. Sorts cities by angle and groups them into routes based on capacity.",
  tabuSearch: "Metaheuristic. Uses memory structures to avoid cycling and escape local minima.",
  dynamicProgramming: "Exact method. Solves subproblems recursively. Only practical for very small instances.",
  antColonyOptimization: "Metaheuristic. Simulates ant behavior to find good routes via pheromone trails.",
  neuralNetwork: "Metaheuristic. Uses neural networks to approximate good solutions (experimental).",
  geneticAlgorithm: "Metaheuristic. Evolves a population of solutions using crossover and mutation.",
  adaptiveMemorySearch: "Metaheuristic. Uses adaptive memory to guide the search for better solutions.",
};

const AlgorithmSelector = ({ algorithm, setAlgorithm, onSolve, inputValid, inputErrors }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const description = algorithmDescriptions[algorithm] || "Select an algorithm to see its description.";

  return (
    <div className={styles.algorithmSelector} style={{ position: "relative" }}>
      <select
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        aria-label="Select algorithm"
      >
        <option value="">Select Algorithm</option>
        {algorithms.map((alg) => (
          <option key={alg.value} value={alg.value}>
            {alg.label}
          </option>
        ))}
      </select>
      <span
        tabIndex={0}
        style={{ marginLeft: 8, cursor: "pointer", fontSize: 18, color: "#6c63ff" }}
        aria-label="Algorithm info"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        ℹ️
        {showTooltip && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "110%",
              zIndex: 10,
              background: "#fff",
              color: "#222",
              border: "1px solid #bbb",
              borderRadius: 8,
              padding: "12px 16px",
              minWidth: 220,
              maxWidth: 320,
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.5,
              pointerEvents: "none",
              whiteSpace: "pre-line",
            }}
            role="tooltip"
          >
            {description}
          </div>
        )}
      </span>
      <button
        className={styles.algorithmButton}
        onClick={onSolve}
        disabled={!algorithm || !inputValid}
        title={!inputValid ? (inputErrors && inputErrors.length ? inputErrors.join("\n") : "Please fix input errors.") : ""}
      >
        Solve
      </button>
    </div>
  );
};

export default AlgorithmSelector; 