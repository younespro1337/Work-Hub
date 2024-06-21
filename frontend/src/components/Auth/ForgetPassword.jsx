import React, { useState, useEffect } from 'react';
import { TextField, Button, Snackbar, Alert, Paper , Typography } from '@mui/material';
import { Link } from 'react-router-dom';
function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes in seconds

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    // Simulate a server request
    // Replace with actual API call to send reset password email
    setTimeout(() => {
      const random = Math.random();
      if (random < 0.5) {
        setError('Failed to send reset password email');
      } else {
        setSuccess(true);
        startTimer();
      }
    }, 1000);
  };

  const startTimer = () => {
    let time = timer;
    const interval = setInterval(() => {
      time--;
      setTimer(time);

      if (time === 0) {
        clearInterval(interval);
        setSuccess(false);
      }
    }, 1000);
  };

  return (
    <Paper elevation={3}
  style={{
    padding: '20px',
    maxWidth: '600px',
    position: "absolute",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }}
>

      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={handleChange}
        style={{ marginBottom: '20px', width: '100%' }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Reset Password
      </Button>
      <Snackbar open={!!error || success} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity={error ? 'error' : 'success'}>
          {error || 'Reset password email sent successfully!'}
        </Alert>
      </Snackbar>
      {success && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          Timer: {timer} seconds
          <br />
          Everything is right. Check your email!
        </div>
      )}

<Paper style={{ marginTop: '20px', textAlign: 'center' }}>
        <Typography variant="body2">
          Remember your password? <Link href="/signin">Return to Sign In</Link>
        </Typography>
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          Don't have an account? <Link href="/signup">Return to Sign Up</Link>
        </Typography>
      </Paper>
    </Paper>
    )
}

export default ForgetPassword;
