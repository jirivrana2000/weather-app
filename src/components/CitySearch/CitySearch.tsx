import { useEffect, useRef, useState } from 'react'
import type { City } from '../../models/city'
import styles from './CitySearch.module.scss'

interface CitySearchProps {
  onCitySelect: (city: City) => void
}

function CitySearch({ onCitySelect }: CitySearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<City[]>([])

  const workerRef = useRef<Worker | null>(null)
  const skipSearch = useRef(false)

  useEffect(() => {
    const worker = new Worker(
      new URL('../../workers/citySearch.worker.ts', import.meta.url),
      {
        type: 'module',
      },
    )

    workerRef.current = worker

    worker.onmessage = (event: MessageEvent<City[]>) => {
       setSuggestions(event.data)
    }

    worker.postMessage({
      type: 'load',
    })

    return () => {
      worker.terminate()
    }
  }, [])

  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false
      return
    }

    const timeoutId = window.setTimeout(() => {
      workerRef.current?.postMessage({
        type: 'search',
        query,
      })
    }, 250)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [query])

    const handleCitySelect = (city: City) => {
      skipSearch.current = true
      setQuery(city.name)
      setSuggestions([])
      onCitySelect(city)
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

      {query && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((city) => (
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

    </div>
  )
}

export default CitySearch