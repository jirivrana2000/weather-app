export interface WeatherForecast {
  dt: number
  main: {
    temp: number
    temp_min: number
    temp_max: number
  }
  weather: {
    description: string
    icon: string
  }[]
}