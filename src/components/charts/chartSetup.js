import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip)

ChartJS.defaults.font.family = 'IBM Plex Sans, sans-serif'
ChartJS.defaults.color = '#64748b'
ChartJS.defaults.plugins.legend.labels.boxWidth = 12
