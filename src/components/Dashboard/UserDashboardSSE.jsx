import {useEffect, useState} from 'react';
import {Box, Typography, Divider} from "@mui/material";
import ChartTotalSuccessRate from "./Statistics/ChartTotalSuccessRate.jsx";
import ChartSuccessRateByTopic from "./Statistics/ChartSuccessRateByTopic.jsx";
import Loading from "../Common/Loading.jsx";
import {useTranslation} from "react-i18next";
import {SERVER_URL} from "../../utils/Constants.js";

export default function UserDashboardSSE() {
    const [dashboardData, setDashboardData] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const source = new EventSource(`${SERVER_URL.replace('/api','')}/api/sse/user-dashboard`, { withCredentials: true });

        source.addEventListener('userDashboard', (e) => {
            try {
                setDashboardData(JSON.parse(e.data));
            } catch {
                // ignore malformed packet
            }
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

    const topicDiff = dashboardData.topicDifficulty || {};
    const subtopicDiff = dashboardData.subtopicDifficulty || {};

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                {t('userDashboardTitle')}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
                {t('currentDifficulty')}: {t(dashboardData.currentDifficulty || 'BASIC')}
            </Typography>

            {dashboardData.overallProgressLevel && (
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    {t('overallProgressLevel')}: {t(dashboardData.overallProgressLevel)}
                </Typography>
            )}

            {Object.keys(topicDiff).length > 0 && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>{t('topicDifficulties')}</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                        {Object.entries(topicDiff).map(([name, lvl]) => (
                            <Box key={name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{t(name)}</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{t(lvl)}</Typography>
                            </Box>
                        ))}
                    </Box>
                </>
            )}

            {/* NEW: Live difficulty by Subtopic */}
            {Object.keys(subtopicDiff).length > 0 && (
                <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>{t('subtopicDifficulties')}</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                        {Object.entries(subtopicDiff).map(([name, lvl]) => (
                            <Box key={name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>{t(name)}</Typography>
                                <Typography sx={{ fontWeight: 600 }}>{t(lvl)}</Typography>
                            </Box>
                        ))}
                    </Box>
                </>
            )}

            <Divider sx={{ my: 3 }} />
            <ChartSuccessRateByTopic data={dashboardData} />
            <ChartTotalSuccessRate data={dashboardData} />
        </Box>
    );
}
