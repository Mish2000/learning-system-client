import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Divider,
    Container,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Fade
} from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { SERVER_URL } from "../../utils/Constants";
import ChartTotalSuccessRate from "./Statistics/ChartTotalSuccessRate.jsx";
import ChartSuccessRateByTopic from "./Statistics/ChartSuccessRateByTopic.jsx";
import Loading from "../Common/Loading.jsx";

export default function UserDashboardSSE() {
    const { t } = useTranslation();
    const theme = useTheme();

    const [profile, setProfile] = useState(null);
    const [data, setData] = useState(null);

    // Load profile (for greeting)
    useEffect(() => {
        axios
            .get(`${SERVER_URL}/profile`, { withCredentials: true })
            .then((r) => setProfile(r.data))
            .catch(() => setProfile(null));
    }, []);

    // SSE: user dashboard
    useEffect(() => {
        const ev = new EventSource(`${SERVER_URL}/sse/user-dashboard`, { withCredentials: true });
        const handler = (e) => setData(JSON.parse(e.data));
        ev.addEventListener("userDashboard", handler);
        ev.onerror = () => ev.close();
        return () => ev.close();
    }, []);

    const topicRows = useMemo(() => {
        if (!data?.topicDifficulty) return [];
        return Object.entries(data.topicDifficulty).map(([topic, level]) => ({ topic, level }));
    }, [data]);

    const subtopicRows = useMemo(() => {
        if (!data?.subtopicDifficulty) return [];
        return Object.entries(data.subtopicDifficulty).map(([topic, level]) => ({ topic, level }));
    }, [data]);

    const overallProgressLevel = data?.overallProgressLevel || null;
    const overallProgressScore = typeof data?.overallProgressScore === "number"
        ? data.overallProgressScore.toFixed(2)
        : null;

    if (!profile && !data) {
        return (
            <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
                <Loading />
            </Box>
        );
    }

    const getRankText = (score) => {
        const rounded = Math.round(Number(score));
        if (rounded >= 1 && rounded <= 5) {
            return t(`rank${rounded}`);
        }
        return `${score} / 5`;
    };

    return (
        <Fade in={true} timeout={600}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* ... (Header remains unchanged) ... */}

                <Grid container spacing={3}>
                    {/* Overall Progress Card */}
                    <Grid item xs={12} md={6} lg={4}>
                        <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                                        <EmojiEventsIcon />
                                    </Avatar>
                                }
                                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                                title={t('overallProgress')}
                            />
                            <Divider />
                            <CardContent>
                                {overallProgressLevel ? (
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800 }}>
                                            {t(overallProgressLevel)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            {t('overallProgressLevel')}
                                        </Typography>

                                        {overallProgressScore && (
                                            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                {/* CHANGED: Display text instead of number */}
                                                <Typography variant="h6" fontWeight="bold">
                                                    {getRankText(overallProgressScore)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {t('overallProgressScore')}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                ) : (
                                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                        {t('overallProgressPendingBackend')}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Total Success Rate Chart */}
                    <Grid item xs={12} md={6} lg={8}>
                        <Card sx={{ height: '100%' }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
                                        <AnalyticsIcon />
                                    </Avatar>
                                }
                                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                                title={t('totalSuccessRate')}
                            />
                            <Divider />
                            <CardContent>
                                {data ? (
                                    <ChartTotalSuccessRate data={data} />
                                ) : (
                                    <Typography align="center" sx={{ py: 4 }}>{t('loading')}…</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Success Rate By Topic Chart */}
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader
                                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                                title={t('successRateByTopic')}
                            />
                            <Divider />
                            <CardContent>
                                {data ? (
                                    <ChartSuccessRateByTopic data={data} />
                                ) : (
                                    <Typography align="center" sx={{ py: 4 }}>{t('loading')}…</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Parent Topic Difficulty Table */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: 'info.light' }}>
                                        <AssignmentIcon />
                                    </Avatar>
                                }
                                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                                title={t('parentTopicDifficulty')}
                            />
                            <Divider />
                            <CardContent sx={{ p: 0 }}>
                                {topicRows.length ? (
                                    <Table size="medium">
                                        <TableHead sx={{ bgcolor: 'background.default' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{t('topic')}</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="right">{t('difficulty')}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {topicRows.map((r) => (
                                                <TableRow key={r.topic} hover>
                                                    <TableCell>{t(r.topic)}</TableCell>
                                                    <TableCell align="right">
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                px: 1.5, py: 0.5,
                                                                borderRadius: 1,
                                                                bgcolor: 'action.hover',
                                                                fontWeight: 500,
                                                                fontSize: '0.875rem'
                                                            }}
                                                        >
                                                            {t(r.level)}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography color="text.secondary">
                                            {t('topicDifficultyPendingBackend')}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Subtopic Difficulty Table */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: 'warning.light' }}>
                                        <AssignmentIcon />
                                    </Avatar>
                                }
                                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                                title={t('subtopicDifficulty')}
                            />
                            <Divider />
                            <CardContent sx={{ p: 0 }}>
                                {subtopicRows.length ? (
                                    <Table size="medium">
                                        <TableHead sx={{ bgcolor: 'background.default' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{t('subtopic')}</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="right">{t('difficulty')}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {subtopicRows.map((r) => (
                                                <TableRow key={r.topic} hover>
                                                    <TableCell>{t(r.topic)}</TableCell>
                                                    <TableCell align="right">
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                px: 1.5, py: 0.5,
                                                                borderRadius: 1,
                                                                bgcolor: 'action.hover',
                                                                fontWeight: 500,
                                                                fontSize: '0.875rem'
                                                            }}
                                                        >
                                                            {t(r.level)}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <Box sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography color="text.secondary">
                                            {t('subtopicDifficultyPendingBackend')}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Fade>
    );
}