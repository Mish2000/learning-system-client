import {useEffect, useState} from 'react';

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
        return <div>Loading admin dashboard ...</div>;
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Total Users: {dashboardData.totalUsers}</p>
            <p>Total Attempts: {dashboardData.totalAttempts}</p>
            <p>Overall Success Rate: {(dashboardData.overallSuccessRate * 100).toFixed(1)}%</p>
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

export default AdminDashboardSSE;

