import './App.css'

import {useState} from "react";
import Register from "./Components/Register.jsx";
import MuiLogin from "./Components/Login&Registration/MUILogin.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Correct import
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {LOGIN_URL, REGISTER_URL} from "./Utils/Constants.jsx";
import MuiRegister from "./Components/Login&Registration/MUIRegister.jsx";
import Error404 from "./Components/ErrorPages/Error404.jsx";


function App() {
    const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
    const [role, setRole] = useState(localStorage.getItem('role') || null);

    const theme = createTheme({
        palette: {
            background: {
                default: '#f0f0f0',
            },
            primary: {
                main: '#0c8686',
                // light: ,
                // dark: ,
                // contrastText: ,
            },
            secondary: {
                main: '#ad51b4',
                // light: ,
                // dark: ,
                // contrastText: ,
            },
        },
        components: {
            MuiButton: {
                style: {
                    textTransform: 'inherit',

                }
            },
            MuiCard :{
                style:{
                    // backgroundColor: '#f60000',
                    // elevation: "6",
                }
            }
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline >
            <BrowserRouter>
                <Routes>
                    <Route path={"*"} element={<Error404/>}/>
                    <Route path={LOGIN_URL} element={<MuiLogin/>}/>
                    <Route path={REGISTER_URL} element={<MuiRegister/>}/>
                </Routes>
            </BrowserRouter>
            </CssBaseline>
        </ThemeProvider>

    );
}

export default App;


