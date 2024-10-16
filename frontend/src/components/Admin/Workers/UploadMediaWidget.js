import React, { useEffect, useState } from 'react';
import { IconButton, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const useOpenUploadWidget = ({ setTaskImages, setTaskVideos, setTaskDocuments }) => {
  const [isUploadWidgetOpen, setIsUploadWidgetOpen] = useState(false);

  const toggleUploadWidget = () => {
    setIsUploadWidgetOpen(!isUploadWidgetOpen);
  };

  useEffect(() => {
    if (isUploadWidgetOpen) {
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
            // console.log('Upload widget result:', result);
            if (!error && result && result.event === 'success') {
              if (result.info.resource_type === 'image') {
                const base64Data = result.info.thumbnail_url;
                setTaskImages((prevImages) => [...prevImages, base64Data]);
              } else if (result.info.resource_type === 'video') {
                setTaskVideos((prevVideos) => [...prevVideos, result.info.secure_url]);
              } else if (result.info.resource_type === 'pdf') {
                setTaskDocuments((prevDocuments) => [...prevDocuments, result.info.secure_url]);
              } else {
                console.error('Upload error:', error);
              }
            }
          }
        );
        widget.open();
      } else {
        console.error('Cloudinary SDK not loaded');
      }
    }
  }, [isUploadWidgetOpen, setTaskImages, setTaskVideos, setTaskDocuments]);

  return (
    <Paper
      sx={{
        marginTop: "10px",
        width: '50%',
        marginRight: "25%",
        marginLeft: "25%"
      }}
    >
      <IconButton 
        onClick={toggleUploadWidget} 
        color="primary" 
        disabled={false}
      >
        <CloudUploadIcon />
      </IconButton>
    </Paper>
  );
};

export default useOpenUploadWidget;
