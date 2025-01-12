import {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import ChartTotalSuccessRate from "../Statistics/ChartTotalSuccessRate.jsx";
import ChartSuccessRateByTopic from "../Statistics/ChartSuccessRateByTopic.jsx";
import Loading from "../Loading.jsx";


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
        return (
            <>
                <Typography variant={"h3"} sx={{margin:10}}>Loading user dashboard ...</Typography>
                <Box sx={{ display:"ruby-text",width:'100%', height:'100%'}}>
                    <Loading style={{width:"100%",alignItems: "center", justifyContent:"center"}} />
                </Box>
            </>
        );
    }

    return (
        <Box>
            <Typography variant="h5">User Dashboard</Typography>
            <ChartSuccessRateByTopic data={dashboardData}/>
            <ChartTotalSuccessRate data={dashboardData}/>
        </Box>
    );
}

export default UserDashboardSSE;



