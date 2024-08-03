import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register components with ChartJS
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const OrderStatusPieChart = ({ data }) => {
  const chartData = {
    labels: ['Cancelled Orders', 'Shipped Orders', 'Delivered Orders'],
    datasets: [{
      data: [data.cancelledOrdersCount, data.shippedOrdersCount, data.deliveredOrdersCount],
      backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
    }],
  };

  return (
    <div className="w-48 h-48 mx-auto"> {/* Tailwind classes for sizing */}
      <Pie data={chartData} />
    </div>
  );
};

export default OrderStatusPieChart;
