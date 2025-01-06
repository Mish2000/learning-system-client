import React, {useState} from 'react';
import {Box, Button, Card, Stack, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import {REGISTER_URL} from "../../Utils/Constants.jsx";
import PasswordTextField from "./PasswordTextField.jsx";
import AppIcon from "../AppIcon.jsx";

function MuiLogin(props) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(false);

    async function handleLogin() {

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
            <AppIcon size={250}/>
            <Typography variant={"h2"}>self learning math</Typography>
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


export default MuiLogin;