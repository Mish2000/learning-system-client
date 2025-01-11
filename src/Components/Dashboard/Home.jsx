import React from 'react';
import {Box, Typography} from "@mui/material";
import {getUsername} from "../../API/UserAPI.js";
import { PieChart } from '@mui/x-charts/PieChart';

 function Home() {
    // const token = localStorage.getItem("token");
    // const username = getUsername(token);


    return (
        <Box >
            <Typography>
                Welcome lior!
            </Typography>

        </Box>
    );
}

export default Home;