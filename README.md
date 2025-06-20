
# Vehicle Routing Problem Visualizer (React.js)

**If you are missing package.json or Vite config, see the instructions below.**

A modern, interactive web application to visualize and solve the Vehicle Routing Problem (VRP) using multiple algorithms. Built with React.js for a modular, maintainable, and scalable codebase.

## Features
- Input number of cities, vehicles, and vehicle capacity
- Dynamic distance matrix and demand array input
- Multiple VRP algorithms:
  - Branch and Bound
  - Simulated Annealing
  - Clarke and Wright
  - Sweep Method
  - Tabu Search
  - Dynamic Programming
  - Ant Colony Optimization
  - Neural Network
  - Genetic Algorithm
  - Adaptive Memory Search
- Visualize routes and results
- Animated vehicle path visualization
- Time and cost comparison graphs (Chart.js)
- Responsive, modern UI

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd vrp-visualizer
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Open in browser:**
   Visit [http://localhost:5173](http://localhost:5173)

## Usage
- Enter the number of cities, vehicles, and vehicle capacity.
- Fill in the distance matrix and demand array.
- Select an algorithm and click "Solve".
- View the results, animation, and comparison graphs.

## Technologies Used
- React.js
- Vite
- Chart.js (`react-chartjs-2`)
- CSS Modules (or global CSS)

## Folder Structure
```
src/
  components/
    Header.jsx
    InputForm.jsx
    MatrixInput.jsx
    DemandInput.jsx
    AlgorithmSelector.jsx
    Results.jsx
    Animation.jsx
    Graphs.jsx
  algorithms/
    branchAndBound.js
    simulatedAnnealing.js
    clarkeAndWright.js
    sweepMethod.js
    tabuSearch.js
    dynamicProgramming.js
    antColonyOptimization.js
    neuralNetwork.js
    geneticAlgorithm.js
    adaptiveMemorySearch.js
  App.jsx
  App.css
  main.jsx
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT 

---

## Troubleshooting: Missing package.json or Vite config

If you see errors about missing `package.json` or Vite config, run these commands in your project folder:

```bash
npm create vite@latest . -- --template react
npm install
```

If you are still missing files, copy the provided `package.json`, `vite.config.js`, and `index.html` from this repo.

Then start the dev server:

```bash
npm run dev
``` 
