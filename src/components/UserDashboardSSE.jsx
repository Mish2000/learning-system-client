import {useEffect, useState} from 'react';

function UserDashboardSSE() {
    const [dashboardData, setDashboardData] = useState(null);

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
        return <div>Loading user dashboard ...</div>;
    }

    return (
        <div>
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
        </div>
    );
}

export default UserDashboardSSE;


