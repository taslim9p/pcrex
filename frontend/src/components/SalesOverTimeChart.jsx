import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesOverTimeChart = ({ salesData }) => {
  if (!salesData || salesData.length === 0) {
    return <p>No sales data available</p>;
  }

  // Prepare data for the chart
  const data = {
    labels: salesData.map((item) => item.date),
    datasets: [
      {
        label: 'Sales',
        data: salesData.map((item) => item.sales),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Week',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Sales ($)',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default SalesOverTimeChart;
