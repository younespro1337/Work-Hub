import React, { useEffect, useState , useRef } from 'react';
import { getAllUsers } from '../../../actions/userAction';
import SideBar from '../SideBar/SideBar';
import { formatDate } from '../../../utils/DateFormat';
import { DataGridComponent } from './DataGridComponent';
import TaskDialog from './TaskDialog';
import { AddWorkerForm } from './WorkerFormDialog';
import { useSelector } from 'react-redux';
import {   
  Alert,
  Snackbar, 
 } from '@mui/material';
const Main = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskPopupOpen, setTaskPopupOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState([]);
  const [adminId ,setAdminId] = useState('')
  const dataGridRef = useRef(); 
  const [snackbarMessage,setSnackbarMessage] = useState('')
  const [isAddWorkerDialogOpen, setIsAddWorkerDialogOpen ] = useState(false)
  

const OpenWorkerDialog = () => {
  setIsAddWorkerDialogOpen(true);
};



const fetchWorkersData = (users) => {
  const updatedRows = users.map((user, index) => ({
    id: user._id,
    fullName: user?.name || `${user?.firstName} ${user?.lastName}`,
    phoneNumber: user.phoneNumber,
    email: user.email,
    gender: user.gender,
    role: user.role,
    registerAt: formatDate(user.registerAt),
    avatar: user.avatar.url,
  }));
  return updatedRows;
};


useEffect(() => {
  let isMounted = true;

  const fetchWorkers = async () => {
    try {
      const data = await getAllUsers();
       console.log(data.users)
       const updatedRows = fetchWorkersData(data.users);
      if (isMounted) {
        setWorkers(updatedRows);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchWorkers();

  return () => {
    isMounted = false;
  };
}, []);




const updateWorkers = (updatedWorkerIds, message) => {
  console.log('updateWorkerid:', updatedWorkerIds, 'updateWorkerMessage:', message);
  const updatedWorkers = workers.filter(worker => worker.id !== updatedWorkerIds);
  setWorkers(updatedWorkers);
  setSelectedWorkerIds(updatedWorkerIds);
  setSnackbarMessage(message);
  setSnackbarOpen(true);
};

const setAdminValue = (adminId) =>  {
  setAdminId(adminId);  // Corrected the function name
};


const addNewWorker = (users) => {
  const updateWorkers = fetchWorkersData(users)
  setWorkers(updateWorkers);
};




return (
  <div className='wrapper'>

  {/* <SideBar/> */}
  <SideBar openAddWorkerDialog={OpenWorkerDialog} />


  <DataGridComponent
    workers={workers}
    loading={loading}
    dataGridRef={dataGridRef}
    selectedWorkerIds={selectedWorkerIds}
    isTaskOpen={isTaskPopupOpen}
    updateWorkers={updateWorkers}
    setAdminId={setAdminValue} 
    setIsTaskOpen={setTaskPopupOpen}
    setSelectedWorkerIds={setSelectedWorkerIds}
/>

<TaskDialog
    isTaskOpen={isTaskPopupOpen}
    selectedWorkerIds={selectedWorkerIds}
    adminWorker={adminId}
    setIsTaskOpen={setTaskPopupOpen}
    setSnackbarOpen={setSnackbarOpen}
    setSnackbarMessage={setSnackbarMessage}
/>

<AddWorkerForm 
  isAddWorkerDialogOpen={isAddWorkerDialogOpen}
  onClose={() => setIsAddWorkerDialogOpen(false)}
  addNewWorker={addNewWorker}
/>


      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          { snackbarMessage || 'Data sent successfully!'}
        </Alert>
      </Snackbar>





    </div>
  );
};

export default Main;