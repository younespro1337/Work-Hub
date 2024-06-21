import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Paper,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useFormik } from 'formik';
import axios from 'axios';
import Loading from '../../Layouts/loading';
import { tasksSchema } from '../../Auth/validationShemas';
import { useTheme } from '@mui/material/styles';
import MediaDisplay from './MediaDisplay';

const TaskDialog = ({ isTaskOpen, selectedWorkerIds,adminWorker, setIsTaskOpen, setSnackbarOpen, setSnackbarMessage }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskImages, setTaskImages] = useState([]);
  const [taskVideos, setTaskVideos] = useState([]);
  const [taskDocuments, setTaskDocuments] = useState([]);
  const [disableCloudButton, setDisableCloudButton] = useState(false);
  const [isUploadWidgetOpen, setIsUploadWidgetOpen] = useState(false);
  const theme = useTheme();

  const openUploadWidget = () => {
    if (window.cloudinary && window.cloudinary.createUploadWidget) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'dktkavyr3',
          uploadPreset: 'qw4k1xjq',
          sources: ['local', 'camera', 'url', 'image_search', 'dropbox', 'facebook', 'instagram'],
          multiple: true,
          defaultSource: 'local',
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#0078FF',
              menuIcons: '#5A616A',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#0078FF',
              action: '#0078FF',
              inactiveTabIcon: '#000000',
              error: '#F44235',
              inProgress: '#0078FF',
              complete: '#20B832',
              sourceBg: '#E4EBF1',
            },
            fonts: {
              default: null,
              "'Lato', sans-serif": {
                url: 'https://fonts.googleapis.com/css?family=Lato',
                active: true,
              },
            },
          },
          folder: 'ImagesLoopNode',
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            if (result.info.resource_type === 'image' && result.info.format !== 'pdf') {
              const imageUrl = result.info.secure_url;
              setTaskImages((prevImages) => [...prevImages, imageUrl]);
            } else if (result.info.resource_type === 'video') {
              setTaskVideos((prevVideos) => [...prevVideos, result.info.secure_url]);
            } else if (result.info.format === 'pdf') {
              setTaskDocuments((prevDocuments) => [...prevDocuments, result.info.secure_url]);
            } else {
              console.error('Upload error:', error);
            }
          } else if (result && result.event === 'close') {
            setDisableCloudButton(false);
            setIsUploadWidgetOpen(false);
          }
        }
      );
      widget.open();
    } else {
      console.error('Cloudinary SDK not loaded');
    }
  };
  
  const toggleUploadWidget = () => {
    if (!isUploadWidgetOpen) {
      setDisableCloudButton(true);
      setIsUploadWidgetOpen(true);
    } else {
      setIsUploadWidgetOpen(false);
    }
  };
  
  useEffect(() => {
    if (isUploadWidgetOpen) {
      openUploadWidget();
    }
  }, [isUploadWidgetOpen]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      resultExpectation: '',
      deadlineDays: '',
    },
    validationSchema: tasksSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
  
        const postData = {
          ...values,
          mediaUrls: {
            taskImages: taskImages,
            taskVideos: taskVideos,
            taskDocuments: taskDocuments
          },
          workersId: selectedWorkerIds,
          adminOfTaskId: adminWorker
        };
  
        const res = await axios.post('/api/v1/tasks', postData);
        console.log('res:', res);
  
        formik.resetForm();
        setTaskVideos([]);
        setTaskImages([]);
        setTaskDocuments([]);
        setIsTaskOpen(false);
        setSnackbarMessage('Task created successfully!');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error creating task:', error);
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });


  // console.log('taskImages', taskImages)
  // console.log('taskVideos', taskVideos)
  // console.log('taskDocuments', taskDocuments)
  // console.log('selectedWorkersId: ', selectedWorkerIds)
  // console.log('adminworker:', adminWorker)


  return (
    <Dialog open={isTaskOpen} onClose={() => setIsTaskOpen(false)}>
      <DialogTitle> Create Task</DialogTitle>
      <DialogContent>
        {isSubmitting ? (
          <Loading /> 
        ) : (
          <>
            <TextField
              label="Task Title"
              fullWidth
              multiline
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              style={{ marginBottom: '16px' }}
            />
            <TextField
              label="Task Description"
              fullWidth
              multiline
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              inputProps={{minLength: 50, maxLength: 200 }}
              style={{ marginBottom: '16px' }}
            />
            <TextField
              label="Task Result Expectation"
              fullWidth
              multiline
              name="resultExpectation"
              value={formik.values.resultExpectation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.resultExpectation && Boolean(formik.errors.resultExpectation)}
              helperText={formik.touched.resultExpectation && formik.errors.resultExpectation}
              style={{ marginBottom: '16px' }}
            />
            <TextField
              label="Deadline"
              type="date"
              fullWidth
              name="deadlineDays"
              value={formik.values.deadlineDays}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              InputLabelProps={{
                shrink: true,
              }}
              error={formik.touched.deadlineDays && Boolean(formik.errors.deadlineDays)}
              helperText={formik.touched.deadlineDays && formik.errors.deadlineDays}
            />
          </>
        )}
        <Paper
          sx={{
            marginTop: "10px",
            width: '50%',
            marginRight: "25%",
            marginLeft: "25%",
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              cursor: 'pointer'
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconButton 
            onClick={toggleUploadWidget}
            disabled={isSubmitting || disableCloudButton} 
          >
            <CloudUploadIcon 
              color="primary"
              sx={{
                '&:hover': {
                  color: '#ffffff',
                  cursor: 'pointer'
                },
              }}
            />
          </IconButton>
        </Paper>
        <MediaDisplay 
          taskVideos={taskVideos}
          taskImages={taskImages}
          taskDocuments={taskDocuments} 
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => { 
            setIsTaskOpen(false); 
            setTaskVideos([]);
            setTaskImages([]);
            setTaskDocuments([]);
          }} 
          color="secondary" 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"  
          color="primary"
          onClick={formik.handleSubmit}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
