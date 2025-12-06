import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    TextField,
    Typography,
    Container,
    Fade
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import PasswordTextField from "../Common/PasswordTextField.jsx";
import { LOGIN_URL } from "../../utils/Constants.js";
import { registerUser } from '../../services/UserAPI.js';
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../Common/LanguageSwitcher.jsx";
import PasswordStrengthIndicator from "../Common/PasswordStrengthIndicator.jsx";

function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Updated regex to include Hebrew characters (\u0590-\u05FF)
    const usernameRegex = /^[a-zA-Z0-9\u0590-\u05FF]{4,30}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}'":;?.<>,-])[\w\d~!@#$%^&*()_+={}'":;?.<>,-]{8,30}$/;

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeat, setRepeat] = useState("");

    const [alertVisible, setAlertVisible] = useState(false);
    const [error, setError] = useState("");

    const usernameError = (username.length > 0 && !usernameRegex.test(username));
    const emailError = (email.length > 0 && !emailRegex.test(email));
    const passwordError = (password.length > 0 && !passwordRegex.test(password));
    const repeatError = (repeat.length > 0 && repeat !== password);

    const noError = !usernameError && !emailError && !passwordError && !repeatError;
    const notEmpty = username && email && password && repeat === password;

    async function createAccount() {
        try {
            const ok = await registerUser({ username, email, password });
            if (ok) {
                sessionStorage.setItem('postRegisterMessage', t('registerSuccess'));
                navigate(LOGIN_URL, { replace: true });
            } else {
                setError(t('registrationError'));
                setAlertVisible(true);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            setError(t('registrationError'));
            setAlertVisible(true);
        }
    }

    return (
        <Fade in={true} timeout={600}>
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <LanguageSwitcher />
                </Box>

                <Container maxWidth="xs">
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, gap: 2 }}>
                                <Box
                                    component="img"
                                    src="src/assets/favicon.png"
                                    alt="QuickMath icon"
                                    sx={{ width: 50, height: 50 }}
                                />
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 800,
                                        background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {t('registerPageTitle')}
                                </Typography>
                            </Box>

                            <Stack spacing={2}>
                                {alertVisible && (
                                    <Alert severity="error">
                                        {error}
                                    </Alert>
                                )}

                                <TextField
                                    error={usernameError}
                                    helperText={t('usernameHelperText')}
                                    label={t('username')}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    fullWidth
                                    size="small"
                                />

                                <TextField
                                    error={emailError}
                                    type="email"
                                    helperText={t('emailHelperText')}
                                    label={t('email')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                    size="small"
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

                                <Box>
                                    <PasswordTextField
                                        error={passwordError}
                                        helperText={t('RegisterPasswordHelperText')}
                                        label={t('password')}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        fullWidth
                                        size="small"
                                    />
                                    {password && <PasswordStrengthIndicator password={password} />}
                                </Box>

                                <PasswordTextField
                                    error={repeatError}
                                    helperText={repeatError ? t('passwordsMustMatch') : ''}
                                    label={t('repeatPassword')}
                                    value={repeat}
                                    onChange={(e) => setRepeat(e.target.value)}
                                    fullWidth
                                    size="small"
                                />

                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => {
                                        if (noError && notEmpty) {
                                            setAlertVisible(false);
                                            createAccount();
                                        } else {
                                            setError(t('registrationError'));
                                            setAlertVisible(true);
                                        }
                                    }}
                                    sx={{ mt: 1 }}
                                >
                                    {t('createAccount')}
                                </Button>

                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('alreadyHaveAccount')}
                                    </Typography>
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => navigate(LOGIN_URL)}
                                        sx={{ minWidth: 'auto', p: 0.5 }}
                                    >
                                        {t('login')}
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </Fade>
    );
}

export default Register;