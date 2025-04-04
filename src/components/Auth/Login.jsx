import {useState} from 'react';
import {Box, Button, Card, Stack, TextField, Typography} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import {HOME_URL, REGISTER_URL, SERVER_URL} from "../../utils/Constants.js";
import PasswordTextField from "../Common/PasswordTextField.jsx";
import AppIcon from "../Common/AppIcon.jsx";
import axios from "axios";
import PropTypes from 'prop-types';
import {useTranslation} from "react-i18next";
import LanguageSwitcher from "../Common/LanguageSwitcher.jsx";
import i18n from "i18next";

function Login({onLoginSuccess}) {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false);

    async function handleLogin() {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username: username,
                password: password
            });
            const {token, role} = response.data;
            onLoginSuccess(token, role);
            setLoginError(false);

            const profResp = await axios.get(`${SERVER_URL}/profile`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            const userLang = profResp.data.interfaceLanguage || 'en';

            if (userLang === 'עברית' || userLang === 'he') {
                i18n.changeLanguage('he');
                localStorage.setItem('language', 'he');
            } else {
                i18n.changeLanguage('en');
                localStorage.setItem('language', 'en');
            }
            navigate(HOME_URL);

            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setLoginError(true);
        }
    }


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: {xs: 0, sm: 4, md: 4, lg: 4},
                width: '100%',
                maxWidth: {xs: '90%', sm: '800px'},
                mx: 'auto',
            }}
        >
            <Box sx={{position: 'absolute', top: 16, right: 16}}>
                <LanguageSwitcher/>
            </Box>
            <AppIcon size={150}/>
            <Typography variant={"h4"}>{t('loginTitle')}</Typography>
            <Typography variant={"h7"}>{t('slogan')}</Typography>
            <Card
                sx={{
                    width: '100%',
                    boxShadow: 3,
                }}
                variant='outlined'
            >
                <Stack
                    spacing={2}
                    padding={2}
                >
                    <Typography
                        variant="h4"
                    >
                        {t('login')}
                    </Typography>

                    {loginError && <Typography color='error'
                                               variant="h7"
                    >
                        {t('loginFailed')}
                    </Typography>}
                    <TextField
                        error={loginError}
                        variant={"outlined"}
                        type={"text"}
                        label={t('username')}
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <PasswordTextField
                        error={loginError}
                        variant={"outlined"}
                        type={"password"}
                        label={t('password')}
                        value={password}
                        helperText={t('loginPasswordHelperText')}
                        onChange={(event) => setPassword(event.target.value)}

                    />
                    <Button
                        sx={{textTransform: 'inherit'}}
                        variant='contained'
                        onClick={() => {
                            handleLogin();
                        }}
                    >{t('login')} </Button>

                    <Button
                        sx={{textTransform: 'inherit'}}
                        variant='text'
                        onClick={() => {
                            navigate(REGISTER_URL)
                        }}
                    > {t('createAccount')}</Button>
                </Stack>
            </Card>
        </Box>
    );
}

Login.propTypes = {
    onLoginSuccess: PropTypes.func,
};


export default Login;