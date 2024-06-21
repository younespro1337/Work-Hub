import React from 'react';
import { Paper, Typography, CardMedia, IconButton, Box, Tooltip, Button } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import { Document, Page } from 'react-pdf';
import Loading from '../../Layouts/loading';

const MediaDisplay = ({ task }) => {

    const downloadMedia = (url, fileName) => {
        // Create an anchor element
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank'; // Open in a new tab
        link.download = fileName;
      
        // Trigger a click event on the anchor element
        if (document.createEvent) {
          const event = document.createEvent('MouseEvents');
          event.initEvent('click', true, true);
          link.dispatchEvent(event);
        } else {
          link.click();
        }
      };
      

  const hideClassCss = `
  .react-pdf__Page__textContent.textLayer,
  .react-pdf__Page__annotations.annotationLayer {
    display: none !important;
  }
  `;

  return (
    <Paper sx={{ width: '100%', padding: '20px', boxSizing: 'border-box' }}>
      <style>{hideClassCss}</style>

      {task.images && task.images.length > 0 && (
        <>
          <Typography variant="subtitle1" paragraph>Images:</Typography>
          {task.images.map((image) => (
            <Box 
              key={image._id} 
              sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px', width: '100%', flexDirection:'column' }}
            >
              <CardMedia
                component="img"
                src={image.url}
                alt="Task Image"
                style={{ maxWidth: '90%', margin: '5px' }}
              />
              <Tooltip title="Download Image">
                <Button onClick={() => downloadMedia(image.url, `image_${image._id}`)}>
                  <GetAppIcon />
                </Button>
              </Tooltip>
            </Box>
          ))}
        </>
      )}

      {task.videos && task.videos.length > 0 && (
        <>
          <Typography variant="subtitle1" paragraph>Videos:</Typography>
          {task.videos.map((video) => (
            <Box 
              key={video._id} 
              sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px', width: '100%', flexDirection:'column'}}
            >
              <video key={video._id} controls style={{ maxWidth: '90%', margin: '5px' }}>
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Tooltip title="Download Video">
                <Button onClick={() => downloadMedia(video.url, `video_${video._id}.mp4`)}>
                  <GetAppIcon />
                </Button>
              </Tooltip>
            </Box>
          ))}
        </>
      )}

      {task.documents && task.documents.length > 0 && (
        <>
          <Typography variant="subtitle1" paragraph>Documents:</Typography>
          {task.documents.map((document) => (
            <Box 
              key={document._id} 
              sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px', width: '100%' , flexDirection:'column'}}
            >
              <Document
                file={document.url}
                onLoadSuccess={() => {}}
                loading={<Loading />}
              >
                <Page pageNumber={1} width={300} />
              </Document>
              <Tooltip title="Download Document">
                <Button onClick={() => downloadMedia(document.url, `document_${document._id}.pdf`)}>
                  <GetAppIcon />
                </Button>
              </Tooltip>
            </Box>
          ))}
        </>
      )}
    </Paper>
  );
};

export default MediaDisplay;
