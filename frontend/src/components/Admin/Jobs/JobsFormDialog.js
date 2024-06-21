import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { useFormik } from 'formik';
import CustomSnackbar from "../../Layouts/Snackbar";
import { addJobSchema } from "../../Auth/validationShemas";

const JobsFormDialog = ({ isAddJobsDialogOpen, onClose, updateJobs }) => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");




  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };





  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      requirements: '',
      salary: '',
      email: '',
      phone: '',
    },
    validationSchema: addJobSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await axios.post("/api/v1/admin/addJobs", values);
        updateJobs(res.data.jobs)
        setSnackbarSeverity("success");
        setSnackbarMessage("Job added successfully!");
        setSnackbarOpen(true);
        formik.resetForm();
        onClose();
      } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        setSnackbarSeverity("error");
        setSnackbarMessage(error.response ? error.response.data.message : error.message);
        setSnackbarOpen(true);
      } finally {
        setLoading(false)
      }
    },
  });




  return (
    <>
    <Dialog 
      open={isAddJobsDialogOpen} 
      onClose={onClose} 
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add Job Position</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Box margin="20px 0 20px 0">
            <TextField
              fullWidth
              id="title"
              name="title"
              type="text"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Box>
          <Box marginBottom="20px">
            <TextField
              fullWidth
              id="description"
              name="description"
              type="text"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Box>
          <Box marginBottom="20px">
            <TextField
              fullWidth
              id="requirements"
              name="requirements"
              type="text"
              label="Requirements"
              multiline
              rows={4}
              value={formik.values.requirements}
              onChange={formik.handleChange}
              error={formik.touched.requirements && Boolean(formik.errors.requirements)}
              helperText={formik.touched.requirements && formik.errors.requirements}
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
            <TextField
              fullWidth
              id="phone"
              name="phone"
              type="tel"
              label="Phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
          </Box>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button 
              color="primary" 
              type="submit"
            >
              Add Job
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>

    <CustomSnackbar 
        open={snackbarOpen} 
        handleClose={handleCloseSnackbar} 
        severity={snackbarSeverity} 
        message={snackbarMessage}
      />

</>
  );
};

export default JobsFormDialog;
