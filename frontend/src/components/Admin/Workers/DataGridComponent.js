import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, IconButton, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import { handleDeleteWorker, handleSaveChanges } from '../../../actions/userAction';

export const DataGridComponent = ({
    workers,
    loading,
    dataGridRef,
    selectedWorkerIds,
    isTaskOpen,
    updateWorkers,
    setIsTaskOpen,
    setSelectedWorkerIds,
    setAdminId,
}) => {
    const [localSelectedWorker, setLocalSelectedWorker] = useState(selectedWorkerIds);
    const [localIsTaskOpen, setLocalIsTaskOpen] = useState(isTaskOpen);
    const [adminWorker, setAdminWorker] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteName, setDeleteName] = useState('');

    const handleOpenDeleteDialog = (id, name) => {
        setDeleteId(id);
        setDeleteName(name);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const data = await handleDeleteWorker(deleteId);
            if (data.success) {
                console.log('workers:', data.users);
                const message = data.message;
                updateWorkers(deleteId, message);
                handleCloseDeleteDialog();
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRowEditCommit = React.useCallback(
        async (params) => {
            const id = params.id;
            const key = params.field;
            const value = params.value;

            // Create an object containing the edited data
            const editedData = {
                id: id,
                field: key,
                value: value,
            };

            // Deep copy the editedData to remove any circular references
            const copiedData = JSON.parse(JSON.stringify(editedData));

            handleSaveChanges(copiedData);

            // Return the edited data
            return editedData;
        },
        []
    );

    const handleSelectionChange = (newSelection) => {
        setSelectedWorkerIds(newSelection);
    };

    const handleSelectWorker_s = (workerId) => {
        setAdminWorker(workerId);
        setAdminId(workerId);
        setIsTaskOpen(true);
    };

    const columns = [
        {
            field: 'avatar',
            headerName: 'Avatar',
            width: 80,
            height: 80,
            margin: 5,
            renderCell: (params) => (
                <Avatar
                    src={params.value}
                    alt="avatar"
                />
            ),

        },
        { field: 'fullName', headerName: 'Full name', width: 100, editable: true },
        { field: 'phoneNumber', headerName: 'phone', width: 150, editable: true },
        { field: 'email', headerName: 'Email', width: 210, editable: true },
        { field: 'gender', headerName: 'Gender', width: 90, editable: true },
        { field: 'role', headerName: 'Role', width: 90, editable: true },
        { field: 'registerAt', headerName: 'Registered At', width: 150, editable: true },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <div>
                    <IconButton onClick={() => handleOpenDeleteDialog(params.id, params.row.fullName)} color="secondary">
                        <Delete />
                    </IconButton>
                    <Button onClick={() => {
                        handleSelectWorker_s(params.id)
                    }} color="primary">
                        <AddTaskRoundedIcon />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Box style={{ height: '600px', width: '100%', padding: '20px' }}>
            <DataGrid
                onCellEditCommit={handleRowEditCommit}
                rows={workers}
                columns={columns}
                loading={loading}
                pageSizeOptions={[10, 15]}
                ref={dataGridRef}
                checkboxSelection
                pagination
                onSelectionModelChange={handleSelectionChange}
                selectionModel={selectedWorkerIds}
            />
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle>Delete Worker</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {deleteName}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirmed} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
