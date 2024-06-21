import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneIcon from '@mui/icons-material/Done';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CallIcon from '@mui/icons-material/Call';
import { handleUpdateTaskStatus } from '../../../actions/userAction';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { green, blue, red, orange } from '@mui/material/colors';

const options = [
  { label: 'Accept', icon: <CheckCircleIcon />, action: 'Accept', color: green[500] },
  { label: 'Done', icon: <DoneIcon />, action: 'Done', color: blue[500] },
  { label: 'Delete', icon: <DeleteIcon />, action: 'Delete', color: red[500] },
  { label: 'Feedback', icon: <FeedbackIcon />, action: 'Feedback', color: blue[500] },
  { label: 'Problem', icon: <ReportProblemIcon />, action: 'Problem', color: blue[500] },
  { label: 'Call Center', icon: <CallIcon />, action: 'Call Center', color: blue[500] },
];

const ITEM_HEIGHT = 48;

export default function LongMenu({ taskId , userId, tasks, onUpdateTasks }) {
  const [updatedTasks, setUpdatedTasks] = React.useState(tasks);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  }; 


  const handleClose = () => {
    setAnchorEl(null);
  };


 
  const handleOptionClick = async (option) => {
    handleClose();
    try {
      let actionToSend;
      if (option.action === 'Delete') {
        // If the action is 'Delete', keep it as is
        actionToSend = option.action;
      } else if (option.action === 'Accept' || option.action === 'Done') {
        // For "Accept" or "Done", send undefined
        actionToSend = undefined;
      } else {
        // For other actions, return without performing any action
        return;
      }
      // Call handleUpdateTaskStatus based on the action
      const updatedTasks = await handleUpdateTaskStatus(taskId, userId, actionToSend);
      // Pass the updated tasks back to TasksContainer
      onUpdateTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  
  

  



  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
  {options.map((option) => (
  // Check if the option should be displayed based on the task status
  <MenuItem 
    key={option.label} 
    onClick={() => handleOptionClick(option)}
    style={{ 
      display: 
        (option.action === 'Accept' && tasks.find(task => task._id === taskId)?.status === 'in progress') ||
        (option.action === 'Done' && tasks.find(task => task._id === taskId)?.status === 'pending') ||
        (tasks.find(task => task._id === taskId)?.status === 'completed' && (option.action === 'Accept' || option.action === 'Done'))
        ? 'none' : 'flex',
    }}
  >
    <IconButton color='secondary' >            
      {React.cloneElement(option.icon, { style: { color: option.color } })}
    </IconButton>
    {option.label}
  </MenuItem>
))}




      </Menu>
    </div>
  );





}
