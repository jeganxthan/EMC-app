'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { TextField, Button, Box, Typography, Container, Paper, MenuItem, Grid } from '@mui/material';

const schema = z.object({
    name: z.string().min(1, 'Name required'),
    age: z.number().min(0, 'Age must be positive'),
    gender: z.enum(['Male', 'Female', 'Other'], { message: 'Select a gender' }),
    diagnosis: z.string().min(1, 'Diagnosis required'),
    phone: z.string().min(5, 'Phone required'),
    notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewPatientPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async (data: FormData) => {
        try {
            await axios.post('/api/patients', data);
            enqueueSnackbar('Patient added successfully', { variant: 'success' });
            router.push('/dashboard/patients');
            router.refresh();
        } catch (err: unknown) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error
                ? err.response.data.error
                : 'Failed to add patient';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>Add New Patient</Typography>
            <Paper sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Name" {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Age" type="number" InputLabelProps={{ shrink: true }} {...register('age', { valueAsNumber: true })} error={!!errors.age} helperText={errors.age?.message} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField select fullWidth label="Gender" {...register('gender')} error={!!errors.gender} helperText={errors.gender?.message} defaultValue="">
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Phone" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="Diagnosis" multiline rows={2} {...register('diagnosis')} error={!!errors.diagnosis} helperText={errors.diagnosis?.message} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="Notes" multiline rows={3} {...register('notes')} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button type="submit" variant="contained" size="large">Save Patient</Button>
                            <Button variant="outlined" size="large" sx={{ ml: 2 }} onClick={() => router.back()}>Cancel</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}
