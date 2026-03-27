import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ResultChart = ({ wpmData, errorData }) => {
  // If no props, try to get from session storage (mocked for now as we don't save timeline yet)
  const displayWpm = wpmData || [40, 45, 42, 48, 52, 50, 55, 58, 60, 62];
  const displayErrors = errorData || [0, 1, 0, 0, 2, 0, 1, 0, 0, 0];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { family: 'Plus Jakarta Sans', size: 12 },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        padding: 12,
        borderRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(200, 200, 200, 0.05)' },
        ticks: { 
          color: '#888',
          font: { family: 'Plus Jakarta Sans', size: 10 }
        },
      },
      x: {
        grid: { display: false },
        ticks: { 
          color: '#888',
          font: { family: 'Plus Jakarta Sans', size: 10 }
        },
      },
    },
  };

  const labels = displayWpm.map((_, i) => `${i + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: 'WPM',
        data: displayWpm,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      }
    ],
  };

  return (
    <div className="w-full h-full min-h-[200px]">
      <Line options={options} data={data} />
    </div>
  );
};

export default ResultChart;
