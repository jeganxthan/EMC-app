'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { TextField, Button, Box, Typography, Container, Paper, CircularProgress, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

const schema = z.object({
    name: z.string().min(2, 'Name required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Min 6 characters'),
    specialization: z.string().min(2, 'Specialization required'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            await axios.post('/api/auth/register', data);
            enqueueSnackbar('Registration successful!', { variant: 'success' });
            router.push('/dashboard');
            router.refresh();
        } catch (err: unknown) {
            const errorMessage = axios.isAxiosError(err) && err.response?.data?.error
                ? err.response.data.error
                : 'Registration failed';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Doctor Registration
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Full Name"
                            autoComplete="name"
                            autoFocus
                            {...register('name')}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Email Address"
                            autoComplete="email"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Specialization"
                            {...register('specialization')}
                            error={!!errors.specialization}
                            helperText={errors.specialization?.message}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Password"
                            type="password"
                            autoComplete="new-password"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                        </Button>
                        <Box textAlign="center">
                            <MuiLink component={Link} href="/login">
                                Already have an account? Sign In
                            </MuiLink>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
