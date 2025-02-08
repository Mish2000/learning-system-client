import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {STATISTICS_URL, LOGIN_URL, PRACTICE_URL, PROFILE_URL, REGISTER_URL} from '../../utils/Constants.js';
import {useTranslation} from "react-i18next";

function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');
    const role  = localStorage.getItem('role');
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: 8
            }}
        >
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

            {!token && (
                <Stack spacing={2} direction="row">
                    <Button
                        variant="contained"
                        onClick={() => navigate(LOGIN_URL)}
                    >
                        {t('login')}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(REGISTER_URL)}
                    >
                        {t('register')}
                    </Button>
                </Stack>
            )}

            {token && (
                <Stack spacing={2} direction="row">
                    <Button
                        variant="contained"
                        onClick={() => navigate(PRACTICE_URL)}
                    >
                        {t('startPracticing')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate(PROFILE_URL)}
                    >
                        {t('goToProfilePage')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate(STATISTICS_URL)}
                    >
                        {t('seeYourStatistics')}
                    </Button>
                </Stack>
            )}
        </Box>
    );
}


export default Home;


