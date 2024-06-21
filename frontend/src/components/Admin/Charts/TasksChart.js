import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Paper, Typography } from '@mui/material';
import { formatDate } from '../../../utils/DateFormat';

const TasksChart = ({ tasks }) => {
  const getStatusValue = status => {
    switch (status) {
      case 'pending':
        return 1;
      case 'in progress':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const taskLabels = tasks.map(task => task.workerName || 'Unknown Tasker');

  const tasksBarChartData = {
    labels: taskLabels,
    datasets: [
      {
        label: 'Pending',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: tasks.map(task => task.status === 'pending' ? 1 : 0),
      },
      {
        label: 'In Progress',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        data: tasks.map(task => task.status === 'in progress' ? 1 : 0),
      },
      {
        label: 'Completed',
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        data: tasks.map(task => task.status === 'completed' ? 1 : 0),
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
          label: context => {
            const task = tasks[context?.dataIndex];
            const formattedDate = formatDate(task?.createdAt);
            return `Task: ${task?.title}   Status: ${task?.status}   Date: ${formattedDate}`;
          },
        },
      },
    },
  };

  return (
    <Paper elevation={3} style={{ padding: '15px', margin: '1%', textAlign: 'center', borderRadius: '10px', height: '400px' , overflow:'auto'}}>
      <Typography variant="h6">Tasks Chart</Typography>
      <Bar data={tasksBarChartData} options={options} />
    </Paper>
  );
};

export default TasksChart;
