import {useEffect, useState} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {createTheme, ThemeProvider, CssBaseline} from '@mui/material';
import Login from './Components/Login&Registration/Login.jsx';
import Register from './Components/Login&Registration/Register.jsx';
import Error404 from './components/ErrorPages/Error404';
import CombinedDashboard from './Components/Dashboard/CombinedDashboard';
import PracticePage from './Components/Dashboard/Practice/PracticePage';
import {STATISTICS_URL, HOME_URL, LOGIN_URL, PRACTICE_URL, PROFILE_URL, REGISTER_URL} from './Utils/Constants.js';
import NavBar from "./Components/Dashboard/NavBar/NavBar.jsx";
import Home from "./Components/Dashboard/Home.jsx";
import ProfilePage from "./Components/Dashboard/Profile/ProfilePage.jsx";
import NoteBook from "./Components/Dashboard/Practice/NoteBook.jsx";


function App() {
    const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
    const [role, setRole] = useState(localStorage.getItem('role') || null);

        useEffect(() => {
            document.body.style.cursor = ' url(src/Assets/img.png) , pointer';
            document.body.style.cursor = ' url(src/Assets/img.png) , move';
        }, []);

        const theme = createTheme({
        components: {
            MuiButtonBase: {
                styleOverrides: {
                    root: {
                        cursor: 'url(src/Assets/img.png)',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        cursor: 'url(src/Assets/img.png), pointer',
                        '&:hover': {
                            cursor: 'url(src/Assets/img.png), pointer',
                        },
                        '&[type="submit"]': {
                            cursor: 'url(src/Assets/pointer.png), pointer',
                            '&:hover': {
                                cursor: 'url(src/Assets/pointer.png), pointer',
                            },
                        },
                    },
                },
                MuiSelect: {
                    styleOverrides: {
                        root: {
                            cursor: 'url(src/Assets/img.png), pointer',
                            '&:hover': {
                                cursor: 'url(src/Assets/img.png), hand',
                            },
                        },
                        select: {
                            cursor: 'url(src/Assets/img.png), pointer',
                            '&:hover': {
                                cursor: 'url(src/Assets/img.png), pointer',
                            },
                            '&:focus': {
                                cursor: 'url(src/Assets/img.png), pointer',
                            },
                        },
                    },
                },
                MuiMenuItem: {
                    styleOverrides: {
                        root: {
                            '&:hover': {
                                cursor: 'url(src/Assets/img.png), pointer',
                            },
                        },
                    },
                },
                MuiInputBase: {
                    styleOverrides: {
                        input: {
                            cursor: 'url(src/Assets/img.png), text',
                            '&:hover': {
                                cursor: 'url(src/Assets/img.png), text',
                            },
                            '&:focus': {
                                cursor: 'url(src/Assets/img.png), text',
                            },
                        },
                    },
                },
                MuiTextField: {
                    styleOverrides: {
                        root: {
                            '& textarea.MuiInputBase-input.MuiTextarea-input': {
                                cursor: 'url(src/Assets/img.png), text',
                            },
                        },
                    },
                },

            },
        },
        palette: {
            background: {
                default: '#f0f0f0',
            },
            primary: {
                main: '#0c8686',
            },
            secondary: {
                main: '#00ffd7',
            },
        }
    });

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('role');
        setToken(null);
        setRole(null);
    };

    const handleLoginSuccess = (newToken, newRole) => {
        localStorage.setItem('jwtToken', newToken);
        localStorage.setItem('role', newRole);
        setToken(newToken);
        setRole(newRole);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <BrowserRouter>

                    <Routes>
                        {/*If the user logged in, he cannot access the login screen */}
                        {token ? (
                            <Route path={LOGIN_URL} element={<Navigate to={HOME_URL} />} />

                        ) : (
                            <Route path={LOGIN_URL} element={<Login onLoginSuccess={handleLoginSuccess} />} />
                        )}
                        <Route path={REGISTER_URL} element={<Register />} />

                        {/* Not giving accesses to dashboard or practice sections before the user logs in */}
                        {!token && (
                            <>
                                <Route path={STATISTICS_URL} element={<Navigate to={LOGIN_URL} />} />
                                <Route path={PRACTICE_URL} element={<Navigate to={LOGIN_URL} />}/>
                                <Route path={PROFILE_URL} element={<Navigate to={LOGIN_URL} />} />
                            </>
                        )}

                        {token && (
                            <Route element={<NavBar />}>
                                <Route path={HOME_URL} element={<Home />} />

                                <Route path={STATISTICS_URL} element={
                                    <CombinedDashboard role={role} onLogout={handleLogout} />
                                }/>
                                <Route path={PRACTICE_URL} element={<PracticePage onLogout={handleLogout} />} />
                                <Route path={`${PRACTICE_URL}/:questionId`} element={<NoteBook />} />
                                <Route path={PRACTICE_URL+"/:id"}  element={<NoteBook/>} />

                                <Route path={PROFILE_URL} element={<ProfilePage />}/>
                            </Route>
                        )}


                        <Route path="*" element={<Error404 />} />

                    </Routes>

                </BrowserRouter>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default App;



