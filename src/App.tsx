import { useState } from 'react'
import type { City } from './models/city'
import type { WeatherForecast } from './models/weather'
import { getWeatherForecast } from './services/weatherService'
import CitySearch from './components/CitySearch/CitySearch'
import Forecast from './components/Forecast/Forecast'
import './App.css'

function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [forecast, setForecast] = useState<WeatherForecast[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCitySelect = async (city: City) => {
    setSelectedCity(city)
    setForecast([])
    setError(null)
    setIsLoading(true)

    try {
      const forecast = await getWeatherForecast(
        city.coord.lat,
        city.coord.lon,
      )

      setForecast(forecast)
    } catch (error) {
      console.error(error)
      setError('Nepodařilo se načíst předpověď počasí.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="app">
      <h1>Weather App</h1>
      <p>Předpověď počasí na následujících 5 dní</p>

      <CitySearch onCitySelect={handleCitySelect} />

      {selectedCity && (
        <p>
          Vybrané město: {selectedCity.name}, {selectedCity.country}
        </p>
      )}

      {isLoading && <p>Načítám předpověď...</p>}

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {forecast.length > 0 && <Forecast forecast={forecast} />}
    </main>
  )
}

export default App
