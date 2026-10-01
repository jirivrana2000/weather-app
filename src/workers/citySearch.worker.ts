import type { City } from '../models/city'

let cities: City[] = []
let isLoaded = false
let pendingQuery: string | null = null

self.onmessage = async (event: MessageEvent) => {
  const { type, query } = event.data

  if (type === 'load') {
    const response = await fetch('/city.list.json')

    cities = await response.json()
    isLoaded = true

    if (pendingQuery !== null) {
      searchCities(pendingQuery)
      pendingQuery = null
    }

    return
  }

  if (type === 'search') {
    if (!isLoaded) {
      pendingQuery = query
      return
    }

    searchCities(query)
  }
}

const searchCities = (query: string) => {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    self.postMessage([])
    return
  }

  const results = cities
    .filter((city) =>
      city.name.toLowerCase().includes(normalizedQuery),
    )
    .slice(0, 10)

  self.postMessage(results)
}