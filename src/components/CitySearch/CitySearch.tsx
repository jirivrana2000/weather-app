import { useEffect, useState } from 'react'
import type { City } from '../../models/city'
import styles from './CitySearch.module.scss'

function CitySearch() {
  const [query, setQuery] = useState('')
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  useEffect(() => {
    fetch('/city.list.json')
      .then((response) => response.json())
      .then((data: City[]) => setCities(data))
  }, [])

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(query.toLowerCase()),
  )

  const handleCitySelect = (city: City) => {
    setSelectedCity(city)
    setQuery(city.name)
  }

  return (
    <div className={styles.container}>
      <label htmlFor="city-search">Město</label>

      <input
        id="city-search"
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Začněte psát název města..."
      />

      {query && filteredCities.length > 0 && (
        <ul className={styles.suggestions}>
          {filteredCities.map((city) => (
            <li key={city.id}>
              <button
                type="button"
                onClick={() => handleCitySelect(city)}
              >
                {city.name}, {city.country}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedCity && (
        <p>
          Vybrané město: {selectedCity.name}, {selectedCity.country}, {selectedCity.coord.lon}, {selectedCity.coord.lat},
        </p>
      )}
    </div>
  )
}

export default CitySearch