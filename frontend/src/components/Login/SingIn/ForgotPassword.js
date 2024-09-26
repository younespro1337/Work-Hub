import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { forgotPassword } from '../../../actions/userAction';
import CustomSnackbar from '../../Layouts/Snackbar';

function ForgotPassword({ open, handleClose }) {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false); 
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
 
 
 
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const handleForgotPassword = async (email) => {
    setLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSnackbarMessage('Reset password link has been sent to your email.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Error: Could not send reset email.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error: Could not send reset email.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setLoading(false);
    handleClose(); 
  };


 
 
 
 
 
 
 
  return (
    <>
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          handleForgotPassword(email);
        },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a link to
          reset your password.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          value={email}
          onChange={handleEmailChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
        variant="contained" 
        type="submit"
        onClick={handleForgotPassword}
        >
          {loading ? 'Sending...' : 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
    <CustomSnackbar
    open={snackbarOpen}
    handleClose={handleSnackbarClose}
    severity={snackbarSeverity}
    message={snackbarMessage}
  />
  </>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;