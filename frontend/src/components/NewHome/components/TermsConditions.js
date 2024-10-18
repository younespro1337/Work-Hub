import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import React, { useState } from 'react';
import CustomSnackbar from '../../Layouts/Snackbar';

const TermsConditions = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("Hello, I'm the Terms & Conditions page.");
  
  // Open the snackbar when the component mounts (for testing purposes)
  React.useEffect(() => {
    setSnackbarOpen(true); // This is just to show the snackbar automatically
  }, []);
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant='h2'>Terms & Conditions</Typography>
      
      {/* CustomSnackbar with required props */}
      <CustomSnackbar
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
        autoHideDuration={5000}  // Optional, default is 5000ms
      />
    </Container>
  );
};

export default TermsConditions;
