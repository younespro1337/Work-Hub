import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Delete from '@mui/icons-material/Delete';
import axios from 'axios';
import {   
    Button, 
    IconButton,
    Box,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import { UserList } from './UserList';

const MaterialsGridComponent = ({materials, loading, updateMaterials}) => {
    const dataGridRef = useRef();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [deleteName, setDeleteName] = useState('');

    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete(`/api/v1/material/${id}`);
            // console.log('materials:', data);
            updateMaterials(data.materials);
            handleCloseDeleteDialog();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteClicked = (id, name) => {
        setDeleteId(id);
        setDeleteName(name);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };
    
    const handleRowEditCommit = React.useCallback(
        async (params) => {
            const id = params.id;
            const key = params.field;
            const value = params.value;

            const editedData = {
                id: id,
                field: key,
                value: value,
            };

            const copiedData = JSON.parse(JSON.stringify(editedData));

            handleSaveChanges(copiedData);

            return editedData;
        },
        []
    );

    const handleSaveChanges = async (data) => { 
        try {
            const response = await axios.post('/api/v1/editMaterials', data);
            // console.log('Data saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const columns = [
        {
            field: 'images',
            headerName: 'Image',
            width: 80,
            editable:true,
            renderCell: (params) => (
                <Avatar src={params.value.url} />
            ),
        },
        { field: 'name', headerName: 'Name', width: 150, editable:true },
        {
            field: 'description',
            headerName: 'Description',
            width: 300,
            editable:true,
            renderCell: (params) => (
                <div style={{ overflowWrap: 'break-word', width: '100%' }}>
                    {params.value}
                </div>
            ),
        },
        { field: 'category', headerName: 'Category', width: 150, editable:true },
        { field: 'stock', headerName: 'Stock', width: 100, editable:true },
        {
            field: 'users',
            headerName: 'Users',
            width: 300,
            editable:false,
            renderCell: (params) => (
                <UserList users={params.value} />
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Register At',
            width: 200,
            editable:true,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 80,
            editable:false,
            renderCell: (params) => (
            
                    <Button color='secondary' className='Delete' onClick={() => handleDeleteClicked(params.row.id, params.row.name)}>
                        <Delete />
                    </Button>
            ),
        },
    ];

    return (
        <Box style={{ height: '600px', width: '100%', padding: '20px' }}>
            <DataGrid
                onCellEditCommit={handleRowEditCommit}
                rows={materials}
                columns={columns} 
                pageSize={10}
                loading={loading}
                pageSizeOptions={[10, 20]} 
                ref={dataGridRef}
                checkboxSelection
                pagination
                rowHeight={80}
            />
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle>Delete Worker</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete <Typography color='primary'> {deleteName}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleDelete(deleteId)} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default MaterialsGridComponent;
