import { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { SERVER_URL } from "../../utils/Constants.js";

// Icons
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Charts
import ChartSuccessRateByTopic from "../Dashboard/Statistics/ChartSuccessRateByTopic.jsx";
import Loading from "../Common/Loading.jsx";

function AdminDashboardSSE() {
    const [dashboardData, setDashboardData] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const source = new EventSource(`${SERVER_URL}/sse/admin-dashboard`, {
            withCredentials: true,
        });

        source.addEventListener("adminDashboard", (event) => {
            try {
                setDashboardData(JSON.parse(event.data));
            } catch (e) {
                console.error("Failed to parse admin dashboard data", e);
            }
        });

        source.onerror = () => source.close();
        return () => source.close();
    }, []);

    if (!dashboardData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Loading />
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {/* --- KPI Cards --- */}
            <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                            <GroupIcon fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography color="text.secondary" variant="overline" fontWeight="bold">
                                {t("totalUsersAdmin")}
                            </Typography>
                            <Typography variant="h4" fontWeight="800">
                                {dashboardData.totalUsers}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', width: 56, height: 56 }}>
                            <AssessmentIcon fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography color="text.secondary" variant="overline" fontWeight="bold">
                                {t("totalAttemptsAdmin")}
                            </Typography>
                            <Typography variant="h4" fontWeight="800">
                                {dashboardData.totalAttempts}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.contrastText', width: 56, height: 56 }}>
                            <EmojiEventsIcon fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography color="text.secondary" variant="overline" fontWeight="bold">
                                {t("overallSuccessRateAdmin")}
                            </Typography>
                            <Typography variant="h4" fontWeight="800">
                                {Number(dashboardData.overallSuccessRate).toFixed(1)}%
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* --- Charts --- */}
            {/* Updated width to xs={12} to fill the row since the circular chart was removed */}
            <Grid item xs={12}>
                <Card sx={{ height: '100%' }}>
                    <CardHeader title={t("successRateByTopicAdmin")} />
                    <Divider />
                    <CardContent>
                        <ChartSuccessRateByTopic data={dashboardData} />
                    </CardContent>
                </Card>
            </Grid>

            {/* --- Table: Attempts by Topic --- */}
            <Grid item xs={12}>
                <Card>
                    <CardHeader title={t("attemptsByTopicAdmin")} />
                    <Divider />
                    <CardContent sx={{ p: 0 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: 'background.default' }}>
                                <TableRow>
                                    <TableCell><b>{t('topic')}</b></TableCell>
                                    <TableCell align="right"><b>{t('totalAttemptsAdmin')}</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(dashboardData.attemptsByTopic).map(([topic, count]) => (
                                    <TableRow key={topic} hover>
                                        <TableCell>{t(topic)}</TableCell>
                                        <TableCell align="right">{count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default AdminDashboardSSE;