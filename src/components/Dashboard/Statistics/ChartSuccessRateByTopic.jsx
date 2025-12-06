import { Box, Typography } from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

function ChartSuccessRateByTopic({ data }) {
    const { t } = useTranslation();
    const theme = useTheme();

    const hasData =
        data &&
        data.successRateByTopic &&
        Object.keys(data.successRateByTopic).length > 0;

    if (!hasData) {
        return (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                {t("noTopicData")}
            </Typography>
        );
    }

    const chartData = Object.entries(data.successRateByTopic).map(
        ([topic, rate]) => ({
            name: t(topic),
            rate: typeof rate === "number" ? Number(rate.toFixed(1)) : 0,
        })
    );

    return (
        <Box sx={{ width: "100%", height: 450, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: theme.palette.text.secondary, dy: 10, fontSize: '0.85rem' }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{ fill: theme.palette.text.secondary }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: theme.palette.action.hover }}
                        formatter={(v) => [`${v}%`, t('successRate') || 'Success Rate']}
                        contentStyle={{
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: theme.shape.borderRadius,
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[2]
                        }}
                    />
                    <Bar dataKey="rate" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}

ChartSuccessRateByTopic.propTypes = {
    data: PropTypes.object.isRequired,
};

export default ChartSuccessRateByTopic;