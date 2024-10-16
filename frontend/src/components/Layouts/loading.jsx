import React from "react";
import { CircularProgress } from "@mui/material";

function GradientCircularProgress() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', 
        width: '100vw',
        position: 'fixed', 
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', 
        zIndex: 1300, 
      }}
    >
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }}
        size={60} 
      />
    </div>
  );
}

export default GradientCircularProgress;
