import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const CustomSnackbar = ({ open, handleClose, severity, message, autoHideDuration }) => {
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration || 5000} onClose={handleClose}>
      <Alert severity={severity || "success"} onClose={handleClose}>
        {message || "Data sent successfully!"}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
