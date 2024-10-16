import React, { useState, useRef } from "react";
import axios from 'axios';
import { Alert, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, Avatar, FormControl, InputLabel, Select, MenuItem, IconButton} from '@mui/material';
import { uploadFileToCloudinary } from "../../../actions/UploadMedial";
import { useFormik } from 'formik';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { addWorkerFormSchema } from "../../Auth/validationShemas";
import CustomSnackbar from "../../Layouts/Snackbar";

export const AddWorkerForm = ({isAddWorkerDialogOpen, onClose, addNewWorker}) => {
  const [avatarPreview, setAvatarPreview] = useState('');
  const avatarInputRef = useRef(null);
  const [avatarData, setAvatarData] = useState({});
  const defaultPassword = "example123"; 
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarOpen = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  const handleClose = () => {
    setAvatarPreview('');
    setAvatarData({}); 
    onClose(); 
  };


  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      position: '',
      salary: '',
      email: '',
      gender: '',
      avatar: '',
      nationalId: '',
      phoneNumber: '',
      legalInfo: '',
      password: defaultPassword
    },
    validationSchema: addWorkerFormSchema,
    onSubmit: async (values) => {
      // console.log('Formik Submit:', values);
      try {
        const file = avatarInputRef.current.files[0];
        let avatarUrl = null;
        if (file) {
          avatarUrl = await uploadFileToCloudinary(file);
          // console.log('Avatar URL:', avatarUrl.url);
          setAvatarData({
            url: avatarUrl.url,
            publicId: avatarUrl.public_id
          });
        }
        const postData = {
          ...values,
          avatar: avatarData  
        };
        const res = await axios.post("/api/v1/register", postData);
        // console.log('API Response:', res.data);
        const users = res.data.data
        addNewWorker(users);
        handleSnackbarOpen("success", "Worker  Created successfully!");
        formik.resetForm();
        setAvatarPreview('');
        setAvatarData({}); 
      } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        handleSnackbarOpen("error", error.response ? error.response.data.message : error.message);
      }
    },
    
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        formik.setFieldValue('avatar', file);
      };
    }
  };

  const handleGenderChange = (e) => {
    formik.setFieldValue('gender', e.target.value);
  };

  const handleDeleteAvatar = () => {
    setAvatarPreview('');
    setAvatarData({})
    formik.setFieldValue('avatar', null);
  };


  return (
    <>
      <Dialog 
        open={isAddWorkerDialogOpen} 
        onClose={handleClose} 
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Register Worker</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Box marginBottom="20px">
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Box>
            <Box marginBottom="20px">
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Box>
            <Box marginBottom="20px">
              <TextField
                fullWidth
                id="position"
                name="position"
                type="text"
                label="Position"
                value={formik.values.position}
                onChange={formik.handleChange}
              />
            </Box>
            <Box marginBottom="20px">
              <TextField
                fullWidth
                id="salary"
                name="salary"
                type="number"
                label="Salary"
                value={formik.values.salary}
                onChange={formik.handleChange}
                error={formik.touched.salary && Boolean(formik.errors.salary)}
                helperText={formik.touched.salary && formik.errors.salary}
              />
            </Box>
            <Box marginBottom="20px">
              <TextField
                fullWidth
                id="email"
                name="email"
                type="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Box>
            <Box marginBottom="20px">
              <FormControl fullWidth required error={formik.touched.gender && Boolean(formik.errors.gender)}>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  label="Gender"
                  value={formik.values.gender}
                  onChange={handleGenderChange}
                >
                  <MenuItem value="">Select gender</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {formik.touched.gender && formik.errors.gender && (
                  <Alert severity="error">{formik.errors.gender}</Alert>
                )}
              </FormControl>
            </Box>
            <Box marginBottom="20px" display="flex" alignItems="flex-start" flexDirection="row" justifyContent="space-between">
              <input
                ref={avatarInputRef}
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar">
                <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} fullWidth>
                  Upload Avatar
                </Button>
              </label>
              {avatarPreview && (
                <Box marginLeft="20px" display="flex" alignItems="center">
                  <Avatar src={avatarPreview} alt="Avatar Preview" style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                  <IconButton onClick={handleDeleteAvatar} aria-label="delete" size="small">
                    <DeleteIcon color="secondary"/>
                  </IconButton>
                </Box>
              )}
              {formik.touched.avatar && formik.errors.avatar && (
                <Box marginLeft="20px">
                  <Alert severity="error">{formik.errors.avatar}</Alert>
                </Box>
              )}
            </Box>
            <Box marginBottom="20px">
              <TextField
                fullWidth
                id="nationalId"
                name="nationalId"
                type="text"
                label="National ID Number"
                value={formik.values.nationalId}
                onChange={formik.handleChange}
              />
            </Box>
            <Box marginBottom="20px">
              <TextField
                fullWidth
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                label="Phone Number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
              />
            </Box>
            <Box marginBottom="20px">
              <TextField
                fullWidth
                id="legalInfo"
                name="legalInfo"
                multiline
                rows={4}
                label="Legal Information"
                value={formik.values.legalInfo}
                onChange={formik.handleChange}
                error={formik.touched.legalInfo && Boolean(formik.errors.legalInfo)}
                helperText={formik.touched.legalInfo && formik.errors.legalInfo}
              />
            </Box>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button 
                color="primary" 
                type="submit"
              >
                Add Worker
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>


      <CustomSnackbar 
        open={isSnackbarOpen} 
        handleClose={handleCloseSnackbar} 
        severity={snackbarSeverity} 
        message={snackbarMessage}
      />


    </>
  );
};
