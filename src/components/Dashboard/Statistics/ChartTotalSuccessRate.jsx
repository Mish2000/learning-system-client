import PropTypes from "prop-types";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

function ChartTotalSuccessRate({ data }) {
    const { t } = useTranslation();
    const theme = useTheme();

    const hasData =
        data &&
        typeof data.successRate === "number" &&
        (!("totalAttempts" in data) || data.totalAttempts > 0);

    if (!hasData) {
        return (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                {t("noOverallSuccessData")}
            </Typography>
        );
    }

    const value = Math.round(data.successRate);

    // Color logic based on success rate
    let circleColor = theme.palette.error.main;
    if (value >= 50) circleColor = theme.palette.warning.main;
    if (value >= 70) circleColor = theme.palette.secondary.main;
    if (value >= 90) circleColor = theme.palette.success.main;

    return (
        <Box sx={{
            mt: 2,
            height: 260,
            width: "100%",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
            {/* Background Circle (Grey track) */}
            <CircularProgress
                variant="determinate"
                value={100}
                size={180}
                thickness={4}
                sx={{
                    color: theme.palette.action.hover,
                    position: 'absolute'
                }}
            />

            {/* Value Circle */}
            <CircularProgress
                variant="determinate"
                value={value}
                size={180}
                thickness={4}
                sx={{
                    color: circleColor,
                    strokeLinecap: 'round',
                }}
            />

            {/* Centered Text */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h3" fontWeight="800" color="text.primary">
                    {value}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('overallSuccess')}
                </Typography>
            </Box>
        </Box>
    );
}

ChartTotalSuccessRate.propTypes = {
    data: PropTypes.object.isRequired,
};

export default ChartTotalSuccessRate;