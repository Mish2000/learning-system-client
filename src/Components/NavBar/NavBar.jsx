import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Box, Button, Stack} from "@mui/material";
import AppIcon from "../AppIcon.jsx";
import LogoutIcon from '@mui/icons-material/Logout';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {DASHBOARD_URL, HOME_URL, LOGIN_URL, PRACTICE_URL} from "../../Utils/Constants.js";
import CalculateIcon from '@mui/icons-material/Calculate';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeIcon from '@mui/icons-material/Home';
import {handleLogout} from "../../API/Logout.js";

function NavBar(props) {
    const location = useLocation();
    const navigate = useNavigate();


    return (
        <Stack spacing={10}>
            <AppBar position="fixed" color="primary">
                <Toolbar>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <AppIcon size={50}/>
                            <Typography variant="h6" component="div">
                                Quick Math
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={4}>
                            <Button
                                sx={{
                                    textTransform: 'inherit',
                                    color: location.pathname === HOME_URL ? "secondary.light" : "inherit"
                                }}
                                onClick={() => {
                                    navigate(HOME_URL)
                                }}
                            >
                                <HomeIcon/>
                                Home</Button>

                            <Button sx={{
                                textTransform: 'inherit',
                                color: location.pathname === PRACTICE_URL ? "secondary.light" : "inherit"
                            }}
                                    onClick={() => {
                                        navigate(PRACTICE_URL)
                                    }}
                            >
                                <CalculateIcon/>
                                Practice
                            </Button>

                            <Button sx={{
                                textTransform: 'inherit',
                                color: location.pathname === DASHBOARD_URL ? "secondary.light" : "inherit"
                            }}
                                    onClick={() => {
                                        navigate(DASHBOARD_URL)
                                    }}
                            >
                                <BarChartIcon/>
                                Statistics
                            </Button>

                            <Button sx={{textTransform: 'inherit'}}
                                    color="inherit"
                                    onClick={() => {
                                        handleLogout()

                                        window.location.reload()
                                        navigate(LOGIN_URL)
                                    }
                                    }
                            >
                                <LogoutIcon/>
                                Log Out
                            </Button>
                        </Stack>
                    </Box>
                </Toolbar>
            </AppBar>
            <Outlet/>
        </Stack>
    );
}

export default NavBar;