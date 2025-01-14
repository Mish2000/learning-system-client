import  {useState} from 'react';
import {Box, Button, Card, Stack, TextField, Typography} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import {HOME_URL, REGISTER_URL} from "../../Utils/Constants.js";
import PasswordTextField from "./PasswordTextField.jsx";
import AppIcon from "../../Utils/AppIcon.jsx";
import axios from "axios";
import PropTypes from 'prop-types';

function Login({onLoginSuccess}) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false);

    async function handleLogin() {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username: username,
                password: password
            });
            const { token, role } = response.data;
            onLoginSuccess(token, role);
            setLoginError(false);
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
                padding: { xs: 0, sm: 4, md: 4, lg: 4 },
                width: '100%',
                maxWidth: { xs: '90%', sm: '800px' },
                mx: 'auto',
            }}
        >
            <AppIcon size={150}/>
            <Typography variant={"h4"}>Quick Math</Typography>
            <Typography variant={"h7"}>a website for self learning math</Typography>
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
                        Login
                    </Typography >

                    {loginError&&<Typography color='error'
                                             variant="h7"
                    >
                        username or password are incorrect
                    </Typography>}
                    <TextField
                        error={loginError}
                        variant={"outlined"}
                        type={"text"}
                        label={"Username"}
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <PasswordTextField
                        error={loginError}
                        variant={"outlined"}
                        type={"password"}
                        label={"Password"}
                        value={password}
                        helperText={"Do not share your password with anyone else"}
                        onChange={(event) => setPassword(event.target.value)}

                    />
                    <Button
                        sx={{textTransform: 'inherit'}}
                        variant='contained'
                        onClick={() => {
                            handleLogin();
                        }}
                    >Login </Button>

                    <Button
                        sx={{textTransform: 'inherit'}}
                        variant='text'
                        onClick={() => {
                            navigate(REGISTER_URL)
                        }}
                    >Create Account</Button>
                </Stack>
            </Card>
        </Box>
    );
}

Login.propTypes = {
    onLoginSuccess: PropTypes.func,
};


export default Login;