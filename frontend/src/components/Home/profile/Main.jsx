import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profile.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ProfileHeader from './ProfileHeader';
import TasksContainer from './TasksContainer';
import { setMarginTop } from '../../../actions/userAction';



function Main() {

  const [user, setUser] = useState(null); 
  const [reQSrV, setReQSrV] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const reqParentRef = useRef(null);
  const [requestProcessed, setRequestProcessed] = useState(false);
  const navigate = useNavigate();
  const [tasks , setTasks ] = useState([]);
  const [isTaskDone , setIsTaskDone ] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const Ruser = useSelector(state => state.user);
  const dispatch = useDispatch();
  
  // Dispatch the action when the component mounts
  useEffect(() => {
    dispatch(setMarginTop('100px'));
  }, [dispatch]);

 useEffect(() => {
   setUser(Ruser)
    if (reQSrV && reQSrV.message) {
      setSnackbarMessage(reQSrV.message);
      setSnackbarOpen(true);
    }
  }, [reQSrV]);





  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

 

  useEffect(() => {
    const storedStatus = localStorage.getItem('newStatus');
    if (storedStatus) {
      setNewStatus(storedStatus);
    }
    
    if (requestProcessed && reqParentRef.current) {
      reqParentRef.current.remove();
    }
  }, [requestProcessed]);
  






const handleCompleteTask = async (taskId) => {

  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const data = {
      userId: user._id,
      taskId,
      status: 'completed'
    };

    const res = await axios.post(`/api/v1/updateTasksDone`, data);
    console.log('Task status updated:', res.data);

    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, status: 'completed' } : task
    );
    setTasks(updatedTasks);
    setIsTaskDone(true);
  } catch (error) {
    console.error('Error updating task status:', error);
  }
};


return (
  
    <div className="Profile-container">

     {user && <ProfileHeader />}

  <TasksContainer handleCompleteTask={handleCompleteTask} />





<Snackbar
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={handleSnackbarClose}
>
  <MuiAlert
    elevation={6}
    variant="filled"
    onClose={handleSnackbarClose}
    severity={snackbarMessage.includes('successfully') ? 'success' : 'error'}
  >
    {snackbarMessage}
  </MuiAlert>
</Snackbar>


    </div>



  );

}

export default Main;




















