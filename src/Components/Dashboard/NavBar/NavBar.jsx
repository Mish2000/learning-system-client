import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Avatar, Box, Button, Stack} from "@mui/material";
import AppIcon from "../../../Utils/AppIcon.jsx";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import { HOME_URL, LOGIN_URL, PRACTICE_URL, STATISTICS_URL} from "../../../Utils/Constants.js";
import CalculateIcon from '@mui/icons-material/Calculate';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeIcon from '@mui/icons-material/Home';
import { useTranslation } from 'react-i18next';
import {useEffect, useState} from "react";
import axios from "axios";

export default function NavBar() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('role');
        navigate(LOGIN_URL);
        window.location.reload();
    };

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        axios
            .get('http://localhost:8080/api/profile', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((resp) => {
                setUserData(resp.data);
            })
            .catch((error) => console.error('Failed to load user profile in NavBar:', error));
    }, []);

    let avatarUrl = null;
    if (userData && userData.profileImage) {
        avatarUrl = `data:image/jpeg;base64,${userData.profileImage}`;
    }

    return (
        <Stack spacing={7}>
            <AppBar position="fixed" color="primary">
                <Toolbar>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <AppIcon size={50} />
                            <Typography variant="h6" component="div">
                                {t('quickMath')}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={4} alignItems="center">
                            <Button
                                sx={{
                                    textTransform: 'inherit',
                                    color: location.pathname === HOME_URL ? 'secondary.light' : 'inherit',
                                }}
                                onClick={() => navigate(HOME_URL)}
                            >
                                <HomeIcon />
                                {t('home')}
                            </Button>

                            <Button
                                sx={{
                                    textTransform: 'inherit',
                                    color: location.pathname === PRACTICE_URL ? 'secondary.light' : 'inherit',
                                }}
                                onClick={() => navigate(PRACTICE_URL)}
                            >
                                <CalculateIcon />
                                {t('practice')}
                            </Button>

                            <Button
                                sx={{
                                    textTransform: 'inherit',
                                    color: location.pathname === STATISTICS_URL ? 'secondary.light' : 'inherit',
                                }}
                                onClick={() => navigate(STATISTICS_URL)}
                            >
                                <BarChartIcon />
                                {t('statistics')}
                            </Button>

                            <Button
                                sx={{
                                    textTransform: 'inherit',
                                    color: location.pathname === '/profile' ? 'secondary.light' : 'inherit',
                                }}
                                onClick={() => navigate('/profile')}
                            >
                                <PersonIcon />
                                {t('profile')}
                            </Button>

                            {userData && (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Avatar
                                        alt="User Avatar"
                                        src={avatarUrl || undefined}
                                    >
                                    </Avatar>
                                    <Typography variant="body1">
                                        {userData.username}
                                    </Typography>
                                </Stack>
                            )}

                            <Button
                                sx={{ textTransform: 'inherit' }}
                                color="inherit"
                                onClick={handleLogout}
                            >
                                <LogoutIcon />
                                {t('logOut')}
                            </Button>
                        </Stack>
                    </Box>
                </Toolbar>
            </AppBar>
            <Outlet />
        </Stack>
    );
}
