import React, { useRef, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import axios from 'axios';
import { SinglePdfViewer } from './SinglePdfViewer';
import CustomSnackbar from '../../Layouts/Snackbar';

const JobsDataGrid = ({ jobs, loading, updateJobsData }) => {
  const dataGridRef = useRef();
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [applicantsList, setApplicantsList] = useState([]);
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  const handleSaveChanges = async (data) => {
    try {
      const response = await axios.post('/api/v1/editJobs', data);
      console.log('Data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/job/${id}`);
      if (res.data.success) {
        updateJobsData(res.data.jobs); 
        handleCloseDeleteDialog();
        setSnackbarSeverity("success");
        setSnackbarMessage("Job Deleted successfully!");
        setSnackbarOpen(true);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
      setSnackbarSeverity("error");
      setSnackbarMessage(error.response ? error.response.data.message : error.message);
      setSnackbarOpen(true);

    }
  };
  

  const handleRowEditCommit = React.useCallback(
    async (params) => {
      const id = params.id;
      const key = params.field;
      const value = params.value;

      const editedData = {
        id: id,
        field: key,
        value: value,
      };

      // Deep copy the editedData to remove any circular references
      const copiedData = JSON.parse(JSON.stringify(editedData));

      handleSaveChanges(copiedData);
      return editedData;
    },
    []
  );

  const handleOpenPdfDialog = (pdfUrl, applicants) => {
    setPdfUrl(pdfUrl);
    setApplicantsList(applicants);
    setOpenPdfDialog(true);
  };

  const handleClosePdfDialog = () => {
    setPdfUrl('');
    setApplicantsList([]);
    setOpenPdfDialog(false);
  };

  const handleOpenDeleteDialog = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteId(null);
    setDeleteName('');
    setOpenDeleteDialog(false);
  };

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      width: 300,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      editable: true,
      renderCell: (params) => (
        <div style={{ overflowWrap: 'break-word', width: '100%' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'requirements',
      headerName: 'Requirements',
      editable: true,
      width: 300,
      renderCell: (params) => (
        <span>{Array.isArray(params.value) ? params.value.join(', ') : params.value}</span>
      ),
    },
    {
      field: 'counter',
      headerName: 'Applied',
      width: 80,
      renderCell: (params) => (
         <Typography color='secondary' component='strong'>{params.value}</Typography>
      ),
    },
    {
      field: 'applicants',
      headerName: 'Files Applicant',
      width: 250,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleOpenPdfDialog(params.value[0].file, params.value)}
        >
          View Applicant
        </Button>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 150,
      renderCell: (params) => <span>{params.value}</span>,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Button onClick={() => handleOpenDeleteDialog(params.row.id, params.row.title)} color='secondary'>
          <Delete />
        </Button>
      ),
    },
  ];

 
  return (
    <>
      <Box style={{ height: '800px', width: '100%', padding: '20px' }}>
        <DataGrid
          onCellEditCommit={handleRowEditCommit}
          rows={jobs}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10]}
          ref={dataGridRef}
          checkboxSelection
          pagination
          rowHeight={80}
        />
      </Box>
      <SinglePdfViewer 
        pdfUrl={pdfUrl} 
        applicantsList={applicantsList} 
        handleClose={handleClosePdfDialog} 
      />
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Delete Job</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <Typography color='primary'>{deleteName}</Typography>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDelete(deleteId)} color="secondary">
            Delete
          </Button>
        </DialogActions>
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

export default JobsDataGrid;
