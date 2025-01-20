import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Box, Button, Stack} from "@mui/material";
import AppIcon from "../../../Utils/AppIcon.jsx";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import { HOME_URL, LOGIN_URL, PRACTICE_URL, STATISTICS_URL} from "../../../Utils/Constants.js";
import CalculateIcon from '@mui/icons-material/Calculate';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeIcon from '@mui/icons-material/Home';
import {handleLogout} from "../../../API/Logout.js";
import { useTranslation } from 'react-i18next';


function NavBar() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Stack spacing={7}>
            <AppBar position="fixed" color="primary">
                <Toolbar>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <AppIcon size={50} />
                            <Typography variant="h6" component="div">
                                {t('quickMath')}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={4}>
                            <Button
                                sx={{
                                    textTransform: 'inherit',
                                    color: location.pathname === HOME_URL ? "secondary.light" : "inherit"
                                }}
                                onClick={() => navigate(HOME_URL)}
                            >
                                <HomeIcon />
                                {t('home')}
                            </Button>

                            <Button
                                sx={{
                                    textTransform: 'inherit',
                                    color: location.pathname === PRACTICE_URL ? "secondary.light" : "inherit"
                                }}
                                onClick={() => navigate(PRACTICE_URL)}
                            >
                                <CalculateIcon />
                                {t('practice')}
                            </Button>

                            <Button
                                sx={{
                                    textTransform: 'inherit',
                                    color: location.pathname === STATISTICS_URL ? "secondary.light" : "inherit"
                                }}
                                onClick={() => navigate(STATISTICS_URL)}
                            >
                                <BarChartIcon />
                                {t('statistics')}
                            </Button>

                            <Button
                                sx={{
                                    textTransform: 'inherit',
                                    color: location.pathname === "/profile" ? "secondary.light" : "inherit"
                                }}
                                onClick={() => navigate("/profile")}
                            >
                                <PersonIcon />
                                {t('profile')}
                            </Button>

                            <Button
                                sx={{ textTransform: 'inherit' }}
                                color="inherit"
                                onClick={() => {
                                    handleLogout();
                                    navigate(LOGIN_URL);
                                    window.location.reload();
                                }}
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

export default NavBar;
