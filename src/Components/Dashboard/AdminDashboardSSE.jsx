import {useEffect, useState} from 'react';
import {Box, Stack, Table, TableBody, TableCell, TableRow, Typography} from "@mui/material";

function AdminDashboardSSE() {
    const [dashboardData, setDashboardData] = useState(null);

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
        return <Typography>Loading admin dashboard ...</Typography>;
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h5" mb={2}>Admin Dashboard</Typography>
            <Stack spacing={2}>
                <Typography>Total Users: {dashboardData.totalUsers}</Typography>
                <Typography>Total Attempts: {dashboardData.totalAttempts}</Typography>
                <Typography>
                    Overall Success Rate: {(dashboardData.overallSuccessRate * 100).toFixed(1)}%
                </Typography>

                <Box>
                    <Typography variant="subtitle1">Attempts by Topic:</Typography>
                    <Table>
                        <TableBody>
                            {Object.entries(dashboardData.attemptsByTopic).map(([topic, count]) => (
                                <TableRow key={topic}>
                                    <TableCell>{topic}</TableCell>
                                    <TableCell>{count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                <Box>
                    <Typography variant="subtitle1">Success Rate by Topic:</Typography>
                    <Table>
                        <TableBody>
                            {Object.entries(dashboardData.successRateByTopic).map(([topic, rate]) => (
                                <TableRow key={topic}>
                                    <TableCell>{topic}</TableCell>
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


