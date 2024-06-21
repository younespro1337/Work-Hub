import React, { useState } from "react";
import { Typography, Box, useTheme, Paper } from '@mui/material';
import { Document, Page, pdfjs } from "react-pdf";
import Loading from "../../Layouts/loading";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const FileMessage = ({ src ,content, sender,memberDetails, iAm}) => {

  // const pdfUrl = ;
  const isCurrentUser = sender === iAm?._id;
  const theme = useTheme(); 
  const [isLoading, setIsLoading ] = useState(true);
  const [error, setError] = useState(null);

  const handleLoadSuccess = () => {
    setIsLoading(false);
    setError(null);
  }

  const handleLoadError = (error) => {
    console.log('Error loading PDF:', error);
    setIsLoading(false);
    setError('Failed to load the PDF file.');
  };


  const customStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mb: 1,
      maxWidth: '100%',
      alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
      marginLeft: isCurrentUser ? 'auto' : '0',
      marginRight: isCurrentUser ? '0' : 'auto',
    },

    badge: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      padding: '5px 10px',
      borderRadius: '4px',
      display: 'inline-block',
      marginBottom: '5px',
    },

    documentContainer: {
      width: '150px',
      height: '200px',
      padding: '5px',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
  };

  const hideClassCss = `
    .react-pdf__Page__textContent.textLayer,
    .react-pdf__Page__annotations.annotationLayer {
      display: none !important;
    }
  `;

  return (
    <>
      <style>{hideClassCss}</style>
      <Box sx={customStyles.container}>   
        <Paper sx={customStyles.documentContainer}>
          <Document
            file={src?.media?.fileUrl || src?.data?.fileUrl || src}
            renderMode="canvas"
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
            loading={<Loading />}
            error={error ? error : "Failed to load PDF file."}
          >
            <Page 
              pageNumber={1} 
              width={150}
              scale={0.9}
              loading={<Loading />}
              onLoadSuccess={() => console.log('Page loaded successfully.')}
              onLoadError={(error) => console.log('Error loading page:', error)}
            />
          </Document>
        </Paper>
      </Box>
    </>
  );
};
