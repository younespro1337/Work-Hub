import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Paper, Typography } from '@mui/material';

const MaterialRequesterChart = ({ materialRequester }) => {
  // Count the number of requests made by each requester
  const requesterCounts = materialRequester.reduce((acc, requester) => {
    acc[requester.requesterName] = (acc[requester.requesterName] || 0) + 1;
    return acc;
  }, {});

  const materialRequesterPieChartData = {
    labels: Object.keys(requesterCounts),
    datasets: [
      {
        data: Object.values(requesterCounts),
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 205, 86, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 205, 86, 1)'],
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
        mode: 'index',
        callbacks: {
          label: function(context) {
            let label = `${context.label}: ${context.parsed}`;
            if (context.datasetIndex === 0) {
              label += ` (${requesterCounts[context.label]} requests)`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <Paper elevation={3} style={{ padding: '15px', margin: '1%', textAlign: 'center', borderRadius: '10px', maxHeight: '600px', overflow: 'auto' }}>
      <Typography variant="h6">Material Requester Chart</Typography>
      <Pie data={materialRequesterPieChartData} options={options} />
    </Paper>
  );
};

export default MaterialRequesterChart;
