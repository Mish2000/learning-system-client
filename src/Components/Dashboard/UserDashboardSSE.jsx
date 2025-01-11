import {useEffect, useState} from 'react';
import {Box} from "@mui/material";
import AppIcon from "../AppIcon.jsx";
import QuestionGenerator from "../QuestionGenerator.jsx";
import AnswerSubmission from "../AnswerSubmission.jsx";

function UserDashboardSSE() {
    const [dashboardData, setDashboardData] = useState(null);

    const data =
        [
            {month: "Jan", avgTemp: 2.3, iceCreamSales: 162000},
            {month: "Mar", avgTemp: 6.3, iceCreamSales: 302000},
            {month: "May", avgTemp: 16.2, iceCreamSales: 800000},
            {month: "Jul", avgTemp: 22.8, iceCreamSales: 1254000},
            {month: "Sep", avgTemp: 14.5, iceCreamSales: 950000},
            {month: "Nov", avgTemp: 8.9, iceCreamSales: 200000},
        ]


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

    // if (!dashboardData) {
    //     return <div>Loading user dashboard ...</div>;
    // }


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: {xs: 0, sm: 4, md: 4, lg: 4},
                width: '100%',
                maxWidth: {xs: '90%', sm: '800px'},
                mx: 'auto',
            }}>
            <AppIcon size={80}/>
            <h2>User Dashboard</h2>
            <p>User ID: {dashboardData.userId}</p>
            <p>Total Attempts: {dashboardData.totalAttempts}</p>
            <p>Correct Attempts: {dashboardData.correctAttempts}</p>
            <p>Success Rate: {(dashboardData.successRate * 100).toFixed(1)}%</p>
            <h3>Attempts by Topic</h3>
            <ul>
                {Object.entries(dashboardData.attemptsByTopic).map(([topic, count]) => (
                    <li key={topic}>{topic}: {count}</li>
                ))}
            </ul>
            <h3>Success Rate by Topic</h3>
            <ul>
                {Object.entries(dashboardData.successRateByTopic).map(([topic, rate]) => (
                    <li key={topic}>{topic}: {(rate * 100).toFixed(1)}%</li>
                ))}
            </ul>
            <QuestionGenerator/>
            <AnswerSubmission/>
        </Box>
    );
}

export default UserDashboardSSE;


