import React, { useState ,useEffect } from 'react';
import { 
  Typography,
  Container,
  Paper,
  Grid, 
  FormControlLabel, 
  Switch, 
  MenuItem, 
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useMediaQuery } from '@mui/material';
import * as Yup from 'yup';

function SettingsComponent() {

  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); 
  const [userGeolocation, setUserGeolocation] = useState(null);  
  const [changePassword, setChangePassword ] = useState(false);
  const [helpAndSupport, setHelpAndSupport] = useState(false)
  const [regionName, setRegionName] = useState(null);
  const [countryFlag , setCountryFlag ] = useState(null);
  const [language_Native, setLanguage_Native ] = useState(null)
  const [countryInfo, setCountryInfo ] = useState(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [hideNavigationMenu,  setHideNavigationMenu ] = useState(false);
  const [isChangePasswordDialogOpen, setChangePasswordDialogOpen ] = useState(false);
  const [newPassword, setNewPassword ] = useState('')
  const [confirmPassword, setConfirmPassword ] = useState('')
 
 
 const passwordShema = Yup.object().shape({
   newPassword: Yup.string()
     .min(8, 'Password must be at least 8 characters')
     .required('Password is required'),
   confirmPassword: Yup.string()
     .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
     .required('Confirm Password is required'),
 });
 

   // Add a state to store validation errors
   const [validationErrors, setValidationErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });



  const handleChangePasswordSubmit = async () => {

    if ( newPassword === confirmPassword) {
      const userId = JSON.parse(localStorage.getItem('user'))._id;
  
      try {
        await passwordShema.validate(
          {newPassword, confirmPassword },
          {abortEarly: false}
        );
        const res = await axios.post('/api/v1/changePassword', {
          userId,
          newPassword,
        });
  
      } catch (error) {
        console.error('error changing password' , error)
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });

        setValidationErrors(errors)

        
      }
  
    } else {
  
      alert('password not match')
  
    }
    setChangePasswordDialogOpen(false);
  }



const handleOpenChangePasswordDialog = () => {
  setChangePasswordDialogOpen(true);
}

const handleCloseChangePasswordDialog = () => {
  setChangePasswordDialogOpen(false);
}







  const getInfoOfCountry = async () => {
    try {
      const { data } = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = data.ip; // Extract the IP address from the response
      const countryDataResponse = await axios.post('/api/v1/updateGeolocationByIp', { ipAddress });
  
      // Update relevant state variables with the fetched data
      const geolocationData = countryDataResponse.data;
      setCountryInfo(geolocationData)
      setRegionName(geolocationData?.region_name);
      setCountryFlag(geolocationData?.location.country_flag)
      setLanguage_Native(geolocationData?.location.languages[0].native)
      console.log('json object:', geolocationData);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };
 
  
  const paperStyle = {
    padding:'20px',
    width: isDesktop ? '100%' : '80%',
    margin: isDesktop ? 'auto' : '10%',
    
  };

  
  useEffect(() => {
    getInfoOfCountry()
  }, []);

  
  const handleNotificationToggle = () => {
    setNotificationEnabled(!notificationEnabled);
  };

  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);
  };

  useEffect(() => {
    if (darkModeEnabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkModeEnabled]);
 
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };
  


  const handleHelpAndSupportToggle = () => {
    setHelpAndSupport(!helpAndSupport)
  }
  


  // Load the hideNav value from localStorage on component mount
  useEffect(() => {
    const hideNav = localStorage.getItem('hideNav');
    if (hideNav) {
      setHideNavigationMenu(true);
    }
  }, []);



  const handleHideNavigationMenu = () => {
    if (hideNavigationMenu) {
      localStorage.setItem('hideNav', false);
    } else {
      localStorage.setItem('hideNav', true);
    }
    setHideNavigationMenu(!hideNavigationMenu);
  };


  return (  
    <div style={{marginTop:'8rem'}}>
    <Container maxWidth="md">
      <Paper elevation={3} style={paperStyle}>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationEnabled}
                  onChange={handleNotificationToggle}
                  color="primary"
                />
              }
              label="Enable Notifications"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Additional Settings
            </Typography>
        
            <FormControlLabel
              control={
                <Switch
                  checked={darkModeEnabled}
                  onChange={handleDarkModeToggle}
                  color="primary"
                />
              }
              label="Dark Mode"
            />


<FormControlLabel
  control={
    <Select
      value={selectedLanguage}
      onChange={handleLanguageChange}
    >
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="fr">French</MenuItem>
      <MenuItem value="ar">Arabic</MenuItem>
    </Select>
  }
  label="Language and Localization"
/>

               <FormControlLabel
              control={
                <Switch
                  checked={changePassword}
                  onChange={handleOpenChangePasswordDialog}
                  color="primary"
                />
              }
              label="Password and Security"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={helpAndSupport}
                  onChange={handleHelpAndSupportToggle}
                  color="primary"
                />
              }
              label="Help and Support"
            />    
 <FormControlLabel
  control={
    <Switch
      checked={userGeolocation !== null}
      // onChange={getInfoOfCountry}
      disabled={selectedLanguage !== 'en' && selectedLanguage !== 'es'}
    />
  }
  label="Automatic Geolocation Language"
/>

<FormControlLabel
  control={
    <Switch
      checked={hideNavigationMenu}
      onChange={handleHideNavigationMenu}
      disabled={selectedLanguage !== 'en' && selectedLanguage !== 'es'}
    />
  }
  label="Hide Helper Navigation"
/>


 
  
  {countryInfo && (
    <div>
      <h2>Country Information</h2>
      <img src={countryFlag} alt={`${countryInfo.country_name} Flag`} width="100" height="60" />
      <p>Region Name: </p>
      <p>Region: {regionName}</p>
      <p>Language: {language_Native}</p>
    </div>
  )}
   
          </Grid>
        </Grid>


        <Dialog open={isChangePasswordDialogOpen} onClose={handleCloseChangePasswordDialog}>
    <DialogTitle>Change Password</DialogTitle>
    <DialogContent>
      <TextField
        label="New Password"
        type="password"
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        error={!!validationErrors.newPassword}
        helperText={validationErrors.newPassword}
      />
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={!!validationErrors.confirmPassword}
        helperText={validationErrors.confirmPassword}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseChangePasswordDialog} color="primary">
        Cancel
      </Button>
      <Button onClick={handleChangePasswordSubmit} color="primary" variant="contained">
        Save
      </Button>
    </DialogActions>
  </Dialog>


      </Paper>


      



    </Container>
    </div>

  );
  
}

export default SettingsComponent;
