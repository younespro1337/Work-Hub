import React, { useEffect, useState , useRef} from 'react';
import { getProducts, sendRequest, updateProduct } from '../../../actions/productaction';
import MARKER from '../../../assets/images/G-M-Marker.png'
import axios from 'axios';
import './ProductDetailPage.css'; 
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ForwardToInboxTwoToneIcon from '@mui/icons-material/ForwardToInboxTwoTone';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';

// hello world we will run out of this country and we will create a 


const ProductDetailPage = () => {

  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [response, setResponse] = useState(null);
  const [newWatchId, setnewWatchId] = useState('');
  const [latitude, setlatitude] = useState('');
  const [longitude, setlongitude] = useState('');
  const [detailsVisibility, setDetailsVisibility] = useState({});
  const defaultCountry = 'Morocco MA';
  const latitudeRef = useRef('')
  const longitudeRef = useRef('')

  useEffect(() => {
    let isMounted = true; 
  
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (isMounted) {
          setProducts(data.products);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      
      if (newWatchId) {
        navigator.geolocation.clearWatch(newWatchId);
      }
      isMounted = false;
    };
  }, [newWatchId]); 
  

let watchId = null;

const sendLocation = async (latitude, longitude, userIdLS, materialId) => {
    try {
      const response = await axios.post('/api/v1/updateLocation', {
        latitude,
        longitude,
        userIdLS,
        materialId
      });
      console.log('Location updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating location:', error);
    }
    latitudeRef.current = latitude;
    longitudeRef.current = longitude;
};


const getLocationByIP = async (materialId) => {
    const userIdLS = localStorage.getItem('userIdLS');
    try {
      const { data } = await axios.get('https://api.ipify.org?format=json');
      console.log(data);
      const ipAddress = data.ip;
      axios
        .post('/api/v1/updateGeolocationByIp', { ipAddress, userIdLS, materialId })
        .then((response) => {
          const { latitude , longitude } = response.data;
          setlatitude(+latitude);
          setlongitude(+longitude);
          console.log('Latitude from getlocationByIp:', latitude);
          console.log('Longitude from getLocationByIp:', longitude);
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

const getLocation = async (materialId) => {
  const userIdLS = localStorage.getItem('userIdLS');

  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
  }

  try {
    const newWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setlatitude(+latitude);
        setlongitude(+longitude)
        sendLocation(latitude, longitude, userIdLS, materialId);
      },
      (error) => {
        console.error('Error getting current position:', error);
        if (error.message.includes('User denied Geolocation')) {
          // Ask for GPS permission again
          askForGPSPermission(materialId);
        } else {
          getLocationByIP(materialId); // argument materialID 
        }
      },
      { enableHighAccuracy: true }
    );
    setnewWatchId(newWatchId);
  } catch (error) {
    console.error('Error accessing geolocation:', error);
    // Handle the error here and call the function to get location by IP
    getLocationByIP(materialId);
  }
};
// Function to ask for GPS permission
const askForGPSPermission = async (materialId) => {
  try {
    await new Promise((resolve, reject) => {
      const confirmation = window.confirm('Please enable GPS for accurate location tracking.');
      if (confirmation) {
        resolve();
      } else {
        reject();
      }
    });
    // GPS permission granted
    getLocation(materialId);
  } catch (error) {
    console.error('GPS permission denied:', error);
    // Handle the error here or show an error message
    getLocationByIP(materialId);
  }
};

const handleGetMaterial = async (material) => {
  const { _id: productId } = material;
  const name = localStorage.getItem('name');
  const email = JSON.parse(localStorage.getItem('user')).email;
  const userIdLS = localStorage.getItem('userIdLS');
  const destination = defaultCountry;
  try {
    const updatedProduct = await updateProduct(productId, name, destination, email, userIdLS, latitude, longitude);
    setResponse({
      productId: updatedProduct._id,
      message: 'Material bought successfully!',
    });
    localStorage.setItem('materialObtained', 'true');
    const updatedProducts = products.map((material) => {
      if (material._id === productId) {
        return updatedProduct;
      }
      return material;
    });
    setProducts(updatedProducts);
  } catch (error) {
    setResponse({
      productId,
      message: 'Error buying material.',
    });
  }
};

const handleSendRequest = async (event, userId, productId) => {
    event.preventDefault();
    const userId_of_Taken = userId ;
    const user = JSON.parse(localStorage.getItem('user')); 
    const email = user.email;
    const name = user.name; 
    const userIdLS = localStorage.getItem('userIdLS'); 
    const destination = defaultCountry;
    if (name && destination && email && userIdLS && userId_of_Taken) { 

      try {
        const response = await sendRequest(productId, name, destination, email, userIdLS, userId_of_Taken); 
        console.log('this is the response: ', response);
        const updatedProduct = response.material;
        setResponse({
          productId: updatedProduct._id,
          message: 'Request sent successfully!',
        });
        // setShowForm(false);
        const updatedProducts = products.map((material) => {
          if (material._id === productId) {
            return updatedProduct;
          }
          return material;
        });
        setProducts(updatedProducts);
      } catch (error) {
        console.log(error);
        setResponse({
          productId,
          message: 'Error sending request.',
        });
      }
      // setSubmitting(false);
    }
};

  if (loading) {
    return <div className="loading_container">
       <div className='custom-loader'></div>
       <p>loading....</p>
       <p>please wait the data is loaded</p>
      </div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleToggleDetails = async (materialId) => {
    setDetailsVisibility((prevDetails) => ({
      ...prevDetails,
      [materialId]: !prevDetails[materialId],
    }));
  };
  


  return (
    <div className="material-container">
      {products.map((material) => (

        <div key={material._id} className="material">
          <div className="material-image">
            <img src={material.images.url} alt={material.name} onError={(e) => console.log(e)}  />
          </div>

          <div
  className={`moreLessIcon ${detailsVisibility[material._id] ? 'less' : 'more'}`}
  onClick={() => {
    handleToggleDetails(material._id);
    getLocation(material._id);
  }}
>
  {detailsVisibility[material._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
</div>


<div className={`material-info ${detailsVisibility[material._id] ? 'show' : 'hide'}`}>
            <h2>{material.name}</h2>
            <p>{material.description}</p>
            <label htmlFor="stock">
              Stock:
              <p  className={`counter ${material.stock > 0 ? 'green' : 'red'}`}>{material.stock}</p>
            </label>
            <p>Category: {material.category}</p>
{/* start   user container  */}
<div className="users-container">
  <h3>Users who have taken this material:</h3>
  <ul>
    {material.users.map((user, index) => (
      
      <li key={index} id={user._id}>
        <button onClick={(event) => handleSendRequest (event, user._id, material._id)}> <ForwardToInboxTwoToneIcon/></button>
         {/* Pass the user'to the handleBuy function */}
        <p>Name: {user.name}</p>
        <p>Country: {user.destination}</p>
        <p>email: {user.email}</p>
        <p>Taken at: {new Date(user.takenAt).toLocaleString()}</p> 
        <a href={`https://www.google.com/maps/search/?api=1&query=${user.latitude},${user.longitude}`} target="_blank" rel="noopener noreferrer">
  <img src={MARKER} class="Marker-G-Mps" alt="" />
  {/* <PersonPinCircleIcon /> */}
</a>
      </li>
    ))}
  </ul>
</div>

{/* end user container */}
{material.stock > 0 && (
    <button className='Get' onClick={() => {
      handleGetMaterial(material); // Pass the latitude and longitude here
    }}>
      {/* {console.log(material._id)} */}
      Get
    </button>
  )}

          </div>

          <div className={`light ${material.stock > 0 ? 'green' : 'red'}`}>
      {material.stock > 0 ? (
        <div><ThumbUpIcon style={{ display: 'inline-block' }} /></div>
      ) : (
        <div><ThumbDownAltIcon style={{ display: 'inline-block' }} /></div>
      )}
    </div>
        </div>

      ))}
    </div>
    // end the material container 

  );
}

export default ProductDetailPage;
