import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LOGIN_URL, REGISTER_URL } from '../../utils/Constants';
import {useState} from "react";

function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');
    const role  = localStorage.getItem('role');
    // const [showProfile, setShowProfile] = useState(false);
    // const navigate = useNavigate();

    // const handleNavigate = () => {
    //     navigate('/profile');
    // };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                gap: 3
            }}
        >
            <Typography variant="h4">Welcome to Quick Math!</Typography>

            <Typography variant="body1">
                This is a platform for self-learning and practicing math topics, with dynamic question generation
                and personalized dashboards.
            </Typography>

            {!token && (
                <Stack spacing={2} direction="row">
                    <Button
                        variant="contained"
                        onClick={() => navigate(LOGIN_URL)}
                    >
                        Login
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(REGISTER_URL)}
                    >
                        Register
                    </Button>
                </Stack>
            )}

            {token && (
                <Stack spacing={2} direction="row">
                    <Button
                        variant="contained"
                        onClick={() => navigate('/Practice')}
                    >
                        Start Practicing
                    </Button>
                    <Button onClick={() => navigate(('/Profile'))}
                    >
                        Go to Profile Page
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/Statistics')}
                    >
                        View My Dashboard
                    </Button>
                </Stack>
            )}
        </Box>
    );
}

export default Home;


