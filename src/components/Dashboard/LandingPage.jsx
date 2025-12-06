import { useState } from 'react';
import { Box, Typography, Button, Stack, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LOGIN_URL, REGISTER_URL } from '../../utils/Constants.js';
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../Common/LanguageSwitcher.jsx";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AiInstallationGuide from "./AiInstallationGuide.jsx";

function LandingPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [guideOpen, setGuideOpen] = useState(false);

    return (
        <Fade in={true} timeout={600}>
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

                <Box
                    component="img"
                    src="src/assets/favicon.png"
                    alt="QuickMath icon"
                    sx={{
                        width: { xs: 120, sm: 150 },
                        height: "auto",
                        filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
                        transform: "rotate(-8deg)",
                        mt: 1,
                        mb: -2,
                        opacity: 0.95
                    }}
                />

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>
                        {t('welcomeQuickMath')}
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: "cursive",
                            maxWidth: "600px",
                            mx: "auto",
                            lineHeight: 1.6,
                            wordBreak: "break-word",
                            color: 'text.secondary'
                        }}
                    >
                        {t('selfLearningMath')}
                    </Typography>
                </Box>

                <Stack spacing={3} alignItems="center">
                    {/* Main Actions */}
                    <Stack spacing={2} direction="row">
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate(LOGIN_URL)}
                            sx={{ px: 4 }}
                        >
                            {t('login')}
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate(REGISTER_URL)}
                            sx={{ px: 4 }}
                        >
                            {t('register')}
                        </Button>
                    </Stack>

                    {/* AI Installation Guide Trigger */}
                    <Button
                        variant="text"
                        color="secondary"
                        startIcon={<AutoAwesomeIcon />}
                        onClick={() => setGuideOpen(true)}
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            '&:hover': {
                                backgroundColor: 'secondary.lighter',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    >
                        {t('aiSetupGuide')}
                    </Button>
                </Stack>

                {/* Installation Guide Dialog */}
                <AiInstallationGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
            </Box>
        </Fade>
    );
}

export default LandingPage;