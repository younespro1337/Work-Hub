import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Button, ListItem, List, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import axios from 'axios';
import { Document, Page } from 'react-pdf';
import Loading from '../../Layouts/loading';

export const SinglePdfViewer = ({ pdfUrl, applicantsList, handleClose }) => {
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const onDocumentLoadSuccess = () => {
    setIsPdfLoading(false);  
  };

  const hideClassCss = `
  .react-pdf__Page__textContent.textLayer,
  .react-pdf__Page__annotations.annotationLayer {
    display: none !important;
  }
  `;

  const handlePdfClick = (fileUrl) => {
    setSelectedPdf(fileUrl);
  };

  return (
    <Dialog open={Boolean(pdfUrl)} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Applicant's PDFs</DialogTitle>
      <DialogContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <style>{hideClassCss}</style>
        {pdfUrl && (
          <>
            <List
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {applicantsList.map((applicant, index) => (
                <ListItem key={index}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handlePdfClick(applicant.file)}
                  >
                    File: {index + 1}
                  </Button>
                </ListItem>
              ))}
            </List>
            <Paper sx={{ marginTop: '2rem' }}>
              <Document
                file={selectedPdf || pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<Loading />}
              >
                <Page pageNumber={1} width={600} />
              </Document>
            </Paper>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
