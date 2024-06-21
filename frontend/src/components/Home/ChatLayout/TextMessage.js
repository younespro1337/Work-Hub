import {
Paper , Avatar, Typography
} from '@mui/material'

export const TextMessage = ({ src ,content, sender,memberDetails, iAm }) => {
    const isCurrentUser = sender === iAm?._id;
    console.log('tetx Message: iam',iAm)
    return (
      <>
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            p: 1,
            mb: 1,
            maxWidth: '70%',
            wordWrap: 'break-word',
            borderRadius: '10px',
            background: isCurrentUser ? '#1976d2' : '#f3f3f8',
            color: isCurrentUser ? '#f3f3f8' : 'black',
            alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
            marginLeft: isCurrentUser ? 'auto' : '0',
            marginRight: isCurrentUser ? '0' : 'auto',
            clear: 'both',
          }}
        >
          {!isCurrentUser && memberDetails && (
            <Avatar
              src={memberDetails?.avatar?.url}
              style={{ width: '30px', height: '30px', marginRight: '8px' , top:'0'}}
            />
          )}
          <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: 'normal' }}>
            {content}
          </Typography>
        </Paper>
      </>
    );
  };