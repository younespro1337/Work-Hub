import React, {useEffect, useState} from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useSelector, useDispatch } from 'react-redux';
import { uploadFileToCloudinary } from '../../../actions/UploadMedial';
import {
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  REGISTER_USER_SUCCESS,
  REMOVE_USER_DETAILS
} from '../../../constants/userConstant'; 
import axios from 'axios';


const ProfileHeader = () => {
  const Ruser = useSelector(state => state.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch  = useDispatch()
  const [user, setUser] = useState(null); 

  useEffect(() => {
     setUser(Ruser.user)
  }, [])

  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  
    try {
      const imageData = await uploadFileToCloudinary(file);
      const data = {
        imageData: imageData,
        userId: Ruser._id,
      };
  
      dispatch({ type: UPDATE_PROFILE_REQUEST });
  
      const res = await axios.post('/api/v1/updateprofileimg', data);
  
      if (res.data && res.data.worker) {
        localStorage.setItem('user', JSON.stringify(res.data.worker));
        // setUser(res.data.worker);
  
        if (res.data.worker.avatar && res.data.worker.avatar.url) {
          // setProfileImg(res.data.worker.avatar.url);
        }
  
        dispatch({
          type: UPDATE_PROFILE_SUCCESS,
          payload: res.data.worker
        });
        
        dispatch({
          type: REGISTER_USER_SUCCESS,
          payload: res.data.worker
        });
}
  
    } catch (error) {
      console.error('Image upload failed:', error);
      dispatch({
        type: UPDATE_PROFILE_FAIL,
        payload: error.message
      });
      // setSnackbarMessage('Image upload failed');
      // setSnackbarOpen(true);
    }
  };




  return (
    <div className="wrap-help">
      <div className="profile-cover">
        <img src={user?.avatar?.url} alt="" className='cover-img' />
        <div className="profile-circle">
          <img src={user?.avatar?.url} alt="" /> 
        </div>
        <div className="edit-btn">
          <label htmlFor="fileInput">
            <CameraAltIcon />
          </label>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </div>
      </div>
      <div className="name">
        {/* {user?.firstName} */}
      </div>
    </div>
  );
};

export default ProfileHeader;
