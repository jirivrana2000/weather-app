import {
  CategoryScale,
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions,
  type ScriptableLineSegmentContext,
  type TooltipItem,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { WeatherForecast } from '../../models/weather'

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
)

interface TemperatureChartProps {
  items: WeatherForecast[]
}

const getTemperatureColor = (temperature: number): string => {
  if (temperature <= 0) {
    const intensity = Math.min(Math.abs(temperature) / 20, 1)
    const blue = Math.round(255 * (1 - intensity))
    return `rgb(${blue}, ${blue}, 255)`
  }

  const intensity = Math.min(temperature / 20, 1)
  const blue = Math.round(255 * (1 - intensity))

  return `rgb(255, ${blue}, ${blue})`
}

function TemperatureChart({ items }: TemperatureChartProps) {

  const temperatures = items.map((item) => item.main.temp)

  const data = {
    labels: items.map((item) =>
      new Intl.DateTimeFormat(navigator.language, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(item.dt * 1000)),
    ),
    datasets: [
      {
        label: 'Teplota',
        data: temperatures,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: temperatures.map(
          getTemperatureColor,
        ),
        segment: {
          borderColor: (context: ScriptableLineSegmentContext) => {
            const y1 = context.p0.parsed.y
            const y2 = context.p1.parsed.y

            if (y1 === null || y2 === null) {
              return '#999'
            }

            const temperature = (y1 + y2) / 2

            return getTemperatureColor(temperature)
          },
        },
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          precision: 0,
          callback: (value: string | number) => `${value} °C`,
        },
      },
      x: {
        display: false,
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) =>
            `${Math.round(context.parsed.y ?? 0)} °C`,
        },
      },
    },
    layout: {
      padding: {
        top: 0,
        right: 55,
        bottom: 30,
        left: 12,
      },
    },
  }

  const pointWidth = 110
  const minChartWidth = 330

  const chartWidth = Math.max(
    items.length * pointWidth,
    minChartWidth,
  )

  return (
    <div >
      <div  style={{ width: `${chartWidth}px` }}>
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

export default TemperatureChart