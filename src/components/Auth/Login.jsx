import { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Snackbar,
    Stack,
    TextField,
    Typography,
    Container,
    Fade,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { REGISTER_URL, SERVER_URL, HOME_URL } from "../../utils/Constants.js";
import PasswordTextField from "../Common/PasswordTextField.jsx";
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
    const [isAdmin, setIsAdmin] = useState(false);
    const [loginError, setLoginError] = useState(false);
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

            // Include isAdmin in the request payload
            await axios.post(`${SERVER_URL}/auth/login`, { email, password, isAdmin }, { withCredentials: true });

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
            navigate(HOME_URL, { replace: true });
        } catch {
            setLoginError(true);
        }
    }

    return (
        <Fade in={true} timeout={600}>
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <LanguageSwitcher />
                </Box>

                <Container maxWidth="xs">
                    <Card sx={{ borderRadius: 4, overflow: 'visible' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                <Box
                                    component="img"
                                    src="src/assets/favicon.png"
                                    alt="QuickMath pointer"
                                    sx={{ width: 80, height: 80, mb: 2 }}
                                />
                                <Typography
                                    variant="h4"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 800,
                                        background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {t('loginTitle')}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    {t('slogan')}
                                </Typography>
                            </Box>

                            <Stack spacing={3}>
                                {loginError && (
                                    <Alert severity="error" variant="filled">
                                        {t('loginFailed')}
                                    </Alert>
                                )}

                                <TextField
                                    error={loginError}
                                    type="email"
                                    label={t('email')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                    dir="ltr"
                                    InputLabelProps={{
                                        sx: {
                                            left: 0,
                                            right: 'auto',
                                            transformOrigin: 'top left',
                                            textAlign: 'left'
                                        }
                                    }}
                                    InputProps={{
                                        style: { textAlign: 'left', direction: 'ltr' }
                                    }}
                                />

                                <PasswordTextField
                                    error={loginError}
                                    type="password"
                                    label={t('password')}
                                    value={password}
                                    helperText={t('loginPasswordHelperText')}
                                    onChange={(e) => setPassword(e.target.value)}
                                    fullWidth
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isAdmin}
                                            onChange={(e) => setIsAdmin(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label={t('loginAsAdmin')}
                                />

                                <Button
                                    variant='contained'
                                    size="large"
                                    onClick={handleLogin}
                                    fullWidth
                                    sx={{ py: 1.5, fontSize: '1.1rem' }}
                                >
                                    {t('login')}
                                </Button>

                                <Box sx={{ textAlign: 'center', mt: 1 }}>
                                    <Button
                                        variant='text'
                                        onClick={() => navigate(REGISTER_URL)}
                                    >
                                        {t('createAccount')}
                                    </Button>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Container>

                <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                    <Alert severity="success" onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
                        {snackbarMessage || t('registerSuccess')}
                    </Alert>
                </Snackbar>
            </Box>
        </Fade>
    );
}

Login.propTypes = {
    onLoginSuccess: PropTypes.func,
};

export default Login;