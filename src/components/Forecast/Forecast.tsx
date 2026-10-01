import { useState } from 'react'
import type { WeatherForecast } from '../../models/weather'
import { groupForecastByDay } from '../../utils/forecastUtils'
import styles from './Forecast.module.scss'
import TemperatureChart from './TemperatureChart'
import { formatDate, formatTime } from '../../utils/formatUtils'

interface ForecastProps {
  forecast: WeatherForecast[]
}

function Forecast({ forecast }: ForecastProps) {
  const dailyForecast = groupForecastByDay(forecast)

  const [openDays, setOpenDays] = useState<Set<string>>(
    new Set([dailyForecast[0]?.date.toISOString()]),
  )

  const toggleDay = (dateKey: string) => {
  setOpenDays((current) => {
    const next = new Set(current)

    if (next.has(dateKey)) {
      next.delete(dateKey)
    } else {
      next.add(dateKey)
    }

    return next
  })
}

  return (
        <section className={styles.forecast}>
      <h2>Předpověď počasí</h2>

      <div className={styles.days}>
        {dailyForecast.map((day) => (
          <div className={styles.day} key={day.date.toISOString()}>
            <button
              type="button"
              className={styles.date}
              onClick={() => toggleDay(day.date.toISOString())}
            >
              {formatDate(day.date)}
            </button>
            {openDays.has(day.date.toISOString()) && (
              <div className={styles.scrollArea}>
                <table>
                  <tbody>
                    <tr>
                      {day.items.map((item) => (
                        <th key={item.dt} scope="col">
                          {formatTime(item.dt)}
                        </th>
                      ))}
                    </tr>

                    <tr>
                      {day.items.map((item: WeatherForecast) => {
                        const weather = item.weather[0]

                        return (
                          <td key={item.dt}>
                            <strong>{Math.round(item.main.temp)} °C</strong>

                            {weather && (
                              <>
                                <img
                                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                                  alt={weather.description}
                                />

                                <span>{weather.description}</span>
                              </>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
                <TemperatureChart items={day.items} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Forecast