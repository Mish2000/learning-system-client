import { Box, Typography } from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import PropTypes from 'prop-types';

function ChartSuccessRateByTopic({ data }) {
    if (!data || !data.successRateByTopic) {
        return <Typography>No topic data available</Typography>;
    }

    const chartData = Object.entries(data.successRateByTopic).map(([topic, rate]) => ({
        name: topic,
        rate: Math.round(rate * 100)
    }));

    return (
        <Box sx={{ width: '100%', height: 300, marginTop: 2 }}>
            <Typography variant="h6" gutterBottom>Success Rate by Topic</Typography>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="rate" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}

ChartSuccessRateByTopic.propTypes = {
    data: PropTypes.shape({
        successRateByTopic: PropTypes.object
    })
};

export default ChartSuccessRateByTopic;


