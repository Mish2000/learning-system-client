import React, {useEffect, useState} from 'react';
import {Alert, Box, Button, Card, Stack, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import PasswordTextField from "./PasswordTextField.jsx";
import {LOGIN_URL} from "../../Utils/Constants.jsx";
import {register} from "../../API/Register.jsx";

function MuiRegister() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeat, setRepeat] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [repeatError, setRepeatError] = useState(false);
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState("");

    const regex = /^[a-zA-Z0-9]{4,30}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^05\d{1}-?\d{3}-?\d{4}$/;

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

    useEffect(() => {
        if (phone.length >= 1) {
            setPhoneError(!phoneRegex.test(phone));
        }
    }, [phone]);

    const handlePhoneChange = (event) => {
        const inputValue = event.target.value;
        const formattedValue = inputValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2$3');
        setPhone(formattedValue);
        event.target.value = formattedValue;
    };

    const notEmpty = (username.length >= 1 && phone.length >= 1 && email.length >= 1 && password.length >= 1 && repeat !== password && repeat.length > 0);

    async function createAccount() {
        // register(username, email, password).then(() => {
        //     if (result === 103) {
        //         setError("This username is already taken ")
        //     } else if (result === 104) {
        //         setError("The username does not satisfy the requirements")
        //     } else if (result === 105) {
        //         setError("The password does not satisfy the requirements")
        //     }else {navigate(LOGIN_URL)}
        // })
        register(username, email, password)
        navigate(LOGIN_URL)
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
                        <TextField
                            error={emailError}
                            variant={"outlined"}
                            type={"text"}
                            helperText={"in format of xxx@xxx.xxx"}
                            label={"Email"}
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <TextField
                            error={phoneError}
                            variant={"outlined"}
                            type={"text"}
                            helperText={"10 characters only in format of 05xxxxxxxx"}
                            label={"Phone Number"}
                            value={phone}
                            onChange={(event) => {
                                setPhone(event.target.value)
                                {
                                    handlePhoneChange(event)
                                }
                            }
                            }
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
                                if (error === "" && notEmpty) {
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

    export default MuiRegister;