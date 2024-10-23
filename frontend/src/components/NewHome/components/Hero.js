import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { userSubscription } from '../../../actions/userAction';
import CustomSnackbar from '../../Layouts/Snackbar';

const StyledBox = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  width: '100%',
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  outline: '6px solid',
  outlineColor: 'hsla(220, 25%, 80%, 0.2)',
  border: '1px solid',
  borderColor: theme.palette.grey[200],
  boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  backgroundImage: `url(${'https://res.cloudinary.com/dktkavyr3/image/upload/v1726599513/e7xwvwncnrhp1y6x1rem.jpg'})`,
  backgroundSize: 'cover',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(10),
    height: 700,
  },
  ...theme.applyStyles('dark', {
    boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
    backgroundImage: `url(${'https://res.cloudinary.com/dktkavyr3/image/upload/v1726599513/jsbyi0dgph313di7kjos.jpg'})`,
    outlineColor: 'hsla(220, 20%, 42%, 0.1)',
    borderColor: theme.palette.grey[700],
  }),
}));

export default function Hero() {
const [email, setEmail] = React.useState('');
const [isSnackbarOpen, setSnackbarOpen ] = React.useState(false);
const [snackbarMessage, setSnackbarMessage] = React.useState('');
const [severity, setSeverity ] = React.useState('');


const handleChange = async (event) => { 
  // Send the email to the server
  const emailObtained = event.target.value;
  // console.log(emailObtained);
  setEmail(emailObtained);
}


const handleSubscribeClick = async () => {
  try {
    const  data  =  await userSubscription(email);
    // console.log(data);
      const  { message , status }  = data;
      setSnackbarOpen(true);
      setSnackbarMessage(message)
      setSeverity(status ==='success'? 'success' : 'error');
  } catch (err) { 
    console.error('Error subscribing user:', err);
    setSnackbarOpen(true);
    setSnackbarMessage('Subscription failed. Please try again.');
    setSeverity('error');  
  }
}

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)',
            }}
          >
            Our&nbsp;latest&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: 'inherit',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: 'primary.light',
                }),
              })}
            >
              products
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            Explore our cutting-edge dashboard, delivering high-quality solutions
            tailored to your needs. Elevate your experience with top-tier features
            and services.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
          >
            
             
              
            <InputLabel htmlFor="email-hero" sx={visuallyHidden}>
              Email
            </InputLabel>
            <TextField
              id="email-hero"
              hiddenLabel
              name="email"
              size="small"
              value={email}
              variant="outlined"
              aria-label="Enter your email address"
              placeholder="Your email address"
              fullWidth
              onChange={handleChange}
              slotProps={{
                htmlInput: {
                  autoComplete: 'off',
                  'aria-label': 'Enter your email address',
                },
              }}
            />

            <Button
            type="submit"
              variant="contained"
              color="primary"
              size="small"
              onClick={handleSubscribeClick}
              sx={{ minWidth: 'fit-content' }}
            >
              Start now
            </Button>

          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            By clicking &quot;Start now&quot; you agree to our&nbsp;
            <Link to="/terms-conditions" color="primary">
              Terms & Conditions
            </Link>
            .
          </Typography>
        </Stack>
        <StyledBox id="image" />      
      </Container>
      <CustomSnackbar
        open={isSnackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={severity}
        autoHideDuration={3000}
      />
    </Box>
  );
}