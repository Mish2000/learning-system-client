import  { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, TextField, Button, Stack } from '@mui/material';

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [language, setLanguage] = useState('');
    const [detailLevel, setDetailLevel] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('http://localhost:8080/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
                setLanguage(response.data.interfaceLanguage || '');
                setDetailLevel(response.data.solutionDetailLevel || '');
            } catch (error) {
                console.error('Failed to fetch profile', error);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(
                'http://localhost:8080/api/profile',
                {
                    interfaceLanguage: language,
                    solutionDetailLevel: detailLevel
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Update failed');
        }
    };

    if (!profile) {
        return <Typography>Loading Profile...</Typography>;
    }

    return (
        <Box sx={{ padding: 4, maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Profile Management</Typography>
            <Typography variant="body1">Username: {profile.username}</Typography>
            <Typography variant="body1">Email: {profile.email}</Typography>

            <Stack spacing={2} mt={2}>
                <TextField
                    label="Interface Language"
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                />
                <TextField
                    label="Solution Detail Level"
                    value={detailLevel}
                    onChange={e => setDetailLevel(e.target.value)}
                />
                <Button variant="contained" onClick={handleUpdate}>
                    Save Profile
                </Button>
            </Stack>
        </Box>
    );
}

export default ProfilePage;