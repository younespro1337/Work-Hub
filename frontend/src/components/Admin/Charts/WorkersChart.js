import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Paper, Button, ListItem, List, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';

const WorkersChart = ({ workers }) => {
  // Average Salary by Gender
  const avgSalaryByGenderData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Average Salary',
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
        data: [
          workers.reduce((acc, curr) => (curr.gender === 'male' ? acc + curr.salary : acc), 0) /
            workers.filter(worker => worker.gender === 'male').length,
          workers.reduce((acc, curr) => (curr.gender === 'female' ? acc + curr.salary : acc), 0) /
            workers.filter(worker => worker.gender === 'female').length,
        ],
      },
    ],
  };

  // Total Number of Employees by Position
  const positionCounts = workers.reduce((acc, curr) => {
    acc[curr.position] = (acc[curr.position] || 0) + 1;
    return acc;
  }, {});

  const positionChartData = {
    labels: Object.keys(positionCounts),
    datasets: [
      {
        label: 'Total Employees',
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        data: Object.values(positionCounts),
      },
    ],
  };

  // Number of Employees who Receive Updates
  const receiveUpdatesData = {
    labels: ['Receive Updates', 'Do Not Receive Updates'],
    datasets: [
      {
        data: [
          workers.filter(worker => worker.receiveUpdates).length,
          workers.filter(worker => !worker.receiveUpdates).length,
        ],
        backgroundColor: ['rgba(255, 159, 64, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
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
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', position: 'relative', zIndex: 1 }}>
      <Paper elevation={3} style={{ boxShadow: '12px -1px 35px rgba(0, 0, 0, 0.1)', padding: '15px', margin: '1%', textAlign: 'center', borderRadius: '10px', width: '100%', height: '300px' }}>
        <h3>Average Salary by Gender</h3>
        <Bar data={avgSalaryByGenderData} options={options} />
      </Paper>

      <Paper elevation={3} style={{ boxShadow: '12px -1px 35px rgba(0, 0, 0, 0.1)', padding: '15px', margin: '1%', textAlign: 'center', borderRadius: '10px', width: '100%', height: '300px' }}>
        <h3>Total Number of Employees by Position</h3>
        <Bar data={positionChartData} options={options} />
      </Paper>

      <Paper elevation={3} style={{ boxShadow: '12px -1px 35px rgba(0, 0, 0, 0.1)', padding: '15px', margin: '1%', textAlign: 'center', borderRadius: '10px', width: '100%', height: '300px' }}>
        <h3>Number of Employees who Receive Updates</h3>
        <Doughnut data={receiveUpdatesData} options={options} />
      </Paper>
    </div>
  );
};

export default WorkersChart;
