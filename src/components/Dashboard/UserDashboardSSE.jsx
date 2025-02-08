import {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import ChartTotalSuccessRate from "./Statistics/ChartTotalSuccessRate.jsx";
import ChartSuccessRateByTopic from "./Statistics/ChartSuccessRateByTopic.jsx";
import Loading from "../Common/Loading.jsx";
import {useTranslation} from "react-i18next";

function UserDashboardSSE() {
    const [dashboardData, setDashboardData] = useState(null);
    const {t} = useTranslation();

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
            <Box>
                <Typography variant={"h3"} sx={{ margin: 10 }}>{t('loadingUserDashboardPage')}</Typography>
                <Loading />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5">{t('userDashboardTitle')}</Typography>
            <ChartSuccessRateByTopic data={dashboardData} />
            <ChartTotalSuccessRate data={dashboardData} />
        </Box>
    );
}

export default UserDashboardSSE;



