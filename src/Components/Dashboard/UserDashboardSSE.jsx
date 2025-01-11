import {useEffect, useState} from 'react';
import {Box,  Typography} from "@mui/material";
import ChartTotalSuccessRate from "../Statistics/ChartTotalSuccessRate.jsx";
import ChartSuccessRateByTopic from "../Statistics/ChartSuccessRateByTopic.jsx";


function UserDashboardSSE() {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        const source = new EventSource(`http://localhost:8080/api/sse/user-dashboard?token=${token}`);
        source.addEventListener('userDashboard', event => {
            setDashboardData(JSON.parse(event.data));
        });
        source.onerror = () => {
            source.close();
        };
        return () => {
            source.close();
        };
    }, []);

    if (!dashboardData) {
        return <Typography>Loading user dashboard ...</Typography>;
    }

    return (
        <Box>
            <Typography variant="h5">User Dashboard</Typography>
            <ChartSuccessRateByTopic data={dashboardData}/>
            <ChartTotalSuccessRate data={dashboardData} />
        </Box>
    );
}

export default UserDashboardSSE;



