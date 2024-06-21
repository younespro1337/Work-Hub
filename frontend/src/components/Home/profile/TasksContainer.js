import React, {useState, useEffect } from 'react';
import { getTasks, handleUpdateTaskStatus } from '../../../actions/userAction';
import { Typography, Grid, Card, CardHeader, CardContent, CardActions, CardMedia, IconButton, Collapse, Avatar, Paper, AvatarGroup, Tooltip} from '@mui/material';
import { blue , red, orange, yellow, green, grey} from '@mui/material/colors';
import { formatDate } from '../../../utils/DateFormat';
import { Check, AssignmentTurnedIn, ExpandMore } from '@mui/icons-material';
import Loading from '../../Layouts/loading';
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import { useSelector, useDispatch } from 'react-redux';
import MediaDisplay from './MediaDisplay';
import LongMenu from './LongMenu'
import { SET_TASKS_DETAILS } from '../../../constants/userConstant';









const TasksContainer = () => {
  const [expandedId, setExpandedId] = React.useState(null);
  const defaultTaskImageUrl = 'https://i.ytimg.com/vi/RmOPsLj_3U0/maxresdefault.jpg'
  const [teamMembers, setTeamMembers ] = useState([])
  const [isStartTask, setIsStartTask ] = useState(false);
  const [Me, setMe ] = useState({})
  const [loading, setLoading ] = useState(true)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tasks , setTasks ] = useState([]);
  const user = useSelector((state) => state.user.user); 



  useEffect(() => {
    let isMounted = true;
   
    const fetchTasks = async () => {
      try {

        const tasksData = await getTasks(user._id);
        dispatch({
            type:SET_TASKS_DETAILS,
            payload:tasksData
        });
        const tasks = tasksData.tasks;
        const workersData = tasksData.workersData;
        setLoading(false)
        if (isMounted) {
          setTasks(tasks);
          setTeamMembers(workersData);
          setMe(user);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false)
      }
    };
  
    fetchTasks();
  
    return () => {
      isMounted = false;
    };
  }, []);
  



  const handleUpdateTasks = (updatedTasks) => {
    setTasks(updatedTasks)
  }


  const handleExpandClick = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };





  const getAvatarColor = (index) => {
    const colors = [blue[500], red[500], orange[500], yellow[500], green[500]];
    return colors[index % colors.length];
  };



  const handleSelectMember = (member) => {
    console.log('member:', member);
    dispatch({
      type: 'SET_SELECTED_MEMBER_DETAILS',
      payload: member,
    });
    navigate('/inbox');
    localStorage.setItem('selectedMember', member._id);
    localStorage.setItem('memberDetails', JSON.stringify(member));
  };



  const updateTaskStatus = async (task) => {
    try {
      const updatedTasksData = await handleUpdateTaskStatus(task, user._id);
    
     setTasks(updatedTasksData)
      // Replace the old task object with the updated task in the tasks state 
      setIsStartTask(true);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  
  
  

  



  return (
   
    <Grid container spacing={2} sx={{ margin: '1rem auto', width: '100%', justifyContent:'space-around' }}>
      {loading ? (
     <Loading />
      ) : (
        
        tasks && tasks.length > 0 && tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={task._id}>
              {/* {console.log('task:',task)} */}
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              style={{ 
                height: '100%'

               }}
            >
              <Card sx={{ maxWidth: 345 }}>
  
              <CardHeader
    avatar={
      <AvatarGroup max={3}>
        {task.worker.map((workerId, index) => {
          const worker = teamMembers.find(member => member._id === workerId);
          return (
            <Avatar 
              key={workerId}
              alt={`${worker?.firstName || 'R'} ${worker?.lastName || ''}`}
              src={worker?.avatar.url || ''}
              sx={{ bgcolor: getAvatarColor(index) }} 
            >
              {worker?.firstName.charAt(0) || 'R'}
            </Avatar>
          );
        })}
      </AvatarGroup>
    }
    action={
      // <LongMenu
      <LongMenu 
      taskId={task._id}
      userId={user._id}
      tasks={tasks}
      onUpdateTasks={handleUpdateTasks}


    />
    


    }
    title={task.title}
    subheader={formatDate(task.createdAt)}
  />
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  {/* {console.log('task:',task)} */}
                  <CardMedia
                  component="img"
                  height="194" 
                  image={defaultTaskImageUrl}
                  alt="Task Image"
                 
                />
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  <CardContent>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary">
          <strong>Description:</strong> {task.description}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary">
          <strong>Status:</strong>  {task.status}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary">
          <strong>Expectation:</strong> {task.expectation}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary">
          <strong>Deadline:</strong> {task.deadlineDays}
        </Typography>
      </Grid>
    </Grid>
  </CardContent>
  
  
  
  
  
  
  
  
  
  <CardActions disableSpacing>
    {task.status === 'pending' && (
      <Tooltip title="Accept Task">
        <IconButton 
          aria-label="accept task" 
          onClick={() => updateTaskStatus(task)}
          style={{ color: green[500]}}
        >
          <AssignmentTurnedIn  />
        </IconButton>
      </Tooltip>
    )}
    {task.status === 'in progress' && (
      <Tooltip title="Mark as Done">
        <IconButton 
          aria-label="done" 
          onClick={() => updateTaskStatus(task._id)}
          style={{ color: blue[500] }}
        >
          <Check />
        </IconButton>
      </Tooltip>
    )}
    <Tooltip title={expandedId === task._id ? "Hide Details" : "Show Details"}>
      <IconButton
        aria-label="show more"
        onClick={() => handleExpandClick(task._id)}
        aria-expanded={expandedId === task._id}
        style={{ color: grey[500] }}
      >
        <ExpandMore />
      </IconButton>
    </Tooltip>
  </CardActions>
  
  
  
  
  
  
                <Collapse in={expandedId === task._id} timeout="auto" unmountOnExit>
  
  
  
  
  
                  <CardContent>
  
  
  <Typography paragraph>Your Team Members:</Typography>
  {teamMembers.map((worker) => {
    if (worker._id !== Me._id) {
      return (
        <Paper elevation={3} style={{ padding: '0.5rem', marginBottom: '0.5rem', width: '-webkit-fit-content' }} key={worker._id}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Tooltip
                title={`Role: ${worker.role}`}
                style={{ fontSize: '1rem', border: '1px solid #ccc', width: 'fit-content', textAlign: 'center' }}
              >
                <Avatar
                  aria-label="worker"
                  alt={`${worker.firstName} ${worker.lastName}`}
                  src={worker.avatar.url}
                  style={{ backgroundColor: blue[500] }}
                >
                  {worker.firstName ? worker.firstName.charAt(0) : 'R'}
                </Avatar>
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography variant="body2">{`${worker.firstName} ${worker.lastName}`}</Typography>
            </Grid>
            <Grid item>
              <Tooltip
              title={`Inbox: ${worker.firstName}`}
              style={{ fontSize: '1rem', border: '1px solid #ccc', width: 'fit-content', textAlign: 'center' }}
              >
  
              <IconButton
                aria-label="go to inbox"
                onClick={() => {
                  handleSelectMember(worker);
                }}
                style={{ color: blue[500] }}
              >
  
                <ChatIcon color='secondary' />
              </IconButton>
              </Tooltip>
  
            </Grid>
          </Grid>
        </Paper>
      );
    }
    return null;
  })}
  
  
  
  
  
  
  
  
  
  
  
  
  
  
                  </CardContent>
                  <MediaDisplay task={task} />
  
                </Collapse>
  
  
  
  
  
  
  
              </Card>
            </Grid>
          </Grid>
        ))
      )}
     
    </Grid>
  );
};

export default TasksContainer;
