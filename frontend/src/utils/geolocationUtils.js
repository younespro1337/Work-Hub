import axios from 'axios';

let watchId = null;

export const sendLocation = async (latitude, longitude, userIdLS) => {
  console.log("Sending location to the server...");
  try {
    const response = await axios.post('/api/v1/updateLocation', {
      latitude,
      longitude,
      userIdLS
    });
    console.log('Location updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating location:', error);
  }
};

export const getLocationByIP = async () => {
  const userIdLS = localStorage.getItem('userIdLS');
  try {
    // make device call the  api to get its own api 
    const { data } = await axios.get('https://api.ipify.org?format=json');
    console.log(data); // logi res from the api its include serveral properites or try to log[https://api.ipify.org?format=json] in postMan With GET Method Oki => 
    const ipAddress = data.ip;
    axios
      .post('/api/v1/updateGeolocationByIp', { ipAddress, userIdLS })
      .then((response) => {
        const { latitude, longitude } = response.data;
        sendLocation(latitude, longitude, userIdLS);
      })
      .catch((error) => {
        console.error('Error getting IP geolocation:', error);
        // Handle the error here
      });
  } catch (error) {
    console.error('Error getting IP address:', error);
    // Handle the error here
  }
};

export const getLocation = async () => {
  const userIdLS = localStorage.getItem('userIdLS');
  const materialObtained = localStorage.getItem('materialObtained') === 'true';

  if (materialObtained) {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }

    try {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          sendLocation(latitude, longitude, userIdLS);
        },
        (error) => {
          console.error('Error getting current position:', error);
          getLocationByIP();
        },
        { enableHighAccuracy: true }
      );
    } catch (error) {
      console.error('Error accessing geolocation:', error);
      getLocationByIP();
    }
  }
};


