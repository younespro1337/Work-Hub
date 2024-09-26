// components/Auth/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Typography, Card, FormControl } from '@mui/material';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Call your API to reset the password using Axios
      const response = await axios.post(`/api/v1/resetPassword/${token}`, {
        password: newPassword,
      });

      

      if (response.status !== 200) {
        throw new Error('Failed to reset password');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card sx={{ width: '50%', margin: '25%' }}>
      <Typography variant="h4">Reset Your Password</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success ? (
        <Typography color="success">Your password has been reset successfully!</Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <TextField
              error={Boolean(error)}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={() => setError('')}
              type="password"
              placeholder="New Password"
              required
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              error={Boolean(error)}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setError('')}
              type="password"
              placeholder="Confirm Password"
              required
              variant="outlined"
            />
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Reset Password
          </Button>
        </form>
      )}
    </Card>
  );
};

export default ResetPassword;
