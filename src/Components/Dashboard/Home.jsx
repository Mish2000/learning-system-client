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
                minHeight: '60vh',
                gap: 8
            }}
        >
            <Typography variant="h4">Welcome to Quick Math!</Typography>

            <Typography
                sx={{
                    fontFamily: "cursive"
                }}
            >
                This is a platform for self-learning and practicing math with wide variety of topics,
                <br/> we have a detector that will see with what you are getting difficult at and match the exercises for your level,
                <br/> this is all for you to understood the way to solve the problem and then move on to an higher difficulty <br/> so can improve your math,
                 we also have a dynamic question generation and personalized dashboards.
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
                    <Button
                        variant="contained"
                        onClick={() => navigate(('/Profile'))}
                    >
                        Go to Profile Page
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/Statistics')}
                    >
                        see your statistics
                    </Button>
                </Stack>
            )}
        </Box>
    );
}

export default Home;


