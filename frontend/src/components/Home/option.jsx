import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import {
  Paper,
  Typography,
  Button,
  Icon, // Import Icon component
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';



// Create a styled component
const StyledBox = styled(Paper)`
  padding: 20px;
  text-align: center;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 88%;
  max-width: 400px;
`;

const iconStyle = {
  fontSize: '5rem',
};

const Optionbox = () => {

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <StyledBox elevation={3}>
          <DashboardIcon color="primary" style={iconStyle}/> 
          <Typography variant="h4">Dashboard</Typography>
          <Typography variant="body1">Click the button below to add new materials:</Typography>
          <Button variant="contained" color="primary" component={Link} to="/admin/edit-workers">
            Dashboard
          </Button>
        </StyledBox>
      
      <StyledBox elevation={3}>
        <InventoryIcon color="primary" style={iconStyle} /> {/* Inventory Icon */}
        <Typography variant="h4">Show Material</Typography>
        <Typography variant="body1">Click the button below to see all materials:</Typography>
        <Button variant="contained" color="primary" component={Link} to="/materials">
          See Materials
        </Button>
      </StyledBox>

      <StyledBox elevation={3}>
        <WorkIcon color="primary" style={iconStyle} /> {/* Work Icon */}
        <Typography variant="h4">Jobs</Typography>
        <Typography variant="body1">Click the button below to see all jobs available:</Typography>
        <Button variant="contained" color="primary" component={Link} to="/Jobs">
          Jobs Available
        </Button>
      </StyledBox>

      <StyledBox elevation={3}>
        <GroupIcon color="primary" style={iconStyle}/> {/* Group Icon */}
        <Typography variant="h4">Who we Are</Typography>
        <Typography variant="body1">Click the button below to learn more about us:</Typography>
        <Button variant="contained" color="primary" component={Link} to="/learn-more">
          Learn More
        </Button>
      </StyledBox>
    </div>
  );
};

export default Optionbox;
