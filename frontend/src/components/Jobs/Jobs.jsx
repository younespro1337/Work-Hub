import axios from 'axios'
import { useEffect, useState } from 'react'
import React from 'react'
import './Jobs.css'
import Loading  from '../Layouts/loading'
import { getAllJobs } from '../../actions/userAction'
import { formatDate } from '../../utils/DateFormat'
import {   
  Avatar,
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Button, 
  Dialog, 
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,

 } from '@mui/material';
 import CountertopsIcon from '@mui/icons-material/Countertops';
 import { useFormik } from 'formik'
 import * as Yup from 'yup';

 const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  message: Yup.string()
    .required('Message is required')
    .min(50, 'Message must be at least 50 characters'),
});




const Jobs = () => {
  const [jobPosts, setJobPosts] = useState([])
  const [loading, setLoading ] = useState(true)
  const [isFormOpen , setIsFormOpen ] = useState(false);

 

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validationSchema: validationSchema, // Add the validation schema here
    onSubmit: async (values) => {
      // This function will only be called if the form passes validation
      console.log('Form submitted with values:', values);
      // Call your form submission logic here (e.g., handleCreateTask)
    },
  });




  useEffect(() => {
    fetchJobPosts()
  }, [])

  const fetchJobPosts = async () => {
    try {
      const response = await getAllJobs()
      // console.log(response.data)
      setJobPosts(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching job posts:", error)
    }
  }


  const handleOpenDialog = (jobId) => {
    setIsFormOpen(true)
    setJobPosts((prevJobPosts) =>
      prevJobPosts.map((jobPost) => {
        if (jobPost._id === jobId) {
          return {
            ...jobPost,
            showApplyForm: true
          }
        }
        return {
          ...jobPost,
          showApplyForm: false
        }
      })
    )
  }


  const handleSubmit = (e, jobId) => {
    e.preventDefault();
    const fileInput = e.target.elements.file;
    const file = fileInput.files[0];
    if (file && !isFileValid(file)) {
      alert('Only PDF or Word documents are allowed.');
      return;
    }
    const name = e.target.elements.name.value;
    const email = e.target.elements.email.value;
    const message = e.target.elements.message.value;
    // Create a FormData object
    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobId", jobId);
    formData.append("name", name)
    formData.append("email", email)
    formData.append("message", message)

    // Send a POST request to the backend server
    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };
    
    axios.post("/api/v1/applyJob", formData, config)
      .then(response => {
        console.log("Form submission successful:", response.data);
        // Reset form fields after successful submission
        e.target.reset();
        setJobPosts(prevJobPosts =>
          prevJobPosts.map(jobPost => {
            if (jobPost._id === jobId) {
              return {
                ...jobPost,
                showApplyForm: false
              };
            }
            return jobPost;
          })
        );
      })
      .catch(error => {
        console.error("Error submitting form:", error);
      });
  };
  
  const isFileValid = (file) => {
    const acceptedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    return acceptedFileTypes.includes(file.type)
  }

  if(loading){
    return <Loading /> 
  }

  return (
    <div style={{display: 'flex', justifyContent:'center', flexDirection:'column',alignItems: 'center'}}>
      {jobPosts &&jobPosts.length > 0 ? (
        jobPosts.map((jobPost) => (
         <div key={jobPost._id} style={{width:'60%', marginBottom:'20px'}}>
          <Card key={jobPost._id}>
            <CardContent>

            <Typography variant='h5' component='div'>
              {jobPost.title}
            </Typography>
            <Typography >{jobPost.description}</Typography>

            <List>

              {jobPost.requirements.map((requirement, index) => (
                <ListItem key={index}>
                <ListItemText key={requirement} /> 
                </ListItem>
              ))}
            </List>

            <Typography>
              Email: {jobPost.applicationDetails.email}
            </Typography>
            <Typography>
              Phone: {jobPost.applicationDetails.phone}
            </Typography>
            <Typography >
  <span>Created At:</span> {`${formatDate(jobPost.createdAt)}`}
</Typography>


          <IconButton>
            <CountertopsIcon color='primary'/>
            Applied:<Typography variant='h5' color='primary' component='span' >{jobPost.counter}</Typography>
          </IconButton>
             <IconButton>
              <Button  onClick={() => handleOpenDialog(jobPost._id)} color='primary' variant='contained'>
                Apply For this Job
              </Button>
             </IconButton>

<Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} key={jobPost._id}>
  <DialogTitle>Please Fill the Info Here</DialogTitle>
  <DialogContent>
    <form  onSubmit={(e) => handleSubmit(e, jobPost._id)} encType="multipart/form-data">
      <TextField
        label="Full Name"
        fullWidth
        name="name"
        required
        inputProps={{ minLength: 4, maxLength: 50 }}
        placeholder="Enter Your Name"
        sx={{
          marginBottom:'4%'
        }}
      />
      <TextField
        label="Email"
        fullWidth
        type="email"
        name="email"
        required
        placeholder="Enter Your Email"
        sx={{
          marginBottom:'4%'
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' , flexDirection:'row', marginBottom:'4%'}}>
  <label htmlFor="file">
    <Avatar sx={{ marginRight: 1, backgroundColor: 'primary.main' }}>
      <CountertopsIcon />
    </Avatar>
  </label>
  <input type="file" id="file" name="file" required accept=".pdf,.doc,.docx" style={{ display: 'none' }} />
  <Button
    variant="contained"
    component="label"
    color="primary"
    htmlFor="file"
    sx={{ marginLeft: 1 }}
  >
    Upload CV*
  </Button>
</Box>

      <TextField
        label="Message"
        fullWidth
        multiline
        name="message"
        required
        placeholder="Your Message"
        sx={{
          marginBottom:'4%'
        }}
      />
      <Button type="submit" className="btn" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  </DialogContent>
</Dialog>
</CardContent>

          </Card>
          </div>
        ))
      ) : (
        <p>No job posts found</p>
      )}
    </div>
  )
};

export default Jobs
