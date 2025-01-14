import  {useEffect, useState} from 'react';
import {Alert, Box, Button, Card, Stack, TextField, Typography} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import PasswordTextField from "./PasswordTextField.jsx";
import {LOGIN_URL} from "../../Utils/Constants.js";
import { registerUser } from '../../api/UserAPI';

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeat, setRepeat] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [repeatError, setRepeatError] = useState(false);
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const regex = /^[a-zA-Z0-9]{4,30}$/;
    //const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*])[a-zA-Z\d@$%*]{8,30}$/;//TODO do not forget add this for production
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const noError = (!usernameError && !emailError && !passwordError && !repeatError);
    const notEmpty = (username.length >= 1  && email.length >= 1 && password.length >= 1 && repeat === password && repeat.length >=1);

    useEffect(() => {
        if (username.length >= 1) {
            setUsernameError(!regex.test(username))
        }
    }, [username]);


    useEffect(() => {
        if (password.length >= 1) {
            setPasswordError(!regex.test(password))
        }
    }, [password]);

    useEffect(() => {
        setRepeatError(repeat !== password && repeat.length > 0)
    }, [password, repeat]);

    useEffect(() => {
        if (email.length >= 1) {
            setEmailError(!emailRegex.test(email));
        }
    }, [email]);

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
                        Create Account
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
                        helperText={"Between 4 -30 characters long,Can contain only numbers and english characters!"}
                        label={"Username"}
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <TextField
                        error={emailError}
                        variant={"outlined"}
                        type={"text"}
                        helperText={"in format of xxx@xxx.xxx"}
                        label={"Email"}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <PasswordTextField
                        error={passwordError}
                        helperText={"Between 4 -30 characters long,Can contain only numbers and english characters! "}
                        variant={"outlined"}
                        type={"password"}
                        label={"Password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />

                    <PasswordTextField
                        error={repeatError}
                        helperText={repeatError ? "Passwords must be the same!" : ""}
                        variant={"outlined"}
                        type={"password"}
                        label={"Repeat Password"}
                        value={repeat}
                        onChange={(event) => setRepeat(event.target.value)}
                    />
                    {alert ? <Alert variant="filled" severity="error">
                            Please check if all fields are filled correctly
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
                    >Create Account</Button>
                    <Stack>
                        <Button
                            sx={{textTransform: 'inherit'}}
                            variant={"text"}
                            onClick={() => {
                                navigate(LOGIN_URL)
                            }}
                        >Login </Button>
                        <Typography variant={"caption"} sx={{justifyContent: 'center', display: 'flex'}}>
                            already have account? click here 👆
                        </Typography>
                    </Stack>
                </Stack>
            </Card>
        </Box>
    );
}

export default Register;