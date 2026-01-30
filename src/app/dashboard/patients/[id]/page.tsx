import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { Container, Typography, Paper, Box, Button, Grid } from '@mui/material';
import Patient from '@/models/Patient';
import dbConnect from '@/lib/db';
import Link from 'next/link';

type Params = Promise<{ id: string }>;

async function getPatient(id: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    await dbConnect();
    const patient = await Patient.findOne({ _id: id, doctor: payload.id });
    if (!patient) return null;
    return JSON.parse(JSON.stringify(patient));
}

export default async function PatientDetailsPage(props: { params: Params }) {
    const params = await props.params;
    const patient = await getPatient(params.id);

    if (!patient) {
        return <Container><Typography variant="h5" color="error">Patient not found or access denied.</Typography></Container>;
    }

    return (
        <Container maxWidth="md">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">{patient.name}</Typography>
                <Box>
                    <Button variant="contained" component={Link} href={`/dashboard/patients/${params.id}/edit`} sx={{ mr: 1 }}>
                        Edit
                    </Button>
                    <Button variant="outlined" component={Link} href="/dashboard/patients">
                        Back to List
                    </Button>
                </Box>
            </Box>
            <Paper sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="textSecondary">Age</Typography>
                        <Typography variant="body1">{patient.age}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="textSecondary">Gender</Typography>
                        <Typography variant="body1">{patient.gender}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                        <Typography variant="body1">{patient.phone}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" color="textSecondary">Diagnosis</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{patient.diagnosis}</Typography>
                    </Grid>
                    {patient.notes && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{patient.notes}</Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Container>
    );
}
