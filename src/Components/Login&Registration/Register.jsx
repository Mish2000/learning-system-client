import {useState} from 'react';
import {Alert, Box, Button, Card, Stack, TextField, Typography} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import PasswordTextField from "./PasswordTextField.jsx";
import {LOGIN_URL} from "../../Utils/Constants.js";
import {registerUser} from '../../api/UserAPI';
import {useTranslation} from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

function Register() {
    const { t } = useTranslation();
    const regex = /^[a-zA-Z0-9]{4,30}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}'":;?.<>,-])[\w\d~!@#$%^&*()_+={}'":;?.<>,-]{8,30}$/;
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeat, setRepeat] = useState("");
    const usernameError = !regex.test(username) && username.length > 0;
    const emailError = !emailRegex.test(email) && email.length > 0;
    const passwordError = !passwordRegex.test(password) && password.length > 0;
    const repeatError = repeat !== password && repeat.length > 0
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const noError = (!usernameError && !emailError && !passwordError && !repeatError);
    const notEmpty = (username.length >= 1  && email.length >= 1 && password.length >= 1 && repeat === password && repeat.length >=1);

    async function createAccount() {

         const data = await registerUser(username, email, password);
         console.log(data);
         if (data.status === 200) {
             setSuccess(true);
             setTimeout(() => {
                 navigate(LOGIN_URL);
             }, 2250);

         }else{
             setError(data.response.data.message);
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
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <LanguageSwitcher />
            </Box>
            <Card sx={{
                width: '100%',
                boxShadow: 3,
            }}
                  variant='outlined'>
                <Stack
                    spacing={2}
                    padding={2}
                >
                    <Typography
                        variant="h4">
                        {t('registerPageTitle')}
                    </Typography>
                    {success ? (
                        <Alert variant="filled" severity="success">
                            Registration successful! Redirecting to login page...
                        </Alert>
                    ) : (
                        <Typography
                            variant="h7"
                            color="error"
                        >
                            {error}
                        </Typography>
                    )}
                    <TextField
                        error={usernameError}
                        variant={"outlined"}
                        type={"text"}
                        helperText={t('usernameHelperText')}
                        label={t('username')}
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <TextField
                        error={emailError}
                        variant={"outlined"}
                        type={"text"}
                        helperText={t('emailHelperText')}
                        label={t('email')}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <PasswordTextField
                        error={passwordError}
                        helperText={t('RegisterPasswordHelperText')}
                        variant={"outlined"}
                        type={"password"}
                        label={t('password')}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />

                    <PasswordTextField
                        error={repeatError}
                        helperText={repeatError ? "Passwords must be the same!" : ""}
                        variant={"outlined"}
                        type={"password"}
                        label={t('repeatPassword')}
                        value={repeat}
                        onChange={(event) => setRepeat(event.target.value)}
                    />
                    {alert ? <Alert variant="filled" severity="error">
                            {t('registrationError')}
                        </Alert>
                        :
                        <></>
                    }
                    <Button
                        sx={{textTransform: 'inherit'}}
                        variant={"contained"}
                        onClick={() => {
                            if (noError && notEmpty) {
                                setAlert(false)
                                createAccount()
                            } else {
                                setAlert(true)
                            }
                        }}
                    >{t('createAccount')}</Button>
                    <Stack>
                        <Button
                            sx={{textTransform: 'inherit'}}
                            variant={"text"}
                            onClick={() => {
                                navigate(LOGIN_URL)
                            }}
                        >{t('login')} </Button>
                        <Typography variant={"caption"} sx={{justifyContent: 'center', display: 'flex'}}>
                            {t('alreadyHaveAccount')}
                        </Typography>
                    </Stack>
                </Stack>
            </Card>
        </Box>
    );
}

export default Register;