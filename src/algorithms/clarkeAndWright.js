export default function clarkeAndWright(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  const depot = 0;
  const routes = Array.from({ length: numCities - 1 }, (_, i) => [i + 1]);
  const routeDemands = [...demandArray];
  const savingsList = [];

  for (let i = 1; i < numCities; i++) {
    for (let j = i + 1; j < numCities; j++) {
      const saving = costMatrix[depot][i] + costMatrix[depot][j] - costMatrix[i][j];
      savingsList.push({ i, j, saving });
    }
  }
  savingsList.sort((a, b) => b.saving - a.saving);

  const routeMap = {};
  for (let i = 1; i < numCities; i++) {
    routeMap[i] = i - 1;
  }

  for (const { i, j } of savingsList) {
    const routeI = routeMap[i];
    const routeJ = routeMap[j];
    if (routeI === routeJ) continue;
    const route1 = routes[routeI];
    const route2 = routes[routeJ];
    if (
      route1[route1.length - 1] === i &&
      route2[0] === j &&
      route1 !== route2
    ) {
      const totalDemand = route1.reduce((sum, city) => sum + demandArray[city], 0) +
        route2.reduce((sum, city) => sum + demandArray[city], 0);
      if (totalDemand <= vehicleCapacity) {
        routes[routeI] = route1.concat(route2);
        routes[routeJ] = [];
        for (const city of route2) {
          routeMap[city] = routeI;
        }
      }
    }
  }

  const finalRoutes = routes.filter(route => route.length > 0).map(route => [depot, ...route, depot]);
  const cost = finalRoutes.reduce((sum, route) => {
    for (let i = 0; i < route.length - 1; i++) {
      sum += costMatrix[route[i]][route[i + 1]];
    }
    return sum;
  }, 0);

  return { cost, routes: finalRoutes };
} 