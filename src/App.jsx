import React, { useRef } from "react";
import Header from "./components/Header";
import InputForm from "./components/InputForm";
import MatrixInput from "./components/MatrixInput";
import DemandInput from "./components/DemandInput";
import AlgorithmSelector from "./components/AlgorithmSelector";
import Results from "./components/Results";
import Animation from "./components/Animation";
import Graphs from "./components/Graphs";
import ComparisonTable from "./components/ComparisonTable";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import * as algorithms from "./algorithms";
import "./App.css";

const algorithmLabels = {
  branchAndBound: "Branch and Bound",
  simulatedAnnealing: "Simulated Annealing",
  clarkeAndWright: "Clarke and Wright",
  sweepMethod: "Sweep Method",
  tabuSearch: "Tabu Search",
  dynamicProgramming: "Dynamic Programming",
  antColonyOptimization: "Ant Colony Optimization",
  neuralNetwork: "Neural Network",
  geneticAlgorithm: "Genetic Algorithm",
  adaptiveMemorySearch: "Adaptive Memory Search",
};

function App() {
  const [numCities, setNumCities] = React.useState(0);
  const [numVehicles, setNumVehicles] = React.useState(0);
  const [vehicleCapacity, setVehicleCapacity] = React.useState(0);
  const [costMatrix, setCostMatrix] = React.useState([]);
  const [demandArray, setDemandArray] = React.useState([]);
  const [algorithm, setAlgorithm] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [timeTaken, setTimeTaken] = React.useState([]);
  const [costTaken, setCostTaken] = React.useState([]);
  const [inputValid, setInputValid] = React.useState(false);
  const [inputErrors, setInputErrors] = React.useState([]);

  const formRef = useRef(null);
  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSolve = () => {
    if (!algorithm || !inputValid) return;
    const start = performance.now();
    const solution = algorithms[algorithm](
      numCities,
      numVehicles,
      vehicleCapacity,
      costMatrix,
      demandArray
    );
    const end = performance.now();
    setResult(solution);
    setTimeTaken((prev) => [...prev, end - start]);
    setCostTaken((prev) => [...prev, solution.cost]);
  };

  return (
    <div className="App">
      <Hero onScrollToForm={handleScrollToForm} />
      <Features />
      <div className="mainCard" ref={formRef}>
        <Header />
        <InputForm
          numCities={numCities}
          setNumCities={setNumCities}
          numVehicles={numVehicles}
          setNumVehicles={setNumVehicles}
          vehicleCapacity={vehicleCapacity}
          setVehicleCapacity={setVehicleCapacity}
          setInputValid={setInputValid}
          setInputErrors={setInputErrors}
        />
        <MatrixInput
          numCities={numCities}
          costMatrix={costMatrix}
          setCostMatrix={setCostMatrix}
        />
        <DemandInput
          numCities={numCities}
          demandArray={demandArray}
          setDemandArray={setDemandArray}
        />
        <AlgorithmSelector
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          onSolve={handleSolve}
          inputValid={inputValid}
          inputErrors={inputErrors}
        />
        <Results result={result} />
        <Animation result={result} />
        <Graphs timeTaken={timeTaken} costTaken={costTaken} />
        {inputValid && (
          <ComparisonTable
            numCities={numCities}
            numVehicles={numVehicles}
            vehicleCapacity={vehicleCapacity}
            costMatrix={costMatrix}
            demandArray={demandArray}
            algorithms={algorithms}
            algorithmLabels={algorithmLabels}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App; 