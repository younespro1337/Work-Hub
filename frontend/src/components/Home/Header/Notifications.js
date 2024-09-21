import { io } from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Avatar, List, ListItem, Divider, ListItemText, ListItemAvatar, Typography, Menu, 
  ListItemSecondaryAction, IconButton, Tooltip
} from '@mui/material/';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import CustomSnackbar from '../../Layouts/Snackbar';
const socket = io('http://localhost:5000');


function Notifications({ open, close, requestData }) {
  const Ruser = useSelector(state => state.user.user);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    socket.on('materialRequestsUpdate', (data) => {
      console.log('materialRequestsUpdate', data);
    });

    return () => {
      socket.off('materialRequestsUpdate');
    };
  }, []);

  const handleApprove = async (requestId) => {
    try {
      const userId = Ruser._id;
      socket.emit('materialRequest', { userId });
      // Approve logic...
      setSnackbarSeverity('success');
      setSnackbarMessage('Request approved successfully.');
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage('An error occurred while approving the request.');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleConfirm = async () => {
    try {
      const userId = Ruser._id;
      socket.emit('materialRequest', { userId });
      // Confirm logic...
    } catch (error) {
      console.error('Error sending confirmation:', error);
    }
  };

  const handleReject = async () => {
    try {
      const userId = Ruser._id;
      socket.emit('materialRequest', { userId });
      // Reject logic...
    } catch (error) {
      console.error('Error handleReject:', error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const defaultStyles = {
    width: '400px',
    maxHeight: '50vh', // Set a fixed height for the list container
    overflowY: 'auto', // Enable scrolling if the content exceeds max height
    padding: '20px',
    bgcolor: 'background.paper',
    borderRadius: '10px',
  };




  return (
    <>
       <Menu 
        anchorOrigin={
          { vertical: 'top', horizontal: 'right' } 
          
        }
        transformOrigin={
           { vertical: 'top', horizontal: 'right' }  
        }
        open={open}
        onClose={close}
        PaperProps={{
          style: {
            maxHeight: '60vh', 
            overflowY: 'auto', 
            width: '400px', 
          },
        }}
      >
        <List sx={{ ...defaultStyles }}>
          {requestData?.requests?.map((request, index) => (
            !(request.status === 'approved' && request.requesterId !== Ruser._id) && (
              <React.Fragment key={request?.requestId}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={request?.requesterName} src={request?.requesterAvatar} />
                    <Avatar alt={request?.requesterName} src={request?.materialPicture} />
                  </ListItemAvatar>

                  <ListItemText
                    primary={request?.materialName}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline', m: '0 15px 0 0' }}
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
                      <>
                        <Tooltip title="Approve">
                          <IconButton edge="end" aria-label="approve" onClick={() => handleApprove(request.requestId)}>
                            <CheckIcon color="primary" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Reject">
                          <IconButton edge="end" aria-label="reject" onClick={handleReject}>
                            <CloseIcon color="secondary" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {request.status === 'approved' && (
                      <Tooltip title="Confirm Material">
                        <IconButton edge="end" aria-label="confirm-material" onClick={handleConfirm}>
                          <ThumbUpOffAltIcon color="primary" />
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
