import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import { useFormik } from 'formik';
import { googleLogin, loginUser, forgotPassword} from '../../../actions/userAction';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInSchema } from '../../Auth/validationShemas';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import useRedirectBasedOnRole from '../../../utils/redirect';
import CustomSnackbar from '../../Layouts/Snackbar';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
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

export default function SignInCard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false); 
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const RedirectBasedOnRole = useRedirectBasedOnRole()

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const googleSignIn = useGoogleLogin({
    onSuccess: async (res) => {
      console.log('Google login success:', res);
  
      // Ensure correct extraction of access_token
      const access_token = res.access_token;  // This should be the actual token, not an object
  
      try {
        const res = await dispatch(googleLogin(access_token));
        const { role } = res.user
        if (res && res.success) {
          RedirectBasedOnRole(role);
        }
      } catch (error) {
        console.error('Error during Google sign-up:', error);
      }
    },
    onFailure: (error) => console.error('Google login failed:', error),
  });



  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      try {
        const res = await dispatch(loginUser(values));
        console.log(res);
        
        if (res) {
          const { role } = res.user; 
          RedirectBasedOnRole(role); 
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          formik.setFieldError('email', 'Invalid email or password');
        } else if (error.response && error.response.status === 400) {
          formik.setFieldError('password', error.response.data.message);
        } else {
          formik.setErrors({
            email: '',
            password: 'An error occurred',
          });
        }
      }
    },
  });
  



  

 



  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Link
              component="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'baseline' }}
            >
              Forgot your password?
            </Link>
          </Box>
          <TextField
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            {...formik.getFieldProps('password')}
          />
        </FormControl>

        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />

        <ForgotPassword 
        open={open} 
        handleClose={handleClose}
         
        />
        <Button type="submit" fullWidth variant="contained">
          Sign in
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
  Don&apos;t have an account?{' '}
  <span>
    <Link
      component={RouterLink}
      to="/singup"
      variant="body2"
      sx={{ alignSelf: 'center' }}
    >
      Sign up
    </Link>
  </span>
</Typography>
      </Box>
      <Divider>or</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          type="button"
          fullWidth
          variant="outlined"
          onClick={googleSignIn}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
        <Button
          type="button"
          fullWidth
          variant="outlined"
          onClick={googleSignIn}
          startIcon={<FacebookIcon />}
        >
          Sign in with Facebook
        </Button>
      </Box>

    
    </Card>
  );
}
