import {useEffect, useState} from 'react';
import {Table, TableCell, Typography} from "@mui/material";

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
        <div>
            <Typography>Admin Dashboard</Typography>
            <Typography>Total Users: {dashboardData.totalUsers}</Typography>
            <Typography>Total Attempts: {dashboardData.totalAttempts}</Typography>
            <Typography>Overall Success Rate: {(dashboardData.overallSuccessRate * 100).toFixed(1)}%</Typography>
            <Typography>Attempts by Topic</Typography>
            <Table>
                {Object.entries(dashboardData.attemptsByTopic).map(([topic, count]) => (
                    <TableCell key={topic}>{topic}: {count}</TableCell>
                ))}
            </Table>
            <Typography>Success Rate by Topic</Typography>
            <Table>
                {Object.entries(dashboardData.successRateByTopic).map(([topic, rate]) => (
                    <TableCell key={topic}>{topic}: {(rate * 100).toFixed(1)}%</TableCell>
                ))}
            </Table>
        </div>
    );
}

export default AdminDashboardSSE;

