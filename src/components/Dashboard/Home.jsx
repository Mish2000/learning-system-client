import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LOGIN_URL, REGISTER_URL } from '../../utils/Constants.js';
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../Common/LanguageSwitcher.jsx";


function Home() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '60vh',
                gap: 8,
                px: 2,
                pt: 2
            }}
        >
            {/* Top-right language selector (public) */}
            <Box sx={{ alignSelf: 'flex-end' }}>
                <LanguageSwitcher />
            </Box>

            <Typography variant="h4">{t('welcomeQuickMath')}</Typography>

            <Typography
                sx={{
                    fontFamily: "cursive",
                    maxWidth: "600px",
                    textAlign: "center",
                    lineHeight: 1.6,
                    wordBreak: "break-word"
                }}
            >
                {t('selfLearningMath')}
            </Typography>

            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={() => navigate(LOGIN_URL)}>
                    {t('login')}
                </Button>
                <Button variant="outlined" onClick={() => navigate(REGISTER_URL)}>
                    {t('register')}
                </Button>
            </Stack>
        </Box>
    );
}

export default Home;
