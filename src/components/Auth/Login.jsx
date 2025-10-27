import { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { REGISTER_URL, STATISTICS_URL, SERVER_URL } from "../../utils/Constants.js";
import PasswordTextField from "../Common/PasswordTextField.jsx";
import AppIcon from "../Common/AppIcon.jsx";
import axios from "axios";
import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import LanguageSwitcher from "../Common/LanguageSwitcher.jsx";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function Login({ onLoginSuccess }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false);

    // Snackbar for "Registration successful" message passed from Register.jsx
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        const msg = sessionStorage.getItem('postRegisterMessage');
        if (msg) {
            setSnackbarMessage(msg);
            setSnackbarOpen(true);
            sessionStorage.removeItem('postRegisterMessage');
        }
    }, []);

    const handleCloseSnackbar = () => setSnackbarOpen(false);

    async function handleLogin() {
        try {
            if (!emailRegex.test(email.trim())) {
                setLoginError(true);
                return;
            }

            await axios.post(`${SERVER_URL}/auth/login`, { email, password }, { withCredentials: true });

            // Fetch profile to capture interfaceLanguage (and optionally role, etc.)
            const profResp = await axios.get(`${SERVER_URL}/profile`, { withCredentials: true });
            const userLang = (profResp?.data?.interfaceLanguage || 'en').toLowerCase();

            if (userLang.startsWith('he') || userLang === 'עברית') {
                await i18n.changeLanguage('he');
                setCookie('language', 'he');
            } else {
                await i18n.changeLanguage('en');
                setCookie('language', 'en');
            }

            setLoginError(false);
            onLoginSuccess && onLoginSuccess(null, profResp?.data?.role);

            // Redirect to landing/dashboard
            navigate(STATISTICS_URL, { replace: true });
        } catch {
            setLoginError(true);
        }
    }

    return (
        <Box
            sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: '100vh', padding: { xs: 0, sm: 4, md: 4, lg: 4 }, width: '100%',
                maxWidth: { xs: '90%', sm: '850px' }, mx: 'auto'
            }}
        >
            {/* Top-right language selector (public) */}
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <LanguageSwitcher />
            </Box>

            <Card sx={{ display: "flex", flexDirection: "column", width: '100%', boxShadow: 3 }} variant="outlined">
                <Stack direction={"column"} spacing={2} padding={2}>
                    <Stack direction={"row"} spacing={2}>
                        <AppIcon size={70} />
                        <Stack margin={1}>
                            <Typography variant='h4'>{t('loginTitle')}</Typography>
                            <Typography>{t('slogan')}</Typography>
                        </Stack>
                    </Stack>

                    {loginError &&
                        <Typography color='error' variant="h7">
                            {t('loginFailed')}
                        </Typography>
                    }

                    <TextField
                        error={loginError}
                        variant="outlined"
                        type="email"
                        label={t('email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <PasswordTextField
                        error={loginError}
                        variant="outlined"
                        type="password"
                        label={t('password')}
                        value={password}
                        helperText={t('loginPasswordHelperText')}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button sx={{ textTransform: 'inherit' }} variant='contained' onClick={handleLogin}>
                        {t('login')}
                    </Button>

                    <Button sx={{ textTransform: 'inherit' }} variant='text' onClick={() => navigate(REGISTER_URL)}>
                        {t('createAccount')}
                    </Button>
                </Stack>
            </Card>

            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                <Alert severity="success" onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
                    {snackbarMessage || t('registerSuccess')}
                </Alert>
            </Snackbar>
        </Box>
    );
}

Login.propTypes = {
    onLoginSuccess: PropTypes.func,
};

export default Login;
