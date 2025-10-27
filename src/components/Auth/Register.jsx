import { useState } from 'react';
import { Alert, Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import PasswordTextField from "../Common/PasswordTextField.jsx";
import { LOGIN_URL } from "../../utils/Constants.js";
import { registerUser } from '../../services/UserAPI.js';
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../Common/LanguageSwitcher.jsx";
import PasswordStrengthIndicator from "../Common/PasswordStrengthIndicator.jsx";

function Register() {
    const { t } = useTranslation();
    const usernameRegex = /^[a-zA-Z0-9]{4,30}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}'":;?.<>,-])[\w\d~!@#$%^&*()_+={}'":;?.<>,-]{8,30}$/;

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [repeat, setRepeat]     = useState("");

    const [alertVisible, setAlertVisible] = useState(false);
    const [error, setError]               = useState("");
    const [success, setSuccess]           = useState(false);

    const usernameError = (username.length > 0 && !usernameRegex.test(username));
    const emailError    = (email.length > 0 && !emailRegex.test(email));
    const passwordError = (password.length > 0 && !passwordRegex.test(password));
    const repeatError   = (repeat.length > 0 && repeat !== password);

    const noError  = !usernameError && !emailError && !passwordError && !repeatError;
    const notEmpty = username && email && password && repeat === password;

    async function createAccount() {
        try {
            const ok = await registerUser({ username, email, password });
            if (ok) {
                setSuccess(true);
                // Show success on the login screen and redirect immediately
                sessionStorage.setItem('postRegisterMessage', t('registerSuccess'));
                navigate(LOGIN_URL, { replace: true });
            } else {
                setError(t('registrationError'));
            }
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            setError(t('registrationError'));
        }
    }

    return (
        <Box
            sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: '100vh', padding: { xs: 0, sm: 4 }, width: '100%', maxWidth: { xs: '90%', sm: '800px' }, mx: 'auto'
            }}
        >
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <LanguageSwitcher />
            </Box>

            <Card sx={{ width: '100%', boxShadow: 3 }} variant="outlined">
                <Stack spacing={2} padding={2}>
                    <Typography variant="h4">
                        {t('registerPageTitle')}
                    </Typography>

                    {success ? (
                        <Alert variant="filled" severity="success">
                            {t('registerSuccess')}
                        </Alert>
                    ) : (
                        <Typography variant="h7" color="error">
                            {error}
                        </Typography>
                    )}

                    <TextField
                        error={usernameError}
                        variant="outlined"
                        type="text"
                        helperText={t('usernameHelperText')}
                        label={t('username')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <TextField
                        error={emailError}
                        variant="outlined"
                        type="email"
                        helperText={t('emailHelperText')}
                        label={t('email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <PasswordTextField
                        error={passwordError}
                        helperText={t('RegisterPasswordHelperText')}
                        variant="outlined"
                        type="password"
                        label={t('password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <PasswordStrengthIndicator password={password} />

                    <PasswordTextField
                        error={repeatError}
                        helperText={repeatError ? t('passwordsMustMatch') : ''}
                        variant="outlined"
                        type="password"
                        label={t('repeatPassword')}
                        value={repeat}
                        onChange={(e) => setRepeat(e.target.value)}
                    />

                    {alertVisible && (
                        <Alert variant="filled" severity="error">
                            {t('registrationError')}
                        </Alert>
                    )}

                    <Button
                        sx={{ textTransform: 'inherit' }}
                        variant="contained"
                        onClick={() => {
                            if (noError && notEmpty) {
                                setAlertVisible(false);
                                createAccount();
                            } else {
                                setAlertVisible(true);
                            }
                        }}
                    >
                        {t('createAccount')}
                    </Button>

                    <Stack>
                        <Button
                            sx={{ textTransform: 'inherit' }}
                            variant="text"
                            onClick={() => navigate(LOGIN_URL)}
                        >
                            {t('login')}
                        </Button>
                        <Typography variant="caption" sx={{ justifyContent: 'center', display: 'flex' }}>
                            {t('alreadyHaveAccount')}
                        </Typography>
                    </Stack>
                </Stack>
            </Card>
        </Box>
    );
}

export default Register;
