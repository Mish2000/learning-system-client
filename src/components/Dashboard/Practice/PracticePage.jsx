import PropTypes from 'prop-types';
import {Box, Typography, Stack, Card} from '@mui/material';
import QuestionGenerator from "./QuestionGenerator.jsx";
import {useTranslation} from "react-i18next";

function PracticePage({ onLogout }) {
    const { t,i18n } = useTranslation();
    return (
        <Box
            sx={{

                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginTop: 4,
                alignItems: "center"
            }}
        >
            <Typography variant="h3" mb={2}>
                {t('timeToPractice')}
            </Typography>

            <Stack spacing={4} sx={{ marginTop: 0, width: "100%", maxWidth: "800px" }}>
                <Card>
                    <QuestionGenerator />
                </Card>
            </Stack>
        </Box>
    );
}

PracticePage.propTypes = {
    onLogout: PropTypes.func
};

export default PracticePage;