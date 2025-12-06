import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";

// MUI Components
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    Stack,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import { alpha } from "@mui/material/styles";

// Icons
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CalculateIcon from '@mui/icons-material/Calculate';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeIcon from '@mui/icons-material/Home';

// Custom Components & Constants
import AppIcon from "../Common/AppIcon.jsx";
import NotificationCenter from "../Common/NotificationCenter.jsx";
import {
    ADMIN_DASHBOARD_URL,
    HOME_URL,
    LANDING_URL,
    PRACTICE_URL,
    PROFILE_URL,
    SERVER_URL,
    STATISTICS_URL
} from "../../utils/Constants.js";

export default function NavBar() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();

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
        navigate(LANDING_URL);
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
            closeSSE();
            const src = new EventSource(`${SERVER_URL}/notifications/stream`, { withCredentials: true });
            esRef.current = src;

            src.addEventListener('notification', (event) => {
                try {
                    const payload = JSON.parse(event.data);
                    window.dispatchEvent(new CustomEvent('server-notification', { detail: payload }));
                    // eslint-disable-next-line no-unused-vars
                } catch (e) { /* ignore */ }
            });

            src.onopen = () => {
                backoffRef.current = 1000;
            };

            src.onerror = async () => {
                try {
                    await axios.post(`${SERVER_URL}/auth/refresh`, {}, { withCredentials: true });
                } catch { /* ignore */ }
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

        openSSE();
        keepAliveRef.current = setInterval(() => {
            axios.post(`${SERVER_URL}/auth/refresh`, {}, { withCredentials: true }).catch(() => {});
        }, 9 * 60 * 1000);

        return () => {
            closeSSE();
            if (keepAliveRef.current) {
                clearInterval(keepAliveRef.current);
                keepAliveRef.current = null;
            }
        };
    }, []);

    // Helper to generate consistent styled buttons
    // eslint-disable-next-line react/prop-types
    const NavButton = ({ to, icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Button
                startIcon={icon}
                onClick={() => navigate(to)}
                sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        bgcolor: isActive
                            ? alpha(theme.palette.primary.main, 0.16)
                            : alpha(theme.palette.text.primary, 0.05),
                        color: isActive ? 'primary.dark' : 'text.primary',
                        transform: 'translateY(-1px)',
                    },
                }}
            >
                {label}
            </Button>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                color="default"
                sx={{
                    bgcolor: alpha(theme.palette.background.default, 0.8),
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'none',
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ height: 72 }}>
                        {/* LEFT: LOGO */}
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: 240 }}>
                            <AppIcon size={42} />
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    fontWeight: 800,
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    letterSpacing: -0.5
                                }}
                            >
                                {t('quickMath')}
                            </Typography>
                        </Stack>

                        {/* CENTER: NAVIGATION */}
                        <Stack direction="row" spacing={1} sx={{ flexGrow: 1, justifyContent: 'center' }}>
                            <NavButton to={HOME_URL} icon={<HomeIcon />} label={t('home')} />
                            <NavButton to={PRACTICE_URL} icon={<CalculateIcon />} label={t('practice')} />
                            <NavButton to={STATISTICS_URL} icon={<BarChartIcon />} label={t('statistics')} />
                            {role === 'ADMIN' && (
                                <NavButton to={ADMIN_DASHBOARD_URL} icon={<AdminPanelSettingsIcon />} label={t('adminSection')} />
                            )}
                        </Stack>

                        {/* RIGHT: USER ACTIONS */}
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 240, justifyContent: 'flex-end' }}>
                            <NotificationCenter />

                            <Box
                                onClick={() => navigate(PROFILE_URL)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    cursor: 'pointer',
                                    p: 0.5,
                                    pl: 1,
                                    pr: 2,
                                    borderRadius: 50,
                                    border: `1px solid ${location.pathname === PROFILE_URL ? theme.palette.primary.main : 'transparent'}`,
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.05) }
                                }}
                            >
                                <Avatar
                                    key={avatarRev}
                                    alt="User"
                                    src={avatarSrc || undefined}
                                    sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
                                >
                                    {!avatarSrc && <PersonIcon />}
                                </Avatar>
                                {userData && (
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, maxWidth: 100 }} noWrap>
                                        {userData.username}
                                    </Typography>
                                )}
                            </Box>

                            <Button
                                onClick={handleLogout}
                                sx={{
                                    minWidth: 40,
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    p: 0,
                                    color: 'text.secondary',
                                    '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.1) }
                                }}
                            >
                                <LogoutIcon fontSize="small" />
                            </Button>
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Spacer for Fixed AppBar */}
            <Toolbar sx={{ height: 72 }} />

            <Box component="main" sx={{ flexGrow: 1, position: 'relative' }}>
                <Outlet />
            </Box>
        </Box>
    );
}