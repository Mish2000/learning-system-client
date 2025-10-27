import {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import ChartTotalSuccessRate from "./Statistics/ChartTotalSuccessRate.jsx";
import ChartSuccessRateByTopic from "./Statistics/ChartSuccessRateByTopic.jsx";
import Loading from "../Common/Loading.jsx";
import {useTranslation} from "react-i18next";
import {SERVER_URL} from "../../utils/Constants.js";

export default function UserDashboardSSE() {
    const [dashboardData, setDashboardData] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const source = new EventSource(`${SERVER_URL}/sse/user-dashboard`, { withCredentials: true });

        source.addEventListener('userDashboard', (event) => {
            setDashboardData(JSON.parse(event.data));
        });

        source.onerror = () => {
            source.close();
        };

        return () => source.close();
    }, []);

    if (!dashboardData) {
        return (
            <Box>
                <Typography variant="h3" sx={{ margin: 10 }}>
                    {t('loadingUserDashboardPage')}
                </Typography>
                <Loading />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                {t('userDashboardTitle')}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
                {t('currentDifficulty')}: {t(dashboardData.currentDifficulty || 'BASIC')}
            </Typography>

            {/* New field (will appear after backend refactor). If absent, nothing breaks. */}
            {dashboardData.overallProgressLevel && (
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    {t('overallProgressLevel')}: {t(dashboardData.overallProgressLevel)}
                </Typography>
            )}

            <ChartSuccessRateByTopic data={dashboardData} />
            <ChartTotalSuccessRate data={dashboardData} />
        </Box>
    );
}
