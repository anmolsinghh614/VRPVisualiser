// Sample Input for 3 Cities
const numCitiesTest = 3; // Number of cities (including depot)
const numVehiclesTest = 2; // Number of vehicles
const vehicleCapacityTest = 5; // Maximum capacity of each vehicle
const costMatrixTest = [
  [0, 4, 8],  // Distances between cities
  [4, 0, 6],
  [8, 6, 0],
];


  // The Following methods giving out Error for good sample case : Sweep, Neural Network, Clark and Wright




const demandArrayTest = [0, 3, 4]; // Demand of each city (index 0 is the depot)
//Sample Input For Grapgh
labels = [
  ["Branch", "and", "bound"],
  ["Dynamic", "programming"],
  ["Clarke", "wright"],
  "Sweep",
  ["Simulated", "annealing"],
  ["Tabu", "search"],
  ["Adaptive", "memory", "search"],
  ["Genetic", "search"],
  ["Ant", "colony", "optimization"],
  ["Neural", "network"]
];
let timeTaken = [0,0,0,0,0,0,0,0,0,0];
let costTaken = [0,0,0,0,0,0,0,0,0,0];
let algorithmIndex=3;
//Global Variable
let cityCount;

// Call the branchAndBound function with test inputs
const solution = branchAndBound(
  numCitiesTest,
  numVehiclesTest,
  vehicleCapacityTest,
  costMatrixTest,
  demandArrayTest
);

console.log("Best Solution for 3 cities:", solution);

// Part 0:Algorithm Logic
// A)Branch and Bound
function branchAndBound(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  const bestSolution = { cost: Infinity, routes: [] };

  // Helper function to check if a route is feasible given vehicle capacity
  function isFeasible(route, demand) {
    const totalDemand = route.reduce((sum, city) => sum + demand[city], 0);
    return totalDemand <= vehicleCapacity;
  }

  // Recursive function to explore solutions
  function solve(currentRoutes, remainingCities, currentCost) {
    // Base case: all cities are visited
    if (remainingCities.length === 0) {
      // Add return-to-depot cost for each route
      const totalCost = currentCost + currentRoutes.reduce((sum, route) => {
        if (route.length > 0) {
          const lastCity = route[route.length - 1]; // Last city in the current route
          sum += costMatrix[lastCity][0]; // Add return to depot cost for this route
        }
        return sum;
      }, 0);

      // If the total cost is better than the best found so far, update the best solution
      if (totalCost < bestSolution.cost) {
        bestSolution.cost = totalCost;
        bestSolution.routes = currentRoutes.map(route => [0, ...route, 0]); // Include depot in routes
      }
      return;
    }

    const currentVehicle = currentRoutes.length - 1;

    // Explore adding cities to the current vehicle's route
    if (currentVehicle >= 0) {
      for (let i = 0; i < remainingCities.length; i++) {
        const city = remainingCities[i];
        const newRoute = [...currentRoutes[currentVehicle], city];
        const lastCity = currentRoutes[currentVehicle].slice(-1)[0] || 0; // Default to depot if empty

        const newCost = currentCost + costMatrix[lastCity][city]; // Add transition cost

        // Check if the route is feasible
        if (isFeasible(newRoute, demandArray)) {
          const newRemainingCities = remainingCities.filter((_, idx) => idx !== i);
          const updatedRoutes = [...currentRoutes];
          updatedRoutes[currentVehicle] = newRoute;
          solve(updatedRoutes, newRemainingCities, newCost);
        }
      }
    }

    // Start a new route with a new vehicle if feasible
    if (currentRoutes.length < numVehicles) {
      const newRemainingCities = [...remainingCities];
      const newRoutes = [...currentRoutes, []];
      const firstCity = remainingCities[0];

      if (firstCity !== undefined) {
        newRoutes[newRoutes.length - 1].push(firstCity);
        solve(newRoutes, newRemainingCities.slice(1), currentCost + costMatrix[0][firstCity]); // Add cost from depot to first city
      }
    }
  }

  // Initialize the algorithm
  solve(
    [[]], // Start with empty routes (depot is assumed to be the starting point)
    Array.from({ length: numCities - 1 }, (_, i) => i + 1), // Cities to visit (excluding depot)
    0 // Initial cost
  );

  return bestSolution;
}


//






//Simulated Annealing 

function simulatedAnnealing(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  const depot = 0;
  const initialTemperature = 1000;
  const coolingRate = 0.99;
  const minTemperature = 0.1;

  // Helper function to calculate the cost of a route
  function calculateCost(route, matrix) {
    let cost = 0;
    for (let i = 0; i < route.length - 1; i++) {
      cost += matrix[route[i]][route[i + 1]];
    }
    return cost;
  }

  // Helper function to generate an initial solution
  function generateInitialSolution() {
    const remainingCities = Array.from({ length: numCities - 1 }, (_, i) => i + 1);
    const routes = [];
    let currentRoute = [];
    let currentDemand = 0;

    while (remainingCities.length > 0) {
      const city = remainingCities.shift();
      if (currentDemand + demandArray[city] <= vehicleCapacity) {
        currentRoute.push(city);
        currentDemand += demandArray[city];
      } else {
        routes.push([depot, ...currentRoute, depot]);
        currentRoute = [city];
        currentDemand = demandArray[city];
      }
    }

    if (currentRoute.length > 0) {
      routes.push([depot, ...currentRoute, depot]);
    }

    return routes;
  }

  // Helper function to calculate the total cost of all routes
  function calculateTotalCost(routes) {
    return routes.reduce((sum, route) => sum + calculateCost(route, costMatrix), 0);
  }

  // Helper function to perform a random swap mutation on a solution
  function mutateSolution(routes) {
    const newRoutes = JSON.parse(JSON.stringify(routes));
    const routeIndex1 = Math.floor(Math.random() * newRoutes.length);
    const routeIndex2 = Math.floor(Math.random() * newRoutes.length);

    const route1 = newRoutes[routeIndex1];
    const route2 = newRoutes[routeIndex2];

    if (route1.length > 2 && route2.length > 2) {
      const city1 = route1.splice(1 + Math.floor(Math.random() * (route1.length - 2)), 1)[0];
      const city2 = route2.splice(1 + Math.floor(Math.random() * (route2.length - 2)), 1)[0];

      route1.splice(1 + Math.floor(Math.random() * (route1.length - 1)), 0, city2);
      route2.splice(1 + Math.floor(Math.random() * (route2.length - 1)), 0, city1);
    }

    return newRoutes;
  }

  // Simulated Annealing process
  let currentSolution = generateInitialSolution();
  let currentCost = calculateTotalCost(currentSolution);
  let bestSolution = currentSolution;
  let bestCost = currentCost;

  let temperature = initialTemperature;

  while (temperature > minTemperature) {
    const newSolution = mutateSolution(currentSolution);
    const newCost = calculateTotalCost(newSolution);

    if (
      newCost < currentCost ||
      Math.random() < Math.exp((currentCost - newCost) / temperature)
    ) {
      currentSolution = newSolution;
      currentCost = newCost;

      if (currentCost < bestCost) {
        bestSolution = currentSolution;
        bestCost = currentCost;
      }
    }

    temperature *= coolingRate;
  }

  // Return the solution in the required format
  return {
    cost: bestCost,
    routes: bestSolution,
  };
}




// Clark and Wright Method 
function clarkeAndWright(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  const depot = 0; // Assuming depot is city 0
  const routes = Array.from({ length: numCities - 1 }, (_, i) => [i + 1]); // Start with one route per city
  const routeDemands = [...demandArray];
  const savingsList = [];

  // Calculate savings for each pair of cities
  for (let i = 1; i < numCities; i++) {
    for (let j = i + 1; j < numCities; j++) {
      const saving = costMatrix[depot][i] + costMatrix[depot][j] - costMatrix[i][j];
      savingsList.push({ i, j, saving });
    }
  }

  // Sort savings in descending order
  savingsList.sort((a, b) => b.saving - a.saving);

  // Merge routes based on savings
  for (const { i, j } of savingsList) {
    let routeI = routes.find(route => route.includes(i));
    let routeJ = routes.find(route => route.includes(j));

    if (routeI !== routeJ && routeI && routeJ) {
      const totalDemand = routeI.reduce((sum, city) => sum + demandArray[city], 0) +
        routeJ.reduce((sum, city) => sum + demandArray[city], 0);

      if (totalDemand <= vehicleCapacity) {
        // Merge routes and remove the old ones
        const newRoute = [...routeI, ...routeJ];
        routes.splice(routes.indexOf(routeI), 1);
        routes.splice(routes.indexOf(routeJ), 1);
        routes.push(newRoute);
      }
    }
  }

  // Ensure the number of routes doesn't exceed the vehicle limit
  while (routes.length > numVehicles) {
    const smallestRoute = routes.reduce((a, b) => (a.length < b.length ? a : b));
    routes.splice(routes.indexOf(smallestRoute), 1);
  }

  // Calculate the cost of the final solution
  const totalCost = routes.reduce((sum, route) => {
    let cost = costMatrix[depot][route[0]]; // Cost from depot to first city
    for (let i = 0; i < route.length - 1; i++) {
      cost += costMatrix[route[i]][route[i + 1]];
    }
    cost += costMatrix[route[route.length - 1]][depot]; // Cost from last city to depot
    return sum + cost;
  }, 0);

  // Return solution in the required format
  return {
    cost: totalCost,
    routes: routes.map(route => [depot, ...route, depot]),
  };
}

//Sweep Method

function sweepMethod(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  const depot = 0; // Assuming depot is city 0
  const polarCoordinates = []; // Store angles and distances
  const routes = []; // To store the final routes

  // Calculate polar coordinates (angle relative to depot)
  for (let i = 1; i < numCities; i++) {
    const x = costMatrix[depot][i]; // x-distance (used here as costMatrix gives distances)
    const y = i; // Simulating a unique Y-value based on city index
    const angle = Math.atan2(y, x); // Calculate angle
    polarCoordinates.push({ city: i, angle });
  }

  // Sort cities by angle
  polarCoordinates.sort((a, b) => a.angle - b.angle);

  let currentRoute = [];
  let currentDemand = 0;

  // Sweep through the sorted cities
  for (const { city } of polarCoordinates) {
    const cityDemand = demandArray[city];

    // Check if adding this city to the current route exceeds capacity
    if (currentDemand + cityDemand <= vehicleCapacity) {
      currentRoute.push(city);
      currentDemand += cityDemand;
    } else {
      // Finalize the current route and start a new one
      routes.push([depot, ...currentRoute, depot]);
      currentRoute = [city];
      currentDemand = cityDemand;
    }
  }

  // Add the last route if not empty
  if (currentRoute.length > 0) {
    routes.push([depot, ...currentRoute, depot]);
  }

  // Ensure the number of routes does not exceed the number of vehicles
  if (routes.length > numVehicles) {
    throw new Error(
      `Number of vehicles is insufficient to handle the demand. Required: ${routes.length}, Available: ${numVehicles}`
    );
  }

  // Calculate the total cost of all routes
  const totalCost = routes.reduce((sum, route) => {
    let routeCost = 0;
    for (let i = 0; i < route.length - 1; i++) {
      routeCost += costMatrix[route[i]][route[i + 1]];
    }
    return sum + routeCost;
  }, 0);

  // Return the solution in the required format
  return {
    cost: totalCost,
    routes,
  };
}

function tabuSearch(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  const maxIterations = 10;
  const tabuListSize = 50;

  // Helper function to calculate the cost of a route
  function calculateCost(route, matrix) {
    let cost = 0;
    for (let i = 0; i < route.length - 1; i++) {
      cost += matrix[route[i]][route[i + 1]];
    }
    return cost;
  }

  // Helper function to calculate the total cost of all routes
  function calculateTotalCost(routes) {
    return routes.reduce((sum, route) => sum + calculateCost(route, costMatrix), 0);
  }

  // Helper function to check if a route is feasible given vehicle capacity
  function isFeasible(route, demand) {
    const totalDemand = route.reduce((sum, city) => sum + demand[city], 0);
    return totalDemand <= vehicleCapacity;
  }

  // Generate an initial solution (sequential assignment of cities to vehicles)
  function generateInitialSolution() {
    const remainingCities = Array.from({ length: numCities - 1 }, (_, i) => i + 1);
    const routes = [];
    let currentRoute = [];
    let currentDemand = 0;

    while (remainingCities.length > 0) {
      const city = remainingCities.shift();
      if (currentDemand + demandArray[city] <= vehicleCapacity) {
        currentRoute.push(city);
        currentDemand += demandArray[city];
      } else {
        routes.push([0, ...currentRoute, 0]);
        currentRoute = [city];
        currentDemand = demandArray[city];
      }
    }

    if (currentRoute.length > 0) {
      routes.push([0, ...currentRoute, 0]);
    }

    return routes;
  }

  // Perform a swap mutation on a solution
  function mutateSolution(routes) {
    const newRoutes = JSON.parse(JSON.stringify(routes));
    const routeIndex1 = Math.floor(Math.random() * newRoutes.length);
    const routeIndex2 = Math.floor(Math.random() * newRoutes.length);

    const route1 = newRoutes[routeIndex1];
    const route2 = newRoutes[routeIndex2];

    if (route1.length > 2 && route2.length > 2) {
      const city1 = route1.splice(1 + Math.floor(Math.random() * (route1.length - 2)), 1)[0];
      const city2 = route2.splice(1 + Math.floor(Math.random() * (route2.length - 2)), 1)[0];

      route1.splice(1 + Math.floor(Math.random() * (route1.length - 1)), 0, city2);
      route2.splice(1 + Math.floor(Math.random() * (route2.length - 1)), 0, city1);
    }

    return newRoutes;
  }

  // Tabu Search process
  let currentSolution = generateInitialSolution();
  let bestSolution = currentSolution;
  let currentCost = calculateTotalCost(currentSolution);
  let bestCost = currentCost;
  let tabuList = [];

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let bestNeighbor = null;
    let bestNeighborCost = Infinity;

    for (let i = 0; i < 10; i++) {
      const neighbor = mutateSolution(currentSolution);
      const neighborCost = calculateTotalCost(neighbor);

      if (
        neighborCost < bestNeighborCost &&
        !tabuList.some(solution => JSON.stringify(solution) === JSON.stringify(neighbor))
      ) {
        bestNeighbor = neighbor;
        bestNeighborCost = neighborCost;
      }
    }

    if (bestNeighbor) {
      currentSolution = bestNeighbor;
      currentCost = bestNeighborCost;

      if (currentCost < bestCost) {
        bestSolution = currentSolution;
        bestCost = currentCost;
      }

      tabuList.push(currentSolution);
      if (tabuList.length > tabuListSize) {
        tabuList.shift();
      }
    }
  }

  return {
    cost: bestCost,
    routes: bestSolution,
  };
}


//DP Method 

function dynamicProgrammingVRP(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  // Calculate total demand
  let totalDemand = demandArray.reduce((sum, demand) => sum + demand, 0);
  if (numVehicles * vehicleCapacity < totalDemand) {
      return { cost: Infinity, routes: [] };
  }

  const totalMask = (1 << numCities) - 1;

  // Capacity required for each subset of cities
  const capacityRequired = Array(totalMask + 1).fill(0);
  for (let mask = 0; mask <= totalMask; mask++) {
      for (let city = 0; city < numCities; city++) {
          if ((mask & (1 << city)) !== 0) {
              capacityRequired[mask] += demandArray[city];
          }
      }
  }

  // Optimal cost and path for each subset
  const optimalCost = Array(totalMask + 1).fill(Infinity);
  const optimalPath = Array(totalMask + 1).fill([]);

  for (let mask = 0; mask <= totalMask; mask++) {
      const dp = Array.from({ length: numCities }, () => Array(totalMask + 1).fill(Infinity));
      const nxtCity = Array.from({ length: numCities }, () => Array(totalMask + 1).fill(0));

      for (let subMask = mask; ; subMask = (subMask - 1) & mask) {
          for (let lastCity = 0; lastCity < numCities; lastCity++) {
              if (subMask === mask) {
                  dp[lastCity][subMask] = costMatrix[lastCity][0];
                  nxtCity[lastCity][subMask] = 0;
                  continue;
              } else {
                  for (let city = 1; city < numCities; city++) {
                      if ((subMask & (1 << city)) !== 0) continue;
                      let newMask = subMask | (1 << city);
                      if (dp[lastCity][subMask] > costMatrix[lastCity][city] + dp[city][newMask]) {
                          dp[lastCity][subMask] = costMatrix[lastCity][city] + dp[city][newMask];
                          nxtCity[lastCity][subMask] = city;
                      }
                  }
              }
          }
          if (subMask === 0) break; // Prevent infinite loop
      }

      optimalCost[mask] = dp[0][1];
      const pathFound = [0];
      let currentCity = 0;
      let currentMask = 1;

      while (nxtCity[currentCity][currentMask] !== 0) {
          currentCity = nxtCity[currentCity][currentMask];
          pathFound.push(currentCity);
          currentMask |= 1 << currentCity;
      }

      if (pathFound.length > 1) {
          pathFound.push(0);
      }

      optimalPath[mask] = pathFound;
  }

  // Calculate vehicle costs
  const vehicleCost = Array.from({ length: numVehicles }, () => Array(totalMask + 1).fill(Infinity));
  const nxtMask = Array(totalMask + 1).fill(0);

  for (let vehicle = numVehicles - 1; vehicle >= 0; vehicle--) {
      for (let left = totalMask; left >= 0; left--) {
          if (left <= 1) {
              vehicleCost[vehicle][left] = 0;
              nxtMask[left] = 0;
          } else if (vehicle === numVehicles - 1) {
              if (capacityRequired[left] <= vehicleCapacity) {
                  vehicleCost[vehicle][left] = optimalCost[left];
                  nxtMask[left] = 0;
              }
          } else {
              for (let chosen = left; ; chosen = (chosen - 1) & left) {
                  const currentCities = chosen | 1;
                  const leftCities = (left ^ chosen) | 1;
                  if (capacityRequired[currentCities] <= vehicleCapacity) {
                      if (vehicleCost[vehicle][left] > optimalCost[currentCities] + vehicleCost[vehicle + 1][leftCities]) {
                          vehicleCost[vehicle][left] = optimalCost[currentCities] + vehicleCost[vehicle + 1][leftCities];
                          nxtMask[left] = leftCities;
                      }
                  }
                  if (chosen === 0) break;
              }
          }
      }
  }

  let vehicle = 0;
  let left = totalMask;
  const result = { cost: vehicleCost[0][totalMask], routes: [] };

  while (nxtMask[left] !== 0) {
      const nxtCities = nxtMask[left];
      const currentCities = (nxtCities ^ left) | 1;
      result.routes.push(optimalPath[currentCities]);
      vehicle++;
      left = nxtCities;
  }

  return result;
}
//Ant Colony Optimization 
function antColonyOptimization(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  const alpha = 1; // Pheromone importance
  const beta = 2; // Distance importance
  const evaporationRate = 0.5; // Evaporation rate of pheromones
  const pheromoneFactor = 100; // Factor for depositing pheromones
  const numAnts = 20; // Number of ants
  const maxIterations = 10; // Number of iterations

  const pheromone = Array.from({ length: numCities }, () =>
    Array(numCities).fill(1) // Initialize pheromone matrix
  );

  const bestSolution = { cost: Infinity, routes: [] };

  // Helper function to calculate the cost of a route
  function calculateCost(route, matrix) {
    let cost = 0;
    for (let i = 0; i < route.length - 1; i++) {
      cost += matrix[route[i]][route[i + 1]];
    }
    return cost;
  }

  // Helper function to check if a route is feasible given vehicle capacity
  function isFeasible(route, demand) {
    const totalDemand = route.reduce((sum, city) => sum + demand[city], 0);
    return totalDemand <= vehicleCapacity;
  }

  // Helper function to choose the next city based on probabilities
  function selectNextCity(currentCity, unvisitedCities, pheromone, matrix) {
    const probabilities = unvisitedCities.map(city => {
      const pheromoneLevel = pheromone[currentCity][city];
      const distance = matrix[currentCity][city];
      return Math.pow(pheromoneLevel, alpha) * Math.pow(1 / distance, beta);
    });

    const sumProbabilities = probabilities.reduce((sum, p) => sum + p, 0);
    const normalizedProbabilities = probabilities.map(p => p / sumProbabilities);

    const random = Math.random();
    let cumulativeProbability = 0;

    for (let i = 0; i < normalizedProbabilities.length; i++) {
      cumulativeProbability += normalizedProbabilities[i];
      if (random <= cumulativeProbability) {
        return unvisitedCities[i];
      }
    }

    return unvisitedCities[0]; // Fallback
  }

  // Function to generate a solution for one ant
  function generateSolution() {
    const unvisitedCities = Array.from({ length: numCities - 1 }, (_, i) => i + 1);
    const routes = [];
    let currentRoute = [0];
    let currentDemand = 0;

    while (unvisitedCities.length > 0) {
      const currentCity = currentRoute[currentRoute.length - 1];
      const feasibleCities = unvisitedCities.filter(city => {
        return currentDemand + demandArray[city] <= vehicleCapacity;
      });

      if (feasibleCities.length === 0) {
        routes.push([...currentRoute, 0]);
        currentRoute = [0];
        currentDemand = 0;
        continue;
      }

      const nextCity = selectNextCity(currentCity, feasibleCities, pheromone, costMatrix);
      currentRoute.push(nextCity);
      currentDemand += demandArray[nextCity];
      unvisitedCities.splice(unvisitedCities.indexOf(nextCity), 1);
    }

    if (currentRoute.length > 1) {
      routes.push([...currentRoute, 0]);
    }

    return routes;
  }

  // Main ACO loop
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const antSolutions = [];

    // Generate solutions for all ants
    for (let ant = 0; ant < numAnts; ant++) {
      const routes = generateSolution();
      const cost = routes.reduce((sum, route) => sum + calculateCost(route, costMatrix), 0);
      antSolutions.push({ routes, cost });

      // Update best solution
      if (cost < bestSolution.cost) {
        bestSolution.cost = cost;
        bestSolution.routes = routes;
      }
    }

    // Update pheromones
    for (let i = 0; i < numCities; i++) {
      for (let j = 0; j < numCities; j++) {
        pheromone[i][j] *= (1 - evaporationRate); // Evaporation
      }
    }

    for (const solution of antSolutions) {
      const { routes, cost } = solution;
      const contribution = pheromoneFactor / cost;

      for (const route of routes) {
        for (let i = 0; i < route.length - 1; i++) {
          const from = route[i];
          const to = route[i + 1];
          pheromone[from][to] += contribution;
          pheromone[to][from] += contribution; // Symmetric
        }
      }
    }
  }

  return {
    cost: bestSolution.cost,
    routes: bestSolution.routes,
  };
}

//Neural Network
function neuralNetworkVRP(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  const maxIterations = 5; // Number of iterations for optimization
  const learningRate = 0.01; // Learning rate for neural network adjustments

  // Initialize weights for neural network (cities x vehicles)
  let weights = Array.from({ length: numCities }, () =>
      Array(numVehicles).fill(Math.random() * 0.01) // Small random values
  );

  const bestSolution = { cost: Infinity, routes: [] };

  // Helper function to calculate the cost of a route
  function calculateCost(route, matrix) {
      let cost = 0;
      for (let i = 0; i < route.length - 1; i++) {
          cost += matrix[route[i]][route[i + 1]];
      }
      return cost;
  }

  // Helper function to check if a route is feasible given vehicle capacity
  function isFeasible(route, demand) {
      const totalDemand = route.reduce((sum, city) => sum + demand[city], 0);
      return totalDemand <= vehicleCapacity;
  }

  // Neural network forward pass to assign cities to vehicles
  function forwardPass(weights) {
      const assignments = Array.from({ length: numVehicles }, () => []);
      const cityIndices = Array.from({ length: numCities - 1 }, (_, i) => i + 1); // Exclude depot

      for (const city of cityIndices) {
          const probabilities = weights[city].map(w => Math.exp(w));
          const totalProbability = probabilities.reduce((sum, p) => sum + p, 0);
          const normalized = probabilities.map(p => p / totalProbability);

          const vehicle = normalized.indexOf(Math.max(...normalized));
          assignments[vehicle].push(city);
      }

      return assignments;
  }

  // Optimize route ordering using nearest neighbor heuristic
  function optimizeRoute(route) {
      if (route.length === 0) return [0]; // Return only depot if no cities

      const optimizedRoute = [0]; // Start at depot
      const remainingCities = [...route];
      let currentCity = 0;

      while (remainingCities.length > 0) {
          let nearestCity = null;
          let nearestDistance = Infinity;

          for (const city of remainingCities) {
              if (costMatrix[currentCity][city] < nearestDistance) {
                  nearestCity = city;
                  nearestDistance = costMatrix[currentCity][city];
              }
          }

          optimizedRoute.push(nearestCity);
          currentCity = nearestCity;
          remainingCities.splice(remainingCities.indexOf(nearestCity), 1);
      }

      optimizedRoute.push(0); // Return to depot
      return optimizedRoute;
  }

  // Neural network training loop
  for (let iteration = 0; iteration < maxIterations; iteration++) {
      const assignments = forwardPass(weights);

      // Construct routes and calculate cost
      const routes = [];
      let totalCost = 0;

      for (const route of assignments) {
          if (isFeasible(route, demandArray)) {
              const optimized = optimizeRoute(route);
              routes.push(optimized);
              totalCost += calculateCost(optimized, costMatrix);
          }
      }

      // Update best solution
      if (totalCost < bestSolution.cost) {
          bestSolution.cost = totalCost;
          bestSolution.routes = routes;
      }

      // Backpropagation: Adjust weights to reduce cost
      for (let city = 1; city < numCities; city++) { // Start from city 1 to exclude depot
          for (let vehicle = 0; vehicle < numVehicles; vehicle++) {
              const assignment = routes[vehicle]?.includes(city) ? 1 : 0;
              const gradient = assignment - weights[city][vehicle]; // Calculate the gradient
              weights[city][vehicle] += learningRate * gradient; // Update weights based on gradient
          }
      }
  }

  return {
      cost: bestSolution.cost,
      routes: bestSolution.routes,
    };
}
//Genetic Search 

function geneticAlgorithmVRP(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  const populationSize = 50; // Number of solutions in the population
  const generations = 200; // Number of generations to run
  const mutationRate = 0.1; // Probability of mutation
  const eliteCount = 5; // Number of elite individuals to carry forward

  const bestSolution = { cost: Infinity, routes: [] };

  // Helper function to calculate the cost of a route
  function calculateCost(route, matrix) {
    let cost = 0;
    for (let i = 0; i < route.length - 1; i++) {
      cost += matrix[route[i]][route[i + 1]];
    }
    return cost;
  }

  // Helper function to check if a route is feasible given vehicle capacity
  function isFeasible(route, demand) {
    const totalDemand = route.reduce((sum, city) => sum + demand[city], 0);
    return totalDemand <= vehicleCapacity;
  }

  // Generate a random solution
  function generateRandomSolution() {
    const cities = Array.from({ length: numCities - 1 }, (_, i) => i + 1); // Exclude depot
    const shuffled = cities.sort(() => Math.random() - 0.5); // Shuffle cities randomly
    const routes = [];
    let currentRoute = [];

    for (const city of shuffled) {
      if (isFeasible([...currentRoute, city], demandArray)) {
        currentRoute.push(city);
      } else {
        routes.push([...currentRoute]);
        currentRoute = [city];
      }
    }
    if (currentRoute.length > 0) routes.push([...currentRoute]);

    // Ensure we use only the allowed number of vehicles
    while (routes.length > numVehicles) {
      const lastRoute = routes.pop();
      routes[routes.length - 1].push(...lastRoute);
    }

    return routes;
  }

  // Crossover function to produce offspring
  function crossover(parent1, parent2) {
    const child = [];
    const citySet = new Set();

    for (let i = 0; i < parent1.length; i++) {
      const route = i % 2 === 0 ? parent1[i] : parent2[i % parent2.length];
      const newRoute = route.filter(city => !citySet.has(city));
      newRoute.forEach(city => citySet.add(city));
      child.push(newRoute);
    }

    return child;
  }

  // Mutate a solution by swapping cities within routes
  function mutate(solution) {
    const mutated = solution.map(route => {
      if (Math.random() < mutationRate) {
        const idx1 = Math.floor(Math.random() * route.length);
        const idx2 = Math.floor(Math.random() * route.length);
        [route[idx1], route[idx2]] = [route[idx2], route[idx1]]; // Swap cities
      }
      return route;
    });
    return mutated;
  }

  // Calculate total cost of a solution
  function calculateTotalCost(solution) {
    return solution.reduce((sum, route) => {
      if (route.length > 0) {
        const completeRoute = [0, ...route, 0]; // Add depot
        return sum + calculateCost(completeRoute, costMatrix);
      }
      return sum;
    }, 0);
  }

  // Initialize population
  let population = Array.from({ length: populationSize }, generateRandomSolution);

  for (let generation = 0; generation < generations; generation++) {
    // Evaluate fitness
    const fitness = population.map(solution => ({
      solution,
      cost: calculateTotalCost(solution),
    }));

    // Update best solution
    fitness.sort((a, b) => a.cost - b.cost);
    if (fitness[0].cost < bestSolution.cost) {
      bestSolution.cost = fitness[0].cost;
      bestSolution.routes = fitness[0].solution.map(route => [0, ...route, 0]); // Add depot
    }

    // Select elites
    const elites = fitness.slice(0, eliteCount).map(f => f.solution);

    // Generate next generation
    const newPopulation = [...elites];
    while (newPopulation.length < populationSize) {
      const parent1 = fitness[Math.floor(Math.random() * eliteCount)].solution;
      const parent2 = fitness[Math.floor(Math.random() * eliteCount)].solution;
      const child = mutate(crossover(parent1, parent2));
      newPopulation.push(child);
    }

    population = newPopulation;
  }

  return bestSolution;
}



//Adaptive Memory Search 

function adaptiveMemorySearch(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  const maxIterations = 10; // Maximum number of iterations
  const memorySize = 10; // Size of the adaptive memory
  const diversificationRate = 0.2; // Probability of applying diversification

  // Helper function to calculate the cost of a route
  function calculateCost(route, matrix) {
    let cost = 0;
    for (let i = 0; i < route.length - 1; i++) {
      cost += matrix[route[i]][route[i + 1]];
    }
    return cost;
  }

  // Helper function to calculate the total cost of all routes
  function calculateTotalCost(routes) {
    return routes.reduce((sum, route) => sum + calculateCost(route, costMatrix), 0);
  }

  // Helper function to check if a route is feasible given vehicle capacity
  function isFeasible(route, demand) {
    const totalDemand = route.reduce((sum, city) => sum + demand[city], 0);
    return totalDemand <= vehicleCapacity;
  }

  // Generate an initial solution (sequential assignment of cities to vehicles)
  function generateInitialSolution() {
    const remainingCities = Array.from({ length: numCities - 1 }, (_, i) => i + 1);
    const routes = [];
    let currentRoute = [];
    let currentDemand = 0;

    while (remainingCities.length > 0) {
      const city = remainingCities.shift();
      if (currentDemand + demandArray[city] <= vehicleCapacity) {
        currentRoute.push(city);
        currentDemand += demandArray[city];
      } else {
        routes.push([0, ...currentRoute, 0]);
        currentRoute = [city];
        currentDemand = demandArray[city];
      }
    }

    if (currentRoute.length > 0) {
      routes.push([0, ...currentRoute, 0]);
    }

    return routes;
  }

  // Apply a local search to improve a solution
  function localSearch(routes) {
    const newRoutes = JSON.parse(JSON.stringify(routes));
    const routeIndex = Math.floor(Math.random() * newRoutes.length);
    const route = newRoutes[routeIndex];

    if (route.length > 3) {
      // Swap two cities within the route
      const i = 1 + Math.floor(Math.random() * (route.length - 2));
      const j = 1 + Math.floor(Math.random() * (route.length - 2));
      [route[i], route[j]] = [route[j], route[i]];
    }

    return newRoutes;
  }

  // Perform diversification to escape local optima
  function diversification() {
    const remainingCities = Array.from({ length: numCities - 1 }, (_, i) => i + 1);
    const routes = [];
    for (let i = 0; i < numVehicles; i++) {
      const route = [];
      let currentDemand = 0;
      while (remainingCities.length > 0) {
        const cityIndex = Math.floor(Math.random() * remainingCities.length);
        const city = remainingCities[cityIndex];
        if (currentDemand + demandArray[city] <= vehicleCapacity) {
          route.push(city);
          currentDemand += demandArray[city];
          remainingCities.splice(cityIndex, 1);
        } else {
          break;
        }
      }
      routes.push([0, ...route, 0]);
    }
    return routes;
  }
  


  // Adaptive Memory Search process
  let memory = []; // Adaptive memory to store solutions
  let bestSolution = generateInitialSolution();
  let bestCost = calculateTotalCost(bestSolution);

  memory.push(bestSolution);

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Select a solution from memory
    const solution = memory[Math.floor(Math.random() * memory.length)];
    let newSolution = localSearch(solution);

    if (Math.random() < diversificationRate) {
      newSolution = diversification();
    }

    const newCost = calculateTotalCost(newSolution);

    // Update the best solution
    if (newCost < bestCost) {
      bestSolution = newSolution;
      bestCost = newCost;
    }

    // Update memory
    memory.push(newSolution);
    if (memory.length > memorySize) {
      memory.shift(); // Remove the oldest solution
    }
  }

  return {
    cost: bestCost,
    routes: bestSolution,
  };
}


// Part I: Taking Inputs and Choosing Algorithms
// A) Distance Matrix
function createMatrix() {
  let container = document.getElementById("matrixContainer");
  container.innerHTML = "";

  const numCities = parseInt(document.getElementById("numCities").value);
  const vehicleCapacity = parseInt(document.getElementById("vehicleCapacity").value);
  const numVehicles = parseInt(document.getElementById("numVehicles").value);
  // Validate inputs
  if (isNaN(numCities) || isNaN(vehicleCapacity) || isNaN(numVehicles) || numCities <= 0 || vehicleCapacity <= 0 || numVehicles <= 0) {
    container.innerHTML = "<p style='color:red; text-align:center;'>Error: Please enter valid positive numbers for number cities,vehicles and capacity of vehicle.</p>";
    return;
  }

  // Append Heading to Matrix
  const matrixHeading = document.createElement("p");
  matrixHeading.innerText = "Distance Matrix";
  matrixHeading.id = "matrixTitle";
  container.appendChild(matrixHeading);

  // Create the matrix table
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.margin = "0 auto";

  for (let i = 0; i < numCities; i++) {
    const row = document.createElement("tr");

    for (let j = 0; j < numCities; j++) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.className = "matrixInputStyle";
      cell.appendChild(input);
      cell.className = "matrixCellStyle";
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  // Append the matrix to the container
  container.appendChild(table);

  // Add a Submit button below the matrix
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit Distance Matrix";
  submitButton.style.marginTop = "20px";
  submitButton.id = "matrixButton";
  submitButton.onclick = function() {
    const rows = table.querySelectorAll("tr");
    const matrix = [];
    let hasError = false;

    // Clear any existing error message
    const existingError = document.getElementById("errorMessage");
    if (existingError) {
      existingError.remove();
    }

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td input");
      const rowData = [];
      cells.forEach((cell) => {
        const value = cell.value.trim();
        if (value === "" || isNaN(value) || parseFloat(value) < 0) {
          hasError = true;
          cell.style.borderColor = "red";
        } else {
          cell.style.borderColor = "";
          rowData.push(parseFloat(value));
        }
      });
      if (rowData.length > 0) matrix.push(rowData);
    });

    if (hasError) {
      const errorMessage = document.createElement("p");
      errorMessage.id = "errorMessage";
      errorMessage.style.color = "red";
      errorMessage.style.marginTop = "10px";
      errorMessage.textContent = "Error: Please fill all matrix elements with non-negative numbers.";
      container.appendChild(errorMessage);
      return;
    }
    else {
      createDemandArray();
    }
  };
  container.appendChild(submitButton);
}
// B) Demand Array
function createDemandArray() {
  const numCities = parseInt(document.getElementById("numCities").value);
  const container = document.getElementById("demandArrayContainer");
  container.innerHTML = "";  // Clear any previous content

  const demandArrayHeading = document.createElement("p");
  demandArrayHeading.innerText = "Demand Array";
  demandArrayHeading.id = "demandArrayTitle";
  container.appendChild(demandArrayHeading);

  // Create demand array table
  const demandArrayTable = document.createElement("table");
  demandArrayTable.style.borderCollapse = "collapse";
  demandArrayTable.style.margin = "0 auto";

  const demandRow = document.createElement("tr");
  for (let i = 0; i < numCities; i++) {
    const cell = document.createElement("td");
    const input = document.createElement("input");
    input.type = "number";
    input.className = "demandArrayInputStyle";
    cell.appendChild(input);
    cell.className = "demandArrayCellStyle";
    demandRow.appendChild(cell);
  }

  demandArrayTable.appendChild(demandRow);
  container.appendChild(demandArrayTable);

  // Add Submit button for Demand Array
  const demandSubmitButton = document.createElement("button");
  demandSubmitButton.innerText = "Submit Demand Array";
  demandSubmitButton.style.marginTop = "20px";
  demandSubmitButton.id = "demandArrayButton";
  demandSubmitButton.onclick = function() {
    const rows = demandArrayTable.querySelectorAll("tr");
    const demandArray = [];
    let hasError = false;

    // Clear any existing error message
    const existingError = document.getElementById("demandErrorMessage");
    if (existingError) {
      existingError.remove();
    }

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td input");
      cells.forEach((cell) => {
        const value = cell.value.trim();
        if (value === "" || isNaN(value) || parseFloat(value) < 0) {
          hasError = true;
          cell.style.borderColor = "red";
        } else {
          cell.style.borderColor = "";
          demandArray.push(parseFloat(value));
        }
      });
    });

    if (hasError) {
      const errorMessage = document.createElement("p");
      errorMessage.id = "demandErrorMessage";
      errorMessage.style.color = "red";
      errorMessage.style.marginTop = "10px";
      errorMessage.textContent = "Error: Please fill all demand elements with non-negative numbers.";
      container.appendChild(errorMessage);
      return;
    }
    else {
      if (document.getElementById("algorithmSelector").childElementCount === 0) {
        createAlgorithmSelector();
      }
    }
  };
  container.appendChild(demandSubmitButton);
}
// C) Algorithm choice
function createAlgorithmSelector() {
  const choiceContainer = document.getElementById("algorithmSelector");
  const algorithmTitle = document.createElement("p");
  algorithmTitle.innerText = "Select an algorithm to solve the problem:";
  choiceContainer.appendChild(algorithmTitle);

  const dropdown = document.createElement("select");
  dropdown.id = "algorithmSelect";
  dropdown.name = "algorithmSelector";
  dropdown.style.marginRight = "10px";

  const options = [
    { value: "0", text: "Branch and Bound" },
    { value: "1", text: "Dynamic Programming" },
    { value: "2", text: "Clarke and Wright" },
    { value: "3", text: "Sweep" },
    { value: "4", text: "Simulated Annealing" },
    { value: "5", text: "Tabu Search" },
    { value: "6", text: "Adaptive Memory Search" },
    { value: "7", text: "Genetic Search" },
    { value: "8", text: "Ant Colony Optimization" },
    { value: "9", text: "Neural Network" }
  ];
  options.forEach((optionData) => {
    const option = document.createElement("option");
    option.value = optionData.value;
    option.text = optionData.text;
    dropdown.appendChild(option);
  });

  choiceContainer.appendChild(dropdown);

  const confirmButton = document.createElement("button");
  confirmButton.innerText = "Run Algorithm";
  confirmButton.id = "algorithmButton";
  confirmButton.onclick = function() {
    Solver(); // Call the solver when the algorithm is selected
  };

  choiceContainer.appendChild(confirmButton);
}

//Variables in use : 
let N,q,k,c,d;
let selectedAlgorithm;
// let N = document.getElementById("numCities").value;
//   //Vehicle Capacity
//   let q = document.getElementById("vehicleCapacity").value;
//   //Number of Vehicles
//   let k = document.getElementById("numVehicles").value;
//   //Cost Matrix
//   let c = [];
//   //Demand Array
//   let d = [];

// Part II: Solving the Problem
function Solver() {
  console.log("Solver Started");
  selectedAlgorithm = document.getElementById("algorithmSelect").value;
  algorithmIndex=parseInt(selectedAlgorithm);
  const matrixRows = document.querySelectorAll("#matrixContainer table tr");
 // Number of City
  N = document.getElementById("numCities").value;
 // Vehicle Capacity
  q = document.getElementById("vehicleCapacity").value;
 // Number of Vehicles
   k = document.getElementById("numVehicles").value;
 // Cost Matrix
   c = [];
  matrixRows.forEach((row) => {
    const cells = row.querySelectorAll("td input");
    const rowData = [];
    cells.forEach((cell) => {
      rowData.push(parseFloat(cell.value));
    });
    c.push(rowData);
  });
  //Demand Array
 d = [];
  // Select all input elements in the row
  const demandArrayCells = document.querySelectorAll("#demandArrayContainer table tr td input");
  demandArrayCells.forEach(cell => {
    d.push(parseFloat(cell.value)); // Parse each input value and push to the array
  });
  console.log("Number of City->", N);
  cityCount = N;
  console.log("Vehicle Capacity->", q);
  console.log("Number of Vehicles->", k);
  console.log("Cost Matrix:");
  console.log(c);
  console.log("Demand Array:");
  console.log(d);
  //B)Run the selected algorithm
  let result;
  console.log("Algorithm Selected->", selectedAlgorithm);
  const numVehicles = N;
  const distanceMatrix = c;
  switch (selectedAlgorithm) {
    case "0":
      result = branchAndBound(N, k, q, c, d);
      break;
    case "1":
      result = dynamicProgrammingVRP(N, k, q, c, d);
      break;
    case "2":
      result = clarkeAndWright(N, k, q, c, d);
      break;
    case "3":
      result = sweepMethod(N, k, q, c, d);
      break;
    case "4":
      result = simulatedAnnealing(N, k, q, c, d);
      break;
    case "5":
      result = tabuSearch(N, k, q, c, d);
      break;
    case "6":
      result = adaptiveMemorySearch(N, k, q, c, d);
      break;
    case "7":
      result = geneticAlgorithmVRP(N, k, q, c, d);
      break;
    case "8":
      result = antColonyOptimization(N, k, q, c, d);
      break;
    case "9":
      result = neuralNetworkVRP(N, k, q, c, d);
      break;
    default:
      console.log("Error:Algorithm Switch Case is not working");
      result = { path: [], cost: 0 };
  }
  console.log();
  console.log("Start:");
  console.log(result);
  console.log("End");
  displayResults(result);
  //Show the result
  function displayResults(result) {
    const resultsContainer = document.getElementById("resultsContainer");

    // Format routes into a string representation
    const formattedRoutes = result.routes.map(route => route.join(' → ')).join('<br>');

    resultsContainer.innerHTML = `
      <h3>Results:</h3>
      <p><strong>Cost:</strong> ${result.cost}</p>
      <p><strong>Routes:</strong><br>${formattedRoutes}</p>
    `;
  }
  //Run the animation
  Animation(result.routes);
}

// Part III: Visualizing the Problem
function Animation(paths) {
  // A) Creating Canvas
  const canvasContainer = document.getElementById("animationContainer");
  canvasContainer.style.display = "flex";
  canvasContainer.innerHTML = ''; // Clear previous animations
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 600;
  canvas.style.border = "3px solid black";
  canvas.id = "animationBox";
  canvasContainer.appendChild(canvas);

  // Adjust for high-DPI displays
  const ctx = setupCanvas(canvas);

  // Corrected center calculation based on canvas dimensions
  const center = { x: canvas.width / 2 / window.devicePixelRatio, y: canvas.height / 2 / window.devicePixelRatio }; // Center of canvas
  const locations = [];

  // City 0 at the center
  locations.push(center);

  // Other cities in a circular pattern with unequal radii
  for (let i = 1; i < cityCount; i++) {
    const angle = (2 * Math.PI * i) / (cityCount - 1); // Evenly spaced angles
    const radius = Math.random() * 100 + 100; // Random radius between 100 and 300
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    locations.push({ x, y });
  }

  console.log("Locations:", locations);

  // Car Image
  const carImage = new Image();
  carImage.src = "icons8-car-48.png";

  // B) Setup Canvas for High-DPI Displays
  function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1; // Get the device pixel ratio
    const rect = canvas.getBoundingClientRect();

    // Scale canvas for high-DPI displays
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const context = canvas.getContext("2d");
    context.scale(dpr, dpr);

    // Set canvas CSS size to match container
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    return context;
  }
  // C) Draw Locations and Paths
  function drawLocations() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw all paths
    paths.forEach((path) => {
      for (let i = 0; i < path.length - 1; i++) {
        const start = locations[path[i]];
        const end = locations[path[i + 1]];

        // i) Draw line for each segment
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        // ii) Draw arrowhead
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const arrowSize = 12;
        const arrowX1 = end.x - arrowSize * Math.cos(angle - Math.PI / 6);
        const arrowY1 = end.y - arrowSize * Math.sin(angle - Math.PI / 6);
        const arrowX2 = end.x - arrowSize * Math.cos(angle + Math.PI / 6);
        const arrowY2 = end.y - arrowSize * Math.sin(angle + Math.PI / 6);

        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(arrowX1, arrowY1);
        ctx.lineTo(arrowX2, arrowY2);
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.fill();
      }
    });

    // Draw nodes
    locations.forEach((loc, i) => {
      // Node circle
      ctx.beginPath();
      ctx.arc(loc.x, loc.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "cyan";
      ctx.fill();
      ctx.closePath();

      // City label
      ctx.font = "16px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(i, loc.x, loc.y - 15); // Position label above node
    });
  }

  // D) Running Animation
  function animateVehicles() {
    const vehicles = paths.map(path => ({
      index: 0,
      x: locations[path[0]].x,
      y: locations[path[0]].y,
      path: path,
    }));

    function moveToNextPoint(vehicle) {
      if (vehicle.index >= vehicle.path.length - 1) return; // End of path

      const startPoint = locations[vehicle.path[vehicle.index]];
      const endPoint = locations[vehicle.path[vehicle.index + 1]];
      const dx = (endPoint.x - startPoint.x) / 50;
      const dy = (endPoint.y - startPoint.y) / 50;
      let steps = 0;

      function step() {
        if (steps < 50) {
          vehicle.x += dx;
          vehicle.y += dy;
          steps++;
          draw();
          requestAnimationFrame(step);
        } else {
          vehicle.index++;
          moveToNextPoint(vehicle); // Proceed to next segment
        }
      }
      step();
      //Trigger Bar Chart
      compareAlgorithm(timeTaken, costTaken);
    }

    function draw() {
      drawLocations();

      // Draw each vehicle
      vehicles.forEach(vehicle => {
        const startPoint = locations[vehicle.path[vehicle.index]];
        const endPoint = locations[vehicle.path[vehicle.index + 1]] || startPoint;
        const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);

        const carWidth = 40;
        const carHeight = 40;

        ctx.save();
        ctx.translate(vehicle.x, vehicle.y);
        ctx.rotate(angle);
        ctx.drawImage(carImage, -carWidth / 2, -carHeight / 2, carWidth, carHeight);
        ctx.restore();
      });
    }
    vehicles.forEach(vehicle => moveToNextPoint(vehicle));
  }

  // E) Initialize Animation
  carImage.onload = function() {
    drawLocations();

    // Add animation button
    const runAnimationButton = document.createElement("button");
    runAnimationButton.id = "animationButton";
    runAnimationButton.onclick = animateVehicles;
    runAnimationButton.innerText = "Run animation";
    canvasContainer.appendChild(runAnimationButton);
  };
}




//Part IV: Visualizing the Problem
function compareAlgorithm(timeTaken, costTaken) {
  // Button Creation
  const graphContainer = document.getElementById("graphContainer");
  let graphButton = document.getElementById("compareButton");

  // Prevent duplicate buttons
  if (!graphButton) {
    graphButton = document.createElement('button');
    graphButton.id = "compareButton";
    graphButton.innerText = "Compare it with other Algorithm";

    // Creating Graph on Click
    graphButton.onclick = function() {
      // Measure and store the time and cost for each algorithm
      let startTime, endTime;
  
      startTime = performance.now();
      costTaken[0] = branchAndBound(N, k, q, c, d).cost;
      endTime = performance.now();
      timeTaken[0] = endTime - startTime; // Time in milliseconds
  
      startTime = performance.now();
      costTaken[1] = dynamicProgrammingVRP(N, k, q, c, d).cost;
      endTime = performance.now();
      timeTaken[1] = endTime - startTime;
  
      startTime = performance.now();
      costTaken[2] = clarkeAndWright(N, k, q, c, d).cost;
      endTime = performance.now();
      timeTaken[2] = endTime - startTime;
  
      startTime = performance.now();
      costTaken[3] = sweepMethod(N, k, q, c, d).cost;
      endTime = performance.now();
      timeTaken[3] = endTime - startTime;
  
      startTime = performance.now();
      costTaken[4] = simulatedAnnealing(N, k, q, c, d).cost;
      endTime = performance.now();
      timeTaken[4] = endTime - startTime;
  
      startTime = performance.now();
      costTaken[5] = tabuSearch(N, k, q, c, d).cost;
      endTime = performance.now();
      timeTaken[5] = endTime - startTime;
  
      startTime = performance.now();
      costTaken[6] = adaptiveMemorySearch(N, k, q, c, d).cost;
      endTime = performance.now();
      timeTaken[6] = endTime - startTime;
  
     // Uncomment and implement the following if required
      startTime = performance.now();
      costTaken[7] = geneticAlgorithmVRP(N, k, q, c, d).cost;
      endTime = performance.now();
      timeTaken[7] = endTime - startTime;
  
      startTime = performance.now();
      costTaken[8] = antColonyOptimization(N, k, q, c, d).cost;
      endTime = performance.now();
      timeTaken[8] = endTime - startTime;
  
      // Uncomment and implement the following if required
      // startTime = performance.now();
      // costTaken[9] = neuralNetworkVRP(N, k, q, c, d).cost;
      // endTime = performance.now();
      // timeTaken[9] = endTime - startTime;
  
      // Generate the graphs
      generateTimeTakenGraph(timeTaken);
      generateCostGraph(costTaken);
  };

    graphContainer.appendChild(graphButton);
  }
}

// Part I) Time Taken Generator
function generateTimeTakenGraph(timeTaken) {
  // Data for the chart
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Time Taken',
        data: timeTaken,
        borderColor: 'rgba(255, 99, 132, 1)', // Red color
        backgroundColor: timeTaken.map((_, index) =>
          index === algorithmIndex
            ? 'green' // Green Selected
            : 'red' // Other
        ),
      },
    ]
  };

  // Config File
  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: false,
      scales: {
        x: {
          grid: { drawOnChartArea: false }
        },
        y: {
          grid: { drawOnChartArea: false }
        },
      },
      plugins: {
        legend: {
          //position: 'top'
          display: false
        },
        title: {
          display: true,
          text: 'Time Taken of Different Algorithms'
        }
      }
    },
  };

  // Create the graph
  const canvasId = "timeTakenGraph";
  let canvas = document.getElementById(canvasId);
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = canvasId;
    document.getElementById("graphContainer").appendChild(canvas);
  }
  // Explicitly set canvas dimensions
  canvas.style.width = "850px"; // Set width
  canvas.style.height = "400px"; // Set height
  new Chart(canvas, config);
}
// Part II) Cost Generator
function generateCostGraph(costTaken) {
  // Data for the chart
  const data = {
    labels: labels,
    datasets: [
      {
        //label: 'Optimal Cost',
        data: costTaken,
        borderColor: 'rgba(255, 99, 132, 1)', // Red color
        backgroundColor: costTaken.map((_, index) =>
          index === algorithmIndex
            ? 'green' // Green Selected
            : 'red' // Other
        ),
      },
    ]
  };

  // Config File
  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: false,
      scales: {
        x: {
          grid: { drawOnChartArea: false }
        },
        y: {
          grid: { drawOnChartArea: false }
        },
      },
      plugins: {
        legend: {
          //position: 'top'
          display: false
        },
        title: {
          display: true,
          text: 'Optimal Cost of Different Algorithms'
        }
      }
    },
  };

  // Create the graph
  const canvasId = "costTakenGraph";
  let canvas = document.getElementById(canvasId);
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = canvasId;
    document.getElementById("graphContainer").appendChild(canvas);
  }
  // Explicitly set canvas dimensions
  canvas.style.width = "850px"; // Set width
  canvas.style.height = "400px"; // Set height
  new Chart(canvas, config);
}