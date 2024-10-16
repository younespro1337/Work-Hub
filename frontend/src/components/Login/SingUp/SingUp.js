import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../SingIn/CustomIcons';
import { googleLogin, registerUser } from '../../../actions/userAction';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { signUpSchema } from '../../Auth/validationShemas';
import { useNavigate } from 'react-router-dom';
import CustomSnackbar from '../../Layouts/Snackbar';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import useRedirectBasedOnRole from '../../../hooks/redirect';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  padding: 4,
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  ...theme.applyStyles('dark', {
    backgroundImage:
      'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}));








export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const RedirectBasedOnRole = useRedirectBasedOnRole()
  const [snackbarOpen, setSnackbarOpen] = React.useState(false); 
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

 
  const googleSignUp = useGoogleLogin({
    onSuccess: async (res) => {
      // console.log('Google login success:', res);
  
      // Ensure correct extraction of access_token
      const access_token = res.access_token;  // This should be the actual token, not an object
  
      try {
        const res = await dispatch(googleLogin(access_token));
        const { role } = res.user
        // console.log('role:', role);
        if (res && res.success) {
          RedirectBasedOnRole(role)
        }
      } catch (error) {
        console.error('Error during Google sign-up:', error);
      }
    },
    onFailure: (error) => console.error('Google login failed:', error),
  });
  
  


  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      receiveUpdates: false,
      avatar: { publicId: '', url: '' },
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      try {
        const res = await dispatch(registerUser(values));
        
        if (res && res.success) {
          const { role } = res.user;
          RedirectBasedOnRole(role);
        } else {
          const message = res.message || 'Registration failed. Please try again.';
          console.debug('error res: ', res);
          setSnackbarMessage(message);
          setSnackbarOpen(true);
          setSnackbarSeverity('error');
        }
      } catch (error) {
        const message = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
        setSnackbarMessage(message);
        setSnackbarOpen(true);
        setSnackbarSeverity('error');
      }
    },
  });
  
  
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };




  return (
   
        <SignUpContainer direction="column" justifyContent="space-between">
          <Stack
            sx={{
              justifyContent: 'center',
              height: '130dvh',
              p: 2,
            }}
          >
            <Card variant="outlined">
              <SitemarkIcon />
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
              >
                Sign up
              </Typography>


              <Box
  component="form"
  onSubmit={formik.handleSubmit} // ensure onSubmit is correctly set
  sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
>
  <FormControl>
    <FormLabel htmlFor="name">First name</FormLabel>
    <TextField
      autoComplete="given-name"
      name="firstName"
      required
      fullWidth
      id="firstName"
      value={formik.values.firstName}
      onChange={formik.handleChange}
      error={formik.touched.firstName && Boolean(formik.errors.firstName)}
      helperText={formik.touched.firstName && formik.errors.firstName}
    />
  </FormControl>

  <FormControl>
    <FormLabel htmlFor="name">Last name</FormLabel>
    <TextField
      required
      fullWidth
      id="lastName"
      name="lastName"
      autoComplete="family-name"
      value={formik.values.lastName}
      onChange={formik.handleChange}
      error={formik.touched.lastName && Boolean(formik.errors.lastName)}
      helperText={formik.touched.lastName && formik.errors.lastName}
    />
  </FormControl>

  <FormControl>
    <FormLabel htmlFor="email">Email</FormLabel>
    <TextField
      error={formik.touched.email && Boolean(formik.errors.email)}
      helperText={formik.touched.email && formik.errors.email}
      value={formik.values.email}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      id="email"
      type="email"
      name="email"
      placeholder="your@email.com"
      autoComplete="email"
      autoFocus
      required
      fullWidth
      variant="outlined"
      {...formik.getFieldProps('email')}
    />
  </FormControl>

  <FormControl>
    <FormLabel htmlFor="password">Password</FormLabel>
    <TextField
      required
      fullWidth
      placeholder="••••••"
      name="password"
      type="password"
      id="password"
      autoComplete="new-password"
      value={formik.values.password}
      onChange={formik.handleChange}
      error={formik.touched.password && Boolean(formik.errors.password)}
      helperText={formik.touched.password && formik.errors.password}
    />
  </FormControl>

  <FormControlLabel
    control={<Checkbox value="allowExtraEmails" color="primary" />}
    label="I want to receive updates via email."
  />

  <Button type="submit" fullWidth variant="contained">
    Sign up
  </Button>
</Box>



              <Divider>
                <Typography sx={{ color: 'text.secondary' }}>or</Typography>
              </Divider>
            


              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  onClick={googleSignUp}
                  startIcon={<GoogleIcon />}
                >
                  Sign up with Google
                </Button>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  onClick={googleSignUp}
                  startIcon={<FacebookIcon />}
                >
                  Sign up with Facebook
                </Button>
              </Box>



            </Card>
          </Stack>

          <CustomSnackbar 
          open={snackbarOpen}
          handleClose={handleSnackbarClose}
          severity={snackbarSeverity}
          message={snackbarMessage}
      
          />

        </SignUpContainer>
  );
}