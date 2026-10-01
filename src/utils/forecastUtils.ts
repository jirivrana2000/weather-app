import type { WeatherForecast } from '../models/weather'

export interface DailyForecast {
  date: Date
  items: WeatherForecast[]
}

export const groupForecastByDay = (
  forecast: WeatherForecast[],
): DailyForecast[] => {
  const groups = new Map<string, WeatherForecast[]>()

  forecast.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const dateKey = date.toLocaleDateString(navigator.language)

    const existing = groups.get(dateKey) ?? []

    groups.set(dateKey, [...existing, item])
  })

  return Array.from(groups.entries()).map(([, items]) => ({
    date: new Date(items[0].dt * 1000),
    items,
  }))
}