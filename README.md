
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

body, html {
  height: 100%;
  width: 100%;
  margin: 0;
  font-family: 'Roboto', Arial, sans-serif;
  /* Animated gradient background */
  background: linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%);
  background-size: 200% 200%;
  animation: gradientMove 12s ease-in-out infinite;
  color: #222;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.App {
  min-height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px;
}

.mainCard {
  background: rgba(255,255,255,0.82);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(60,60,120,0.18);
  padding: 36px 32px 32px 32px;
  margin: 0 auto 32px auto;
  max-width: 900px;
  width: 98vw;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  /* Glassmorphism effect */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 1.2s cubic-bezier(.39,.575,.56,1) both;
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(30px);}
  100% { opacity: 1; transform: none;}
}

@media (max-width: 768px) {
  .App {
    padding: 0 4px;
  }
  .mainCard {
    padding: 18px 4px 18px 4px;
    min-width: unset;
  }
}

.heading {
  background: transparent;
  color: #222;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 18px 0;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0;
}#
