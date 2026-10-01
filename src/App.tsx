import { useState } from 'react'
import type { City } from './models/city'
import type { WeatherForecast } from './models/weather'
import type { SelectedLocation } from './models/location'
import { getWeatherForecast } from './services/weatherService'
import CitySearch from './components/CitySearch/CitySearch'
import Forecast from './components/Forecast/Forecast'
import './App.css'

function App() {
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null)
  const [forecast, setForecast] = useState<WeatherForecast[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCitySelect = async (city: City) => {
    const location: SelectedLocation = {
      name: city.name,
      lat: city.coord.lat,
      lon: city.coord.lon,
    }

    setSelectedLocation(location)
    setForecast([])
    setError(null)
    setIsLoading(true)

    try {
      const forecast = await getWeatherForecast(
        location.lat,
        location.lon,
      )

      setForecast(forecast)
    } catch (error) {
      console.error(error)
      setError('Nepodařilo se načíst předpověď počasí.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: SelectedLocation = {
          name: 'Aktuální poloha',
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }

        setSelectedLocation(location)
        setForecast([])
        setError(null)
        setIsLoading(true)

        try {
          const forecast = await getWeatherForecast(
            location.lat,
            location.lon,
          )

          setForecast(forecast)
        } catch (error) {
          console.error(error)
          setError('Nepodařilo se načíst předpověď počasí.')
        } finally {
          setIsLoading(false)
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Přístup k poloze byl zamítnut.')
            break

          case error.POSITION_UNAVAILABLE:
            setError('Aktuální poloha není dostupná.')
            break

          case error.TIMEOUT:
            setError('Získání polohy trvalo příliš dlouho.')
            break

          default:
            setError('Nepodařilo se získat vaši polohu.')
        }
      },
    )
  }

  return (
    <main className="app">
      <h1>Weather App</h1>
      <p>Předpověď počasí na následujících 5 dní</p>

      <CitySearch
        onCitySelect={handleCitySelect}
        onUseLocation={handleUseLocation}
        isLoading={isLoading}
      />

      {selectedLocation && (
        <h2 className="selectedLocation">
          Předpověď pro: 📍{selectedLocation.name}
        </h2>
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
