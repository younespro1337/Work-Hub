import { io } from 'socket.io-client';
import React, {  useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, List, ListItem, Divider, ListItemText, ListItemAvatar, Typography, Menu, ListItemSecondaryAction, IconButton, Tooltip } from '@mui/material/';
import { handleApproveRequest, handleConfirmRequest, handleRejectRequest } from '../../../actions/userAction';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import CustomSnackbar from '../../Layouts/Snackbar';
import { useSocket } from '../../../actions/socketService';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');



function Notifications({ open, close ,requestData , loading }) {
  const Ruser = useSelector(state => state.user.user);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

const socket = useSocket('materialRequestsUpdate', (data) => {
console.log("materialRequestsUpdate", data)
  });

  function handleCloseSnackbar(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  }



  const handleApprove = async (requestId) => {
    console.log('run approve');
    try {
      const userId = Ruser._id
      socket.emit('materialRequest', { userId });
      const data = await handleApproveRequest(requestId);
      console.log('handleApprove data:', data);
      setSnackbarSeverity('success');
      setSnackbarMessage('Request approved successfully.');
    } catch (error) {
      console.error('Error approve Request:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('An error occurred while approving the request.');
    } finally {
      setSnackbarOpen(true);
    }
  };
  

  const handleConfirm = async () => {
    try {
      const userId = Ruser._id
      socket.emit('materialRequest', { userId });
      const data = await handleConfirmRequest(Ruser)
      console.log('handle Confirm', data); 
    } catch (error) {
      console.error('Error sending confirmation:', error);
    }
};



const  handleReject = async () =>   {
    try {
      const userId = Ruser._id
      socket.emit('materialRequest', { userId });
      const data = await handleRejectRequest(Ruser);
      console.log('handleRejectData:', data)
    } catch (error) {
      console.error('error handleReject')
    }
}






const defaultStyles = {
  width: '70vh', 
  maxHeight: '20vh', 
  bgcolor: 'background.paper',
  overflowY: 'auto',
  padding: '20px',
  borderRadius: '10px',
  left: 'unset', 
  right: '0', 
};



  return (
    <>
    <Menu
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClose={close}
      className="notifications-container"
    >

       <List sx={{...defaultStyles}}> 

{requestData?.requests?.map((request, index) => (
  // Check if the status is not "approved" or the requesterId does not match the current user's ID
  !(request.status === 'approved' && request.requesterId !== Ruser._id) && (
    <React.Fragment key={request?.requestId}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar 
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Avatar alt={request?.requesterName} src={request?.requesterAvatar} />
          <Avatar alt={request?.requesterName} src={request?.materialPicture} />
        </ListItemAvatar>

        <ListItemText
          primary={request?.materialName}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline', m:'0 15px 0 0'}}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {request.requesterName}
              </Typography>
              {' — '} {request?.message}
            </React.Fragment>
          }
        />



        
<ListItemSecondaryAction>
                {request.status === 'pending' && (
                  <React.Fragment>

                    <Tooltip title="Approve">
                      <IconButton edge="end" aria-label="approve" onClick={() => handleApprove(request.requestId)}>
                          <CheckIcon color='primary' />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Reject">
                      <IconButton edge="end" aria-label="reject" onClick={handleReject}>
                        <CloseIcon color='secondary' />
                      </IconButton>
                    </Tooltip>
                  </React.Fragment>
                )}
                {request.status === 'approved' && (
                  <Tooltip title="Confirm Material">
                    <IconButton edge="end" aria-label="confirm-material" onClick={handleConfirm}>
                      <ThumbUpOffAltIcon color='primary' />
                    </IconButton>
                  </Tooltip>
                )}
              </ListItemSecondaryAction>


      </ListItem>
      <Divider variant="inset" component="li" />
    </React.Fragment>
  )
))}



      
  </List>

    </Menu>

     <CustomSnackbar
        open={snackbarOpen}
        handleClose={handleCloseSnackbar}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </>
  );
}

export default Notifications;
