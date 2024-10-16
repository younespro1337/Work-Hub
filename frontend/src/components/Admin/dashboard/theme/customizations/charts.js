import { axisClasses, legendClasses, chartsGridClasses } from '@mui/x-charts';

/* eslint-disable import/prefer-default-export */
export const chartsCustomizations = {
  MuiChartsAxis: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${axisClasses.line}`]: {
          stroke: theme.palette.grey[300],  // Use MUI's palette instead
        },
        [`& .${axisClasses.tick}`]: { stroke: theme.palette.grey[300] },
        [`& .${axisClasses.tickLabel}`]: {
          fill: theme.palette.grey[500],
          fontWeight: 500,
        },
        ...theme.applyStyles('dark', {
          [`& .${axisClasses.line}`]: {
            stroke: theme.palette.grey[700],
          },
          [`& .${axisClasses.tick}`]: { stroke: theme.palette.grey[700] },
          [`& .${axisClasses.tickLabel}`]: {
            fill: theme.palette.grey[300],
            fontWeight: 500,
          },
        }),
      }),
    },
  },
  MuiChartsTooltip: {
    styleOverrides: {
      mark: ({ theme }) => ({
        ry: 6,
        boxShadow: 'none',
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
      }),
      table: ({ theme }) => ({
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        background: 'hsl(0, 0%, 100%)',
        ...theme.applyStyles('dark', {
          background: theme.palette.grey[900],
        }),
      }),
    },
  },
  MuiChartsLegend: {
    styleOverrides: {
      root: {
        [`& .${legendClasses.mark}`]: {
          ry: 6,
        },
      },
    },
  },
  MuiChartsGrid: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${chartsGridClasses.line}`]: {
          stroke: theme.palette.grey[200],
          strokeDasharray: '4 2',
          strokeWidth: 0.8,
        },
        ...theme.applyStyles('dark', {
          [`& .${chartsGridClasses.line}`]: {
            stroke: theme.palette.grey[700],
            strokeDasharray: '4 2',
            strokeWidth: 0.8,
          },
        }),
      }),
    },
  },
};
