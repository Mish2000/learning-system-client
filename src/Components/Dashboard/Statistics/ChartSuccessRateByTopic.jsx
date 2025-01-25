import { Box, Typography } from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import PropTypes from 'prop-types';
import {useTranslation} from "react-i18next";

function ChartSuccessRateByTopic({ data }) {
    const { t } = useTranslation();

    if (!data || !data.successRateByTopic) {
        return <Typography>{t('noTopicData')}</Typography>;
    }

    const chartData = Object.entries(data.successRateByTopic).map(([topic, rate]) => ({
        name: t(topic),
        rate: Math.round(rate * 100)
    }));

    return (
        <Box sx={{ width: '100%', height: 300, marginTop: 2 }}>
            <Typography variant="h6" gutterBottom>{t('successRateTitle')}</Typography>
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
    data: PropTypes.object.isRequired,
};

export default ChartSuccessRateByTopic;


