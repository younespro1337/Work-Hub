import React from 'react';
import {   
    Box,
    Avatar,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';

export const UserList = ({ users }) => {
    const numberOfUsers = users ? users.length : 0;

    return (
        <>
            {numberOfUsers > 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    <Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" width="100%">
                        {Array.from({ length: numberOfUsers }).map((_, index) => (
                            <Avatar key={index} style={{ margin: '5px' }}>
                                <GroupIcon />
                            </Avatar>
                        ))}
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" marginTop="10px">
                        <GroupIcon color="primary" />
                        <span style={{ marginLeft: '5px' }}>
                            {numberOfUsers} Worker{numberOfUsers !== 1 ? 's' : ''} received this material
                        </span>
                    </Box>
                </Box>
            ) : (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginTop="20px">
                    <GroupIcon fontSize="large" color="primary" />
                    <span>N/A</span>
                </Box>
            )}
        </>
    );
};
