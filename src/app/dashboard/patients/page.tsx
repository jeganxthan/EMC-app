'use client';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button, Container, Typography, Box, IconButton, Paper } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSnackbar } from 'notistack';

interface Patient {
    _id: string;
    name: string;
    age: number;
    gender: string;
    diagnosis: string;
    phone: string;
}

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    const fetchPatients = useCallback(async () => {
        try {
            const res = await axios.get('/api/patients');
            setPatients(res.data);
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Failed to fetch patients', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/patients/${id}`);
            enqueueSnackbar('Patient deleted', { variant: 'success' });
            fetchPatients();
        } catch {
            enqueueSnackbar('Delete failed', { variant: 'error' });
        }
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'age', headerName: 'Age', width: 90 },
        { field: 'gender', headerName: 'Gender', width: 100 },
        { field: 'phone', headerName: 'Phone', width: 130 },
        { field: 'diagnosis', headerName: 'Diagnosis', flex: 1, minWidth: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <>
                    <IconButton component={Link} href={`/dashboard/patients/${params.row._id}`} size="small" color="primary">
                        <VisibilityIcon />
                    </IconButton>
                    <IconButton component={Link} href={`/dashboard/patients/${params.row._id}/edit`} size="small" color="secondary">
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(params.row._id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Container maxWidth="lg">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Patients List</Typography>
                <Button variant="contained" component={Link} href="/dashboard/patients/new">
                    Add New Patient
                </Button>
            </Box>
            <Paper sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={patients}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                />
            </Paper>
        </Container>
    );
}
