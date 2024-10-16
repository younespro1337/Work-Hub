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
  const  { avatar, email , firstName, lastName, _id} = useSelector(state => state.user.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch  = useDispatch()

 

  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  
    try {
      const imageData = await uploadFileToCloudinary(file);
      const data = {
        imageData: imageData,
        userId: _id,
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
        <img src={avatar?.url ||"https://www.google.com/url?sa=i&url=https%3A%2F%2Fbuffer.com%2Flibrary%2Fbest-profile-picture-science-research-psychology%2F&psig=AOvVaw3UP7PxRyZeAVpJHKhkOctR&ust=1728415312776000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJivno7__IgDFQAAAAAdAAAAABAE"} alt="" className='cover-img' />
        <div className="profile-circle">
          <img src={avatar?.url || "https://www.google.com/url?sa=i&url=https%3A%2F%2Fbuffer.com%2Flibrary%2Fbest-profile-picture-science-research-psychology%2F&psig=AOvVaw3UP7PxRyZeAVpJHKhkOctR&ust=1728415312776000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJivno7__IgDFQAAAAAdAAAAABAE"} alt="" /> 
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
    </div>
  );
};

export default ProfileHeader;
