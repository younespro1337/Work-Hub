import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import {
  Paper,
  Typography,
  Button,
} from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

// Create a styled component
const StyledBox = styled(Paper)`
  padding: 20px;
  text-align: center;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 400px;
`;

const iconStyle = {
  fontSize: '5rem', // Adjust the icon size as needed
};

const AboutUs = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      <StyledBox elevation={3}>
        <DirectionsIcon color="primary" style={iconStyle} /> {/* Larger icon */}
        <Typography variant="h4">How To Use App</Typography>
        <Typography variant="body1">Click the button below to learn How To Use App</Typography>
        <Button variant="contained" color="primary" component={Link} to="/About-us">
          Using App
        </Button>
      </StyledBox>
      
      <StyledBox elevation={3} >
        <MonetizationOnIcon color='primary' style={iconStyle} /> {/* Larger icon */}
        <Typography variant="h4">Marketing plan</Typography>
        <Typography variant="body1" >Click the button below to See your Marketing plan</Typography>
        <Button variant="contained" color="primary" component={Link} to='/Marketing-plan'>
          Become A Marketer
        </Button>
      </StyledBox>
    </div>
  );
};

export default AboutUs;
