import { Box, LinearProgress, Typography } from '@mui/material';
import PropTypes from "prop-types";
import { useTranslation } from 'react-i18next';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}'":;?.<>,-])[\w\d~!@#$%^&*()_+={}'":;?.<>,-]{8,30}$/;

function calculateStrength(password) {
    if (!password) {
        return { score: 0, label: "Invalid" };
    }

    if (!passwordRegex.test(password)) {
        return { score: 0, label: "Invalid" };
    }

    const length = password.length;
    let score;
    let label;

    if (length < 10) {
        score = 1;
        label = "Weak";
    } else if (length < 14) {
        score = 2;
        label = "Normal";
    } else {
        score = 3;
        label = "Strong";
    }

    return { score, label };
}

export default function PasswordStrengthIndicator({ password }) {
    const { t } = useTranslation();
    const { score, label } = calculateStrength(password);
    const maxScore = 3;
    const progress = (score / maxScore) * 100;

    return (
        <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
                {t('passwordStrength')}{' '}{t(label)}
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
        </Box>
    );
}

PasswordStrengthIndicator.propTypes = {
    password: PropTypes.string,
};





