export default function simulatedAnnealing(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  const depot = 0;
  const initialTemperature = 1000;
  const coolingRate = 0.99;
  const minTemperature = 0.1;

  function calculateCost(route, matrix) {
    let cost = 0;
    for (let i = 0; i < route.length - 1; i++) {
      cost += matrix[route[i]][route[i + 1]];
    }
    return cost;
  }

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

  function calculateTotalCost(routes) {
    return routes.reduce((sum, route) => sum + calculateCost(route, costMatrix), 0);
  }

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
  return {
    cost: bestCost,
    routes: bestSolution,
  };
} 