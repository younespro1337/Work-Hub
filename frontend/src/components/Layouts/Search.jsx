import React, { useEffect, useState } from 'react';
import NotFound from './NotFound';
import { Link } from 'react-router-dom';
import { sendRequest } from '../../actions/productaction';
import MARKER from '../../assets/images/G-M-Marker.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { flexbox, styled } from "@mui/system";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { formatDate } from '../../utils/DateFormat';
import EmailIcon from "@mui/icons-material/Email";
import GenderIcon from "@mui/icons-material/Wc";
import WomanIcon from '@mui/icons-material/Woman';
import ManIcon from '@mui/icons-material/Man';
import RoleIcon from "@mui/icons-material/Work";
import PhoneIcon from "@mui/icons-material/Phone";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { useMediaQuery } from '@mui/material';

const UserPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  border: "1px solid #ccc",
  borderRadius: theme.spacing(1),
  width: "40%",
  margin: "30%",
}));

const AvatarContainer = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  marginBottom: theme.spacing(2),
  border: '3px solid #ccc',
  borderRadius: "50%",
  backgroundColor: 'lightgray'
}));


const TypographyStyle = {
  display: "flex",
  alignItems: 'center',
  marginBottom: '2%'

}

const HrefStyle = {
  display:'flex',
  textDecoration:'none',
  color:'black'
} 



const Search = () => {
  const [filteredMaterials, setFilteredMaterials] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [detailsVisibility, setDetailsVisibility] = React.useState({});
  const [ filteredJobs, setFilteredJobs ] = React.useState({});
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [loading, setLoading ] = React.useState(true);




  const fetchData = () =>{
      setLoading(true)

      try {
        const storedData = localStorage.getItem('result');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setFilteredMaterials(parsedData.materials || []);
          setFilteredUsers(parsedData.users || []);
          console.log(parsedData.users)
          setFilteredJobs(parsedData.Jobs || []);
        }
      } catch (error) {
        console.log('there no resul in localStorage in Search Component', error)
      } finally {
        setLoading(false)
      }
    
  }  


  useEffect(() => {
    fetchData()
  }, []);


  const handleOpenClose = async (materialId, userId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId_of_Taken = document.querySelector('.user-id').textContent;
  const email = user.email;
  const name = user.name;
  const userIdLS = localStorage.getItem('userIdLS');
  const destination = 'morocco';
    console.log('handle open close', materialId, userId);
    if (name && destination && email && userIdLS && userId_of_Taken) {
      alert('yes ')
      try {
        const response = await sendRequest(materialId, name, destination, email, userIdLS, userId_of_Taken)
      console.log('this is the response: ', response);
    } catch(error) {
      console.log(error);
    }
  };
};

  const handleToggleDetails = (materialId) => {
    setDetailsVisibility((prevDetails) => ({
      ...prevDetails,
      [materialId]: !prevDetails[materialId],
    }));
  };






  const containedStyle = {
    width: isDesktop ? '50%' : '80%',
    margin: isDesktop ? '5% 25%' : '5% 10%',

  };


  return (
    <div>

      
    <div className="materials-container">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <div className="material" key={material._id}>
              <div className="material-image">
                <img src={material.images.url} alt="Material" />
              </div>
              <div
            className={`moreLessIcon ${detailsVisibility[material._id] ? 'less' : 'more'}`}
            onClick={() => handleToggleDetails(material._id)}
          >
            {detailsVisibility[material._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
              <div className={`material-info ${detailsVisibility[material._id] ? 'show' : 'hide'}`}>
                <strong>{material.name}</strong>
                <p>{material.description}</p>
                <p>Category: {material.category}</p>
                <label htmlFor="stock">
                  Stock:
                  <span className={`counter ${material.stock > 0 ? 'green' : 'red'}`}>
                    {material.stock}
                  </span>
                </label>
              <div className="users-container">

                <h4>Workers who currently have this material</h4>
                <ul>
                  {material.users.map((user, index) => (
                    <li key={index}>
                      <button onClick={() => handleOpenClose(material._id, user._id)}>Send Request</button>
                      <p>Name: {user.name}</p>
                      <p>Destination: {user.destination}</p>
                      <p>Email: {user.email}</p>
                      <p>Taken at: {new Date(user.takenAt).toLocaleString()}</p>
                      <p className="user-id" style={{ display: 'none' }}>{user._id}</p>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${user.latitude},${user.longitude}`} target="_blank" rel="noopener noreferrer">
                        <img src={MARKER} className="Marker-G-Mps" alt="" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              </div>
               <div className={`light ${material.stock > 0 ? 'green' : 'red'}`}>
      {material.stock > 0 ? (
        <div><ThumbUpIcon style={{ display: 'inline-block' }} /></div>
      ) : (
        <div><ThumbDownAltIcon style={{ display: 'inline-block' }} /></div>
      )}
    </div>
            </div>
          ))
        ) : (
          <div>
            {/* No materials found.
            <NotFound />  */}
          </div>
        )}
      </div>


      <div>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (

            <UserPaper elevation={3} sx={containedStyle}>
            <AvatarContainer src={user.avatar.url} alt="User Avatar" />
            <Typography variant="h5">{user.name}</Typography>
            
            <Typography variant="body1" sx={TypographyStyle}>
              <a href={`tel:${user.phoneNumber}`} style={HrefStyle}>
                <PhoneIcon color='primary' /> {user.phoneNumber}
              </a>
            </Typography>
            
            <Typography variant="body1" sx={TypographyStyle}>
              <a href={`mailto:${user.email}`} style={HrefStyle}>
                <EmailIcon color='primary' /> {user.email}
              </a>
            </Typography>
            
            <Typography variant="body1" sx={TypographyStyle}>
          {user.gender === "female" ? (
            <WomanIcon sx={{ marginRight: "4px" }} color="primary" />
          ) : user.gender === "male" ? (
            <ManIcon sx={{ marginRight: "4px" }} color="primary" />
          ) : (
            <GenderIcon sx={{ marginRight: "4px" }} color="primary" />
          )}
          {user.gender}
        </Typography>
            
            <Typography variant="body1" sx={TypographyStyle}>
              <RoleIcon color='primary' /> {user.role}
            </Typography>
            
            <Typography variant="body1" sx={TypographyStyle}>
              <DateRangeIcon color='primary' /> {formatDate(user.registerAt)}
            </Typography>
          </UserPaper>
      
      
          
          ))
        ) : (
          <div>
            {/* No users found. */}
          </div>
        )}
      </div>


    </div>
  );
};

export default Search;
