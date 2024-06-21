import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../../actions/userAction';
import './Login.css';
import Loading  from '../../Layouts/loading';
import {
 Dialog,
 Typography,
 TextField,
 Button
} from '@mui/material'
import axios from 'axios';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail ] = useState('');
  const [resetCode, setResetCode ] = useState('');
  const [refreshed, setRefreshed ] = React.useState(false);
  const [confirmPassword, setConfirmPassword ] = React.useState('');
  const [openDialog , setOpenDialog ] = React.useState(false);
  const [resetPasswordDialog, setResetPasswordDialog ] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();



 const handleOpenDialog = () => {
   setOpenDialog(true)
 }


 const  handleResetPasswordSubmit  = async () => {
  try {
    await axios.post('/api/v1/resetpassword',{ email: resetEmail });
    setResetPasswordDialog(true);
  } catch (error){
   console.error('Error sending reset email:', error);
  }

 };
 
 

const handleCloseDialogs = () => {
  setOpenDialog(false);
  setResetPasswordDialog(false);
};
 


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(email, password);
      if (response.token) {
        // Handle successful login 
        navigate('/profile');
        window.location.reload()
      } 
    } catch (error) {
      alert("Sorry, we couldn't find an account with that email and password");
      console.log('Error:', error);
    } finally {
      return setLoading(false);
    }
  };



if(loading) {
   
  return  <Loading />
}



  return (
    <div className="login-page">
     <div className="intro-welcome">
      </div>
      <form onSubmit={handleSubmit} className="login-form">
      
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <div className="register-link">
          <p>
            New to Allamrt? <Link to="/register">Register here</Link>
          </p>
        </div>
        <div className="register-link">
          <p>
            Forget Password? <span style={{cursor:'pointer'}} onClick={handleOpenDialog}>Click Here</span>           
          </p>
        </div>
      </form>
      <Dialog open={openDialog || resetPasswordDialog} onClose={handleCloseDialogs}>
        <div className="reset-dialog">
          <Typography variant="h6" gutterBottom>
            {resetPasswordDialog ? 'Enter Reset Code' : 'Forgot Your Password?'}
          </Typography>
          <Typography variant="body2" paragraph>
            {resetPasswordDialog
              ? 'Enter the code sent to your email to reset your password.'
              : 'No worries! Enter your email below, and we\'ll send you a reset code.'}
          </Typography>
          {resetPasswordDialog ? (
            <TextField
              label="Reset Code"
              variant="outlined"
              fullWidth
              margin="normal"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />
          ) : (
            <TextField
              label="Your Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={resetPasswordDialog ? handleResetPasswordSubmit : handleSubmit}
          >
            {resetPasswordDialog ? 'Submit Code' : 'Submit'}
          </Button>
        </div>
      </Dialog>
    </div>
  );

  

}

export default LoginPage;
