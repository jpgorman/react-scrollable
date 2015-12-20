function positionPlanet(radians, radius, planetWidth) {
  const left = radius + radius * Math.cos(radians) - planetWidth / 2
  const top = radius + radius * Math.sin(radians) - planetWidth / 2
  return {
    top,
    left,
  }
}

export function makePlanet(rotation, orbitWidth, planetWidth, index = 0, numberOfPlanets = 1) {
  let radians = 2 * Math.PI / numberOfPlanets * index
  radians = radians + rotation
  return positionPlanet(radians, orbitWidth / 2, planetWidth)
}