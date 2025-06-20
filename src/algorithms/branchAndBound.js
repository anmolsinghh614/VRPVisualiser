export default function branchAndBound(numCities, numVehicles, vehicleCapacity, costMatrix, demandArray) {
  const bestSolution = { cost: Infinity, routes: [] };

  function isFeasible(route, demand) {
    const totalDemand = route.reduce((sum, city) => sum + demand[city], 0);
    return totalDemand <= vehicleCapacity;
  }

  function solve(currentRoutes, remainingCities, currentCost) {
    if (remainingCities.length === 0) {
      const totalCost = currentCost + currentRoutes.reduce((sum, route) => {
        if (route.length > 0) {
          const lastCity = route[route.length - 1];
          sum += costMatrix[lastCity][0];
        }
        return sum;
      }, 0);
      if (totalCost < bestSolution.cost) {
        bestSolution.cost = totalCost;
        bestSolution.routes = currentRoutes.map(route => [0, ...route, 0]);
      }
      return;
    }
    const currentVehicle = currentRoutes.length - 1;
    if (currentVehicle >= 0) {
      for (let i = 0; i < remainingCities.length; i++) {
        const city = remainingCities[i];
        const newRoute = [...currentRoutes[currentVehicle], city];
        const lastCity = currentRoutes[currentVehicle].slice(-1)[0] || 0;
        const newCost = currentCost + costMatrix[lastCity][city];
        if (isFeasible(newRoute, demandArray)) {
          const newRemainingCities = remainingCities.filter((_, idx) => idx !== i);
          const updatedRoutes = [...currentRoutes];
          updatedRoutes[currentVehicle] = newRoute;
          solve(updatedRoutes, newRemainingCities, newCost);
        }
      }
    }
    if (currentRoutes.length < numVehicles) {
      const newRemainingCities = [...remainingCities];
      const newRoutes = [...currentRoutes, []];
      const firstCity = remainingCities[0];
      if (firstCity !== undefined) {
        newRoutes[newRoutes.length - 1].push(firstCity);
        solve(newRoutes, newRemainingCities.slice(1), currentCost + costMatrix[0][firstCity]);
      }
    }
  }

  solve(
    [[]],
    Array.from({ length: numCities - 1 }, (_, i) => i + 1),
    0
  );

  return bestSolution;
} 