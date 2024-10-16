import * as React from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Paper,
  Avatar,
  IconButton,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import {
  blue
} from '@mui/material/colors';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ForwardToInboxTwoToneIcon from '@mui/icons-material/ForwardToInboxTwoTone';
import { ExpandMore } from './ExpandMore';
import { getProducts , sendRequest, updateProduct} from '../../../actions/productaction';
import { formatDate } from '../../../utils/DateFormat';
import Loading from '../../Layouts/loading'
import CustomSnackbar from '../../Layouts/Snackbar';
import openSocket from 'socket.io-client';
import { useSocket } from '../../../actions/socketService';
import { Suspense } from 'react';
import AppAppBar from '../../NewHome/components/AppAppBar';
const socket = openSocket('http://localhost:5000');


export default function RecipeReviewMaterials() {
  const [expandedId, setExpandedId] = React.useState(null);
  const [materials, setMaterials] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [resUpdate, setResUpdate] = React.useState(false)
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [snackBarSeverity, setSnackBarSeverity] = React.useState('success');
  const [snackBarMessage, setSnackBarMessage] = React.useState('');

  const socket = useSocket('updateMaterialRequests', (data) => {
    console.log('data socket:' , data)
    // const requests = data?.requestData;
    // setRequestData(requests);
  });

  

  
  const handleSendRequest = async (e, userId, materialId) => {
    e.preventDefault();
    const requesterId = JSON.parse(localStorage.getItem('user'))._id; 
     
    try {
      // Emit materialRequest event to server using socket.io
      socket.emit('materialRequest', { userId });
      const data = await sendRequest(requesterId, materialId, userId); 
      setSnackBarSeverity('success');
      setSnackBarMessage(`Request sent successfully for ${data.material.name}!`);
      setSnackBarOpen(true);
    } catch (error) {
      console.log(error);
      setSnackBarSeverity('error');
      setSnackBarMessage(error.message);
      setSnackBarOpen(true);
    }
  };


  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  React.useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await getProducts();
        // console.log('card data:', data.products);
        if (!resUpdate) {
          setMaterials(data.products);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
  
    fetchMaterials();
  
    return () => {
      // Unsubscribe or cancel any subscriptions/tasks here
    };
  }, []);
  


  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);
  };
  

  
  


const handleGetMaterial = async (material) => {
  const { _id: productId } = material;
  const userIdLS = JSON.parse(localStorage.getItem('user'))._id;
  try {
    const data = await updateProduct(productId, userIdLS);
    setMaterials(data);
  } catch (error) {
  }
};



  return (
    <>
    <Suspense fallback={<Loading />}>
      <Grid container
      spacing={2} 
      sx={{ 
       margin: '1rem auto',
       width:'100%'
     }}
     >
       {materials && materials.length > 0 &&  materials.map((material, index) => (
         <Grid 
         item 
         xs={12} 
         sm={6} 
         md={4} 
         lg={3}
         key={material._id}
         >
           <Grid
           container
           alignItems="center"
           justifyContent="center"
           style={{
             
             height:"100%"
           
           }}
           >
 
           <Card sx={{ maxWidth: 345 }}>
             <CardHeader
               avatar={
                 <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe" src={material?.admin?.avatar}>
                  {material?.admin?.firstName ? material.admin.firstName.charAt(0) : 'R'}

                 </Avatar>
               }
               action={
                 <IconButton aria-label="settings">
                   <MoreVertIcon />
                 </IconButton>
               }
               title={material?.name}
               subheader={formatDate(material?.createdAt)}
             />
             <CardMedia
               component="img"
               height="194"
               image={material?.images?.url}
               alt="Paella dish"
               sx={{
                 width:'65%'
               }}
             />
             <CardContent>
               <Typography variant="body2" color="text.secondary">
                 Stock: {material?.stock}
               </Typography>
               <Typography variant="body2" color="text.secondary">
                 {material?.description}
               </Typography>
             </CardContent>
             <CardActions disableSpacing>
              {material.stock > 0 && (
                <IconButton aria-label="download to packet" onClick={() => {
                  handleGetMaterial(material)
                }}>
                   <DownloadIcon />
             </IconButton>
              )}
             
               <IconButton aria-label="share">
                 <ShareIcon />
               </IconButton>
               <ExpandMore
                 expand={expandedId === material._id}
                 onClick={() => handleExpandClick(material._id)}
                 aria-expanded={expandedId === material._id}
                 aria-label="show more"
               >
                 <ExpandMoreIcon />
               </ExpandMore>
             </CardActions>
             <Collapse in={expandedId === material._id} timeout="auto" unmountOnExit>
               <CardContent>

                 <Typography paragraph>USED BY:</Typography>

{material.users.map((user, index) => (
  <Paper elevation={3} style={{ padding: '0.5rem', marginBottom: '0.5rem'}} key={user._id}>
    <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <Avatar src={user?.avatar} aria-label="recipe" alt={`${user?.firstName} ${user?.lastName}`} >
          {user?.firstName ? user.firstName.charAt(0) : 'R'}
           </Avatar>
      </Grid>
      <Grid item>
        <Typography variant="h6">{`${user?.firstName} ${user?.lastName}`}</Typography>
        <Typography variant="body2">{user?.email}</Typography>
        <Typography variant="body2">Taken at: {formatDate(user?.takenAt)}</Typography>
      </Grid>
      <Grid item xs={12}> 
       <Button 
  variant="contained" 
  color="primary" 
  startIcon={<ForwardToInboxTwoToneIcon />}
  onClick={(e) => handleSendRequest(e, user.userIdLS , material._id)}
  size="small"  
>
  Send Request
</Button>

      </Grid>
    </Grid>
  </Paper>
))}

               </CardContent>
             </Collapse>
           </Card>
           </Grid>
         </Grid>
       ))}

<CustomSnackbar 
  open={snackBarOpen} 
  handleClose={handleCloseSnackBar} 
  severity={snackBarSeverity} 
  message={snackBarMessage} 
/>

     </Grid>
     </Suspense>
     </>
     

  );
}
