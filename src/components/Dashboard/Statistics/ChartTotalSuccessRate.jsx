import PropTypes from 'prop-types';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function ChartTotalSuccessRate({ data }) {
    const { t } = useTranslation();

    const hasData =
        data &&
        typeof data.successRate === 'number' &&
        (!('totalAttempts' in data) || data.totalAttempts > 0);

    if (!hasData) {
        return <Typography>{t('noOverallSuccessData')}</Typography>;
    }

    const chartData = [
        { name: t('overallSuccess'), value: Math.round(data.successRate * 100) },
    ];

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                {t('overallSuccessTitle')}
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}

ChartTotalSuccessRate.propTypes = {
    data: PropTypes.object.isRequired,
};

export default ChartTotalSuccessRate;
