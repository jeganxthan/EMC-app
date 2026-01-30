import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { Container, Typography, Paper, Box } from '@mui/material';
import Doctor from '@/models/Doctor';
import dbConnect from '@/lib/db';

async function getDoctor() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    await dbConnect();
    const doctor = await Doctor.findById(payload.id).select('-password');
    if (!doctor) return null;
    return JSON.parse(JSON.stringify(doctor));
}

export default async function DashboardPage() {
    const doctor = await getDoctor();

    if (!doctor) {
        return <Typography>Unauthorized. Please log in.</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Welcome, Dr. {doctor.name}
            </Typography>
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>Profile Information</Typography>
                <Box mt={2}>
                    <Typography paragraph><strong>Specialization:</strong> {doctor.specialization}</Typography>
                    <Typography paragraph><strong>Email:</strong> {doctor.email}</Typography>
                    <Typography paragraph><strong>Account Created:</strong> {new Date(doctor.createdAt).toLocaleDateString()}</Typography>
                </Box>
            </Paper>
        </Container>
    );
}
