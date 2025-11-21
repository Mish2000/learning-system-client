import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Table, TableHead, TableRow, TableCell, TableBody,
    Divider
} from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { SERVER_URL } from "../../utils/Constants";
import ChartTotalSuccessRate from "./Statistics/ChartTotalSuccessRate.jsx";
import ChartSuccessRateByTopic from "./Statistics/ChartSuccessRateByTopic.jsx";

export default function UserDashboardSSE() {
    const { t } = useTranslation();
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

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                {profile?.username ? `${t('welcomeBack')}, ${profile.username}!` : t('welcomeBack')}
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            {t('overallProgress')}
                        </Typography>
                        {overallProgressLevel ? (
                            <>
                                <Typography sx={{ mb: 1 }}>
                                    {t('overallProgressLevel')}: <b>{t(overallProgressLevel)}</b>
                                </Typography>
                                {overallProgressScore && (
                                    <Typography sx={{ color: "text.secondary" }}>
                                        {t('overallProgressScore')}: {overallProgressScore} / 5
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <Typography sx={{ color: "text.secondary" }}>
                                {t('overallProgressPendingBackend')}
                            </Typography>
                        )}
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            {t('successRateByTopic')}
                        </Typography>
                        {data ? <ChartSuccessRateByTopic data={data} /> : <Typography>{t('loading')}…</Typography>}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            {t('totalSuccessRate')}
                        </Typography>
                        {data ? <ChartTotalSuccessRate data={data} /> : <Typography>{t('loading')}…</Typography>}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            {t('parentTopicDifficulty')}
                        </Typography>
                        {topicRows.length ? (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('topic')}</TableCell>
                                        <TableCell>{t('difficulty')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topicRows.map((r) => (
                                        <TableRow key={r.topic}>
                                            <TableCell>{t(r.topic)}</TableCell>
                                            <TableCell>{t(r.level)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography sx={{ color: "text.secondary" }}>
                                {t('topicDifficultyPendingBackend')}
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            {t('subtopicDifficulty')}
                        </Typography>
                        {subtopicRows.length ? (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('subtopic')}</TableCell>
                                        <TableCell>{t('difficulty')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {subtopicRows.map((r) => (
                                        <TableRow key={r.topic}>
                                            <TableCell>{t(r.topic)}</TableCell>
                                            <TableCell>{t(r.level)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography sx={{ color: "text.secondary" }}>
                                {t('subtopicDifficultyPendingBackend')}
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
