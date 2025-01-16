import {useState} from 'react';
import {Alert, Box, Button, Card, Stack, TextField, Typography} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import PasswordTextField from "./PasswordTextField.jsx";
import {LOGIN_URL} from "../../Utils/Constants.js";
import {registerUser} from '../../api/UserAPI';

function Register() {
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
                        helperText={"8-30 characters, must include: lowercase, uppercase, number, and one special character"}
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