import React, {useEffect, useState} from 'react';
import {Box, Button, Card, Stack, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import PasswordTextField from "./PasswordTextField.jsx";
import {LOGIN_URL} from "../../Utils/Constants.jsx";

function MuiRegister(props) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeat, setRepeat] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [repeatError, setRepeatError] = useState(false);
    const [error, setError] = useState("");


    const regex = /^[a-zA-Z0-9]{4,30}$/;

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
    }, [password,repeat]);


    async function createAccount() {
        // CreateAccount(username, password, repeat).then(result => {
        //     if (result===100){
        //         setError("Missing username")
        //     }else if(result===101){
        //         setError("Missing password")
        //     }else if(result===102){
        //         setError("Password do not match!")
        //     }else if(result===103){
        //         setError("This username is already taken ")
        //     }else if(result===104){
        //         setError("The username does not satisfy the requirements")
        //     }else if(result===105){
        //         setError("The password does not satisfy the requirements")
        //     }
        // });
    }

    return (
        <Box className="login-card"  textAlign="center">
            <Card variant={"outlined"} >
                <Stack
                    spacing={2}
                    padding={2}
                >
                    <Typography
                        variant="h4">
                        Create Account
                    </Typography>
                    <Typography
                        variant="h7"
                        color="error"
                    >
                        {error}
                    </Typography>
                    <TextField
                        error={usernameError}
                        variant={"outlined"}
                        type={"text"}
                        helperText={"Between 4 -30 characters long,Can contain only numbers and english characters!"}
                        label={"Username"}
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
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

                    <Button
                        sx={{textTransform: 'inherit'}}
                        variant={"contained"}
                        onClick={() => createAccount()}
                    >Create Account</Button>

                    <Button
                        sx={{textTransform: 'inherit'}}
                        variant={"text"}
                        onClick={() => {
                            navigate(LOGIN_URL)
                        }}
                    >Login </Button>

                </Stack>
            </Card>
        </Box>
    );
}

export default MuiRegister;