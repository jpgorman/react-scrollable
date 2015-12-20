function positionOnCircumference(radians, radius, itemWidth) {
  const left = radius + radius * Math.cos(radians) - itemWidth / 2
  const top = radius + radius * Math.sin(radians) - itemWidth / 2
  return {
    top,
    left,
  }
}

const circumference = 2 * Math.PI

export function circumferenceCoords(rotation, diameter, itemWidth, index = 0, numberOfItems = 1) {
  const radians = circumference / numberOfItems * index
  return positionOnCircumference(radians + rotation, diameter / 2, itemWidth)
}