import { Box } from '@mui/material';

export const MediaMessage = ({ content , sender , iAm}) => {
  // console.log("MediaMessage content:", content); 
  const src = content?.media?.fileUrl || content?.data?.fileUrl || '';
  const isCurrentUser = sender === iAm?._id;


  return (
    <Box 
      sx={{ 
        mb: 1, 
        maxWidth: '30%', 
        alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
        marginLeft: isCurrentUser ? 'auto' : '0',
        marginRight: isCurrentUser ? '0' : 'auto',
      }}
    >
      <img 
        src={src} 
        alt="" 
        style={{ width: '100%', height: 'auto', borderRadius: '30px'}} 
        onError={(e) => {
          console.error("Error loading image:", e.target.src); 
          e.target.style.display = 'none';
        }}
      />
    </Box>
  );
};
