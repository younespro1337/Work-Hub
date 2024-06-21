import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, FormControl, InputLabel, Select, MenuItem , Alert, Avatar, IconButton, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import { uploadFileToCloudinary } from "../../../actions/UploadMedial";
import { addMaterialsSchema } from "../../Auth/validationShemas";
import CustomSnackbar from "../../Layouts/Snackbar";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import axios from "axios";

const MaterialsFormDialog = ({  isAddMaterialsDialogOpen, onClose, updateMaterials }) => {
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [imageData, setImageData] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const avatarInputRef = useRef(null);

  const handleSnackbarOpen = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClose = () => {
    setImagePreview('');
    setImageData({}); 
    onClose(); 
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImagePreview(reader.result);
        formik.setFieldValue('image', file); 
      };
    }
  };

  const formik = useFormik({
    initialValues: {
      name:'',
      description:'',
      category:'',
      stock:'',
      image:''
    },
    validationSchema: addMaterialsSchema,
    onSubmit: async (values) => {
      console.log('Formik Submit:', values);
      try {
        const file = avatarInputRef.current.files[0];
        let image = null;
        let publicId = null;
        if (file) {
          const uploadResponse = await uploadFileToCloudinary(file);
          console.log('Material Image URL:', uploadResponse);
          image = uploadResponse.url;
          publicId = uploadResponse.public_id;
        }
        
        const postData = {
          ...values,
          image,
          publicId
        };
    
        const res = await axios.post("/api/v1/admin/material/new", postData);  
        console.log('API Response:', res.data);
        const newMaterial = res.data.allMaterials;
        updateMaterials(newMaterial);
        handleSnackbarOpen("success", "Material Created successfully!");
        formik.resetForm();
        setImagePreview('');
        setImageData({}); 
      } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        handleSnackbarOpen("error", error.response ? error.response.data.message : error.message);
      }
    },
    
  });

  const handleDeleteImage = () => {
    setImagePreview('')
  };

  return (
    <>    
      <Dialog 
        open={isAddMaterialsDialogOpen} 
        onClose={handleClose} 
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Materials...</DialogTitle>
        <DialogContent>
          <Box margin="20px 0 20px 0">
            <FormControl fullWidth required>
              <InputLabel id="list-option-label">Choose a Category:</InputLabel>
              <Select
                fullWidth
                labelId="list-option-label"
                id="list-option"
                name="category"
                label="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                <MenuItem id="intro-optn" value="--Please choose a Category">--Please choose a Category</MenuItem>
                <MenuItem value="cutting">Product</MenuItem>
                <MenuItem value="setting">Material</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <Box marginBottom="20px">
              <TextField
                fullWidth
                id="name"
                name="name"
                type="text"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Box>
            <Box marginBottom="20px">
            <TextField
  fullWidth
  id="description"
  name="description"
  type="text"
  label="Description"
  value={formik.values.description}
  onChange={formik.handleChange}
  error={formik.touched.description && Boolean(formik.errors.description)}
  helperText={formik.touched.description && formik.errors.description}
  style={{ borderColor: formik.touched.description && formik.errors.description ? 'red' : '' }}
/>

            </Box>
            <Box marginBottom="20px" display='flex' flexDirection='row' justifyContent='space-around' alignItems='center'>
              <input
                type="file"
                name="image"
                accept="image/*"
                id="images"
                style={{display:'none'}}
                onChange={handleImageChange}
                ref={avatarInputRef}  
              />
              <label htmlFor="images">  
                <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} fullWidth>
                  Upload Image
                </Button>
              </label>
              {imagePreview && (
                <Box marginLeft="20px" display="flex" alignItems="center">
                  <Avatar src={imagePreview} alt="Avatar Preview" style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                  <IconButton onClick={handleDeleteImage} aria-label="delete" size="small">
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
                id="stock"
                name="stock"
                type="number"
                label="Stock"
                value={formik.values.stock}
                onChange={formik.handleChange}
                error={formik.touched.stock && Boolean(formik.errors.stock)}
                helperText={formik.touched.stock && formik.errors.stock}

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
                Add Material
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

export default MaterialsFormDialog;
