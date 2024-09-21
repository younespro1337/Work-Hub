import axios from "axios";

import {
 REGISTER_USER_REQUEST,
 REGISTER_USER_FAIL,
 REGISTER_USER_SUCCESS,
 LOGIN_USER_REQUEST,
 LOGIN_USER_FAIL,
 LOGIN_USER_SUCCESS,
 SET_MARGIN_TOP
} from '../constants/userConstant.js'

// login user 


export const setMarginTop = (margin) => ({
  type: SET_MARGIN_TOP,
  payload: margin,
});
 

export const loginUser = (email, password) => async (dispatch) => {
  try {

      dispatch({ type: LOGIN_USER_REQUEST });
    
      // const config = {
      //     headers: {
      //         "Content-Type": "application/json",
      //     },
      // }
    
      const { data } = await axios.post(
          '/api/v1/login',
          { email, password },
          // config
      );

      const token = data.token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
  
      dispatch({
          type: LOGIN_USER_SUCCESS,
          payload: data.user,
      });
      return data

  } catch (error) {
      dispatch({
          type: LOGIN_USER_FAIL,
          payload: error.response.data.message,
      });
  }
};



export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

 // const config = {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // };

    const { data } = await axios.post('/api/v1/register', userData);

    console.log('Signup response from server:', data);  // Debugging log

    const token = data.token;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(data.user));

    console.log('Stored in localStorage:', localStorage.getItem('user'));  // Debugging log

    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: data.user,
    });

    return data;

  } catch (error) {       

    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};








export const search = async (keyword) => {
    try {
      const response = await axios.get(`/api/v1/search?keyword=${keyword}`);
      // console.log(response.data)
      localStorage.setItem("result", JSON.stringify(response.data));
      var storedData = JSON.parse(localStorage.getItem("result"));
      console.log(storedData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
};




  export const getAllUsers = async () => {
    try {
      const { data } = await axios.get('/api/v1/workers');
      // console.log(data)
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  };

  

  export const getAllJobs = async () => {
    try {
     const response = await axios.get('/api/v1/jobs');
     return response.data;
    } catch (error) {
      console.error('Error fetching jobs requesters:', error)
      throw error;
    }
  }



  export const getTasks = async (id) => {
    try {
      const res = await axios.post('/api/v1/TasksAvailable', { id });
      // console.log('Tasks response:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching Tasks:', error);
      throw error;
    }
};



export const fetchTasks = async () => {
  try {
    const res = await axios.get('/api/v1/fetchTasks');
    // console.log('fetchTasks: ' , res.data.data);
    return res.data
  } catch (error) {
   console.error('Error fetching Tasks to Chart, MainData component ')
  }
}


export async function sendMessages(data) {
  try {
    const response = await axios.post('/api/v1/send-messages', data);
    //  console.log('res:',response)
    if (response.status === 200) {
      // console.log('Message sent successfully');
      return response.data; 
    } else {
      // Handle error response from the server
      console.error('Error sending message:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error sending message:', error.message);
    throw error;
  }
}

// Update getAllChats with console.log statements
export async function getAllChats(memberSelected, userId) {
  try {
    // console.log('Fetching chats with:', memberSelected, userId);
    const { data }= await axios.get(`/api/v1/getAllChats?selectedMember=${memberSelected}&userId=${userId}`);
    // console.log('Response:', data);
    localStorage.setItem('memberDetails', JSON.stringify(data.memberDetails));

    return data;
  } catch (error) {
    console.error('Error in chat:', error);
    throw error; // Rethrow the error to propagate it to the calling code
  }
}


export const handleSaveChanges = async (data) => {
  try {
    const response = await axios.post('/api/v1/editworker', data);
    console.log('Data saved successfully:', response.data);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};


export const handleDeleteWorker = async (id) => {
  try {
    const { data } = await axios.delete(`/api/v1/users/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};


export const  handleUpdateTaskStatus = async (taskId , userId, action) => {
 
  try {
     const requestData = {
      taskId:taskId,
      userId:userId,
      action:action
     }   
      const { data }= await axios.post(`/api/v1/updateTasks`, requestData); 
      console.log('Task status updated:', data);
      
       
      return  data

  } catch (error) {
    console.error('Error updating task status:', error);
  }
}








export const hanldeFetchRequets = async (user) => {
  try { 
    const { data } = await axios.post('/api/v1/getRequests', user) 

     return data
  } catch (error) {
    console.error('Error fetching materials requets:', error)
  }
}

export const handleConfirmRequest = async (requestData) => {
  try {
    const { data } = await axios.post('/api/v1/confirm', requestData )
    return data
  } catch (error) {
    console.error('Error confirm Request:', error);
  }
}

export const handleRejectRequest = async (requestData) => {
  try {
    const { data } = await axios.post('/api/v1/reject', requestData)
    return data
  } catch (error) {
     console.error('Error Reject Request:', error);
  } 
}

// userAction.js
export const handleApproveRequest = async (requestId) => {
  try {
    const { data } = await axios.post('/api/v1/approve', { requestId });
    return data;
  } catch (error) {
    console.error('Error Approve Request:', error);
    throw error; // Rethrow the error so it can be caught in the component
  }
};



export const getAllMaterialRequest = async () => {

  try {
    const res = await axios.get('/api/v1/materialrequesters');
    // console.log(res)
    return res.data;

  } catch (error) {
    console.error('Error fetching material requesters:', error);
    throw error;
  }
};









// Define a function to call the /track route
export const trackEmail = async () => {
  try {
    // Make a GET request to your server's /track route
    const response = await axios.get('/api/v1/track?id=younes Raymond');

    // Log the response from the server
    console.log('Response from server:', response.data);
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error:', error.message);
  }
};



















