import {useEffect, useState} from 'react';
import {Box, Stack, Table, TableBody, TableCell, TableRow, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

function AdminDashboardSSE() {
    const [dashboardData, setDashboardData] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        const source = new EventSource(`http://localhost:8080/api/sse/admin-dashboard?token=${token}`);
        source.addEventListener('adminDashboard', event => {
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
        return <Typography>{t('loadingAdminDashboard')}</Typography>;
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h5" mb={2}>{t('adminDashboard')}</Typography>
            <Stack spacing={2}>
                <Typography>{t('totalUsersAdmin')} {dashboardData.totalUsers}</Typography>
                <Typography>{t('totalAttemptsAdmin')} {dashboardData.totalAttempts}</Typography>
                <Typography>
                    {t('overallSuccessRateAdmin')} {(dashboardData.overallSuccessRate * 100).toFixed(1)}%
                </Typography>

                <Box>
                    <Typography variant="subtitle1">{t('attemptsByTopicAdmin')}</Typography>
                    <Table>
                        <TableBody>
                            {Object.entries(dashboardData.attemptsByTopic).map(([topic, count]) => (
                                <TableRow key={topic}>
                                    <TableCell>{t(topic)}</TableCell>
                                    <TableCell>{count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                <Box>
                    <Typography variant="subtitle1">{t('successRateByTopicAdmin')}</Typography>
                    <Table>
                        <TableBody>
                            {Object.entries(dashboardData.successRateByTopic).map(([topic, rate]) => (
                                <TableRow key={topic}>
                                    <TableCell>{t(topic)}</TableCell>
                                    <TableCell>{(rate * 100).toFixed(1)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Stack>
        </Box>
    );
}

export default AdminDashboardSSE;


