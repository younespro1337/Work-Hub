import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const UsersChart = ({ materials }) => {
  const usersDoughnutChartData = {
    labels: materials.map(material => material.name),
    datasets: [
      {
        data: materials.map(material => material.users.length),
        backgroundColor: ['rgba(255, 159, 64, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 205, 86, 0.6)'],
        borderColor: ['rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 205, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        position: 'average',
        align: 'center',
        mode: 'index',
      },
    },
  };

  return (
    <div className="Chart">
      <h3>Users Chart</h3>
      <Doughnut data={usersDoughnutChartData} options={options} />
    </div>
  );
};

export default UsersChart;
