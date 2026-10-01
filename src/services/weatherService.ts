import type { WeatherForecast } from '../models/weather'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

export const getWeatherForecast = async (
  lat: number,
  lon: number,
): Promise<WeatherForecast[]> => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=cz`,
  )

  if (!response.ok) {
    throw new Error('Nepodařilo se načíst předpověď počasí.')
  }

  const data = await response.json()

  return data.list as WeatherForecast[]
}