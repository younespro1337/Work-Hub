import React from 'react';
import { Card, CardContent, Paper } from '@mui/material';
import { FileMessage } from '../../Home/ChatLayout/FileMessage';

const MediaDisplay = ({ taskVideos, taskImages, taskDocuments }) => {
  return (
    <Card>
      <CardContent>
        <Paper variant="outlined" style={{ overflowX: 'auto', width:'100%'}}>
          <div className="scroll-container" style={{ display: 'flex', alignItems: 'center', paddingLeft: 48, paddingRight: 48 }}>



            {taskVideos && taskVideos.length > 0 && (
              taskVideos.map((videoUrl, index) => (
                <div key={index} style={{ marginRight: 16, height:'100%'}}>
                  <video controls width="200">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))
            )}





            {taskImages && taskImages.length > 0 && (
              taskImages.map((imageSrc, index) => (
                <div key={index} style={{ marginRight: 16 }}>
                  <img src={imageSrc} alt={`task-${index}`} width="200"  style={{ display: 'block' }} />
                </div>
              ))
            )}
            {taskDocuments && taskDocuments.length > 0 && (
              taskDocuments.map((documentSrc, index) => (
                <div key={index} style={{ marginRight: 16 }}>
                  <FileMessage src={documentSrc}/>
                </div>
              ))
            )}
          </div>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default MediaDisplay;
