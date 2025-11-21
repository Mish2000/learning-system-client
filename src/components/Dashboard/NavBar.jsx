import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Button, Stack } from "@mui/material";
import AppIcon from "../Common/AppIcon.jsx";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    ADMIN_DASHBOARD_URL,
    HOME_URL,
    LOGIN_URL,
    PRACTICE_URL,
    PROFILE_URL,
    SERVER_URL,
    STATISTICS_URL
} from "../../utils/Constants.js";
import CalculateIcon from '@mui/icons-material/Calculate';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeIcon from '@mui/icons-material/Home';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from "react";
import NotificationCenter from "../Common/NotificationCenter.jsx";
import axios from "axios";

export default function NavBar() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [avatarRev, setAvatarRev] = useState(0);
    const esRef = useRef(null);
    const backoffRef = useRef(1000);
    const keepAliveRef = useRef(null);

    const role = (userData?.role || '').replace('ROLE_', '');

    useEffect(() => {
        if (userData?.profileImage) {
            setAvatarSrc(`data:image/jpeg;base64,${userData.profileImage}`);
        } else {
            setAvatarSrc(null);
        }
        setAvatarRev((r) => r + 1);
    }, [userData?.profileImage]);

    const handleLogout = async () => {
        try {
            await axios.post(`${SERVER_URL}/auth/logout`, null, { withCredentials: true });
        } catch { /* ignore */ }
        navigate(LOGIN_URL);
        window.location.reload();
    };

    useEffect(() => {
        const onProfileUpdated = (e) => {
            const updated = e.detail;
            if (updated && typeof updated === 'object') {
                setUserData((prev) => ({ ...(prev || {}), ...updated }));
            }
        };
        window.addEventListener('profile-updated', onProfileUpdated);
        return () => window.removeEventListener('profile-updated', onProfileUpdated);
    }, []);

    useEffect(() => {
        // --- profile load ---
        axios.get(`${SERVER_URL}/profile`, { withCredentials: true })
            .then((resp) => setUserData(resp.data))
            .catch((err) => console.error('Failed to fetch user profile in NavBar', err));

        // --- notifications SSE ---
        const openSSE = () => {
            closeSSE(); // safety
            const src = new EventSource(`${SERVER_URL}/notifications/stream`, { withCredentials: true });
            esRef.current = src;

            src.addEventListener('notification', (event) => {
                try {
                    const payload = JSON.parse(event.data);
                    window.dispatchEvent(new CustomEvent('server-notification', { detail: payload }));
                    // eslint-disable-next-line no-unused-vars
                } catch (e) {
                    //
                }
            });

            src.onopen = () => {
                // Reset backoff on a clean open
                backoffRef.current = 1000;
            };

            src.onerror = async () => {
                // Attempt to refresh cookies, then reconnect with backoff
                try {
                    await axios.post(`${SERVER_URL}/auth/refresh`, {}, { withCredentials: true });
                } catch {
                    // even if refresh fails, we'll try to reconnect (server may also slide-refresh)
                }
                closeSSE();
                const delay = Math.min(backoffRef.current, 30000);
                setTimeout(openSSE, delay);
                backoffRef.current = Math.min(backoffRef.current * 2, 30000);
                console.error('SSE connection failed or was closed.');
            };
        };

        const closeSSE = () => {
            if (esRef.current) {
                try { esRef.current.close(); } catch { /* ignore */ }
                esRef.current = null;
            }
        };

        // Open on mount
        openSSE();

        // Gentle keep-alive: refresh before typical access-token expiry
        keepAliveRef.current = setInterval(() => {
            axios.post(`${SERVER_URL}/auth/refresh`, {}, { withCredentials: true }).catch(() => {});
        }, 9 * 60 * 1000); // 9 minutes

        // Cleanup on unmount
        return () => {
            closeSSE();
            if (keepAliveRef.current) {
                clearInterval(keepAliveRef.current);
                keepAliveRef.current = null;
            }
        };
    }, []);

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

                            {role === 'ADMIN' && (
                                <Button
                                    sx={{
                                        textTransform: 'inherit',
                                        color: location.pathname === ADMIN_DASHBOARD_URL ? 'secondary.light' : 'inherit',
                                    }}
                                    onClick={() => navigate(ADMIN_DASHBOARD_URL)}
                                >
                                    <AdminPanelSettingsIcon />
                                    {t('adminSection')}
                                </Button>
                            )}

                            <Button
                                sx={{
                                    textTransform: 'inherit',
                                    color: location.pathname === PROFILE_URL ? 'secondary.light' : 'inherit',
                                }}
                                onClick={() => navigate(PROFILE_URL)}
                            >
                                <PersonIcon />
                                {t('profile')}
                            </Button>

                            <NotificationCenter />

                            {userData && (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Avatar key={avatarRev} alt="User Avatar" src={avatarSrc || undefined} />
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
