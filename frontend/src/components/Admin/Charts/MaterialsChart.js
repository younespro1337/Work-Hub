import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Paper, Typography } from '@mui/material';

const MaterialsChart = ({ materials }) => {
  const materialsBarChartData = {
    labels: materials.map(material => material.name),
    datasets: [
      {
        label: 'Stock',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: materials.map(material => material.stock),
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value;
            }
          },
        },
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
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
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <Paper elevation={3} style={{ padding: '15px', margin: '1%', textAlign: 'center', borderRadius: '10px', height: '400px', overflow: 'auto' }}>
      <Typography variant="h6">Materials Stock Chart</Typography>
      <Bar data={materialsBarChartData} options={options} />
    </Paper>
  );
};

export default MaterialsChart;
