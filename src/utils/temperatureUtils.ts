export const getTemperatureColor = (temperature: number): string => {
  if (temperature <= 0) {
    const intensity = Math.min(Math.abs(temperature) / 20, 1)
    const blue = Math.round(255 * (1 - intensity))
    return `rgb(${blue}, ${blue}, 255)`
  }

  const intensity = Math.min(temperature / 20, 1)
  const blue = Math.round(255 * (1 - intensity))

  return `rgb(255, ${blue}, ${blue})`
}