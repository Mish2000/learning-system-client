import PropTypes from "prop-types";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Box, Typography} from "@mui/material";

function ChartTotalSuccessRate({ data }) {
    if (!data || typeof data.successRate !== 'number') {
        return <Typography>No overall success data</Typography>;
    }

    const chartData = [
        { name: 'Overall Success', value: Math.round(data.successRate * 100) },
    ];

    return (
        <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6" gutterBottom>Overall Success Rate</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}

ChartTotalSuccessRate.propTypes = {
    data: PropTypes.shape({
        successRate: PropTypes.number,
        totalAttempts: PropTypes.number,

    })
};

export default ChartTotalSuccessRate;
