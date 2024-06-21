import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Paper, Typography } from '@mui/material';

const JobsChart = ({ jobs }) => {
  const jobsBarChartData = {
    labels: jobs.map(job => job.title),
    datasets: [
      {
        label: 'Number of Applicants',
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        data: jobs.map(job => job.applicants.length),
      },
      {
        label: 'Number of Positions',
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        data: jobs.map(job => job.counter),
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
      },
    },
  };

  return (
    <Paper elevation={3} style={{ padding: '15px', margin: '1%', textAlign: 'center', borderRadius: '10px', height: '400px', overflow:'auto'}}>
      <Typography variant="h6">Jobs Chart</Typography>
      <Bar data={jobsBarChartData} options={options} />
    </Paper>
  );
};

export default JobsChart;
