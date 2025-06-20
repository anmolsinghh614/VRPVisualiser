export default function sweepMethod(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  if (numCities < 2) return { cost: 0, routes: [] };
  const depot = 0;
  // Assign random angles to cities (for demo, as coordinates are not provided)
  const angles = Array.from({ length: numCities }, (_, i) => i === 0 ? 0 : Math.random() * 2 * Math.PI);
  const cityOrder = Array.from({ length: numCities - 1 }, (_, i) => i + 1)
    .sort((a, b) => angles[a] - angles[b]);
  const routes = [];
  let currentRoute = [];
  let currentDemand = 0;
  for (const city of cityOrder) {
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
  const cost = routes.reduce((sum, route) => {
    for (let i = 0; i < route.length - 1; i++) {
      sum += costMatrix[route[i]][route[i + 1]];
    }
    return sum;
  }, 0);
  return { cost, routes };
} 