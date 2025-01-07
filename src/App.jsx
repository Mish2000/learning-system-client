
import  { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import MuiLogin from './components/Login&Registration/MuiLogin';
import MuiRegister from './components/Login&Registration/MuiRegister';
import Error404 from './components/ErrorPages/Error404';
import CombinedDashboard from './Components/Dashboard/CombinedDashboard';
import PracticePage from './Components/Practice/PracticePage';
import { LOGIN_URL, REGISTER_URL } from './Utils/Constants.js';

function App() {
    const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
    const [role, setRole]   = useState(localStorage.getItem('role') || null);

    const theme = createTheme({
        palette: {
            background: {
                default: '#f0f0f0',
            },
            primary: {
                main: '#0c8686',
            },
            secondary: {
                main: '#ad51b4',
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

                        <Route path="/" element={<Navigate to={LOGIN_URL} replace />} />

                        <Route
                            path={LOGIN_URL}
                            element={<MuiLogin onLoginSuccess={handleLoginSuccess} />}
                        />
                        <Route
                            path={REGISTER_URL}
                            element={<MuiRegister />}
                        />

                        {!token && (
                            <>
                                <Route path="/dashboard" element={<Navigate to={LOGIN_URL} />} />
                                <Route path="/practice" element={<Navigate to={LOGIN_URL} />} />
                            </>
                        )}

                        {token && (
                            <>
                                <Route
                                    path="/dashboard"
                                    element={<CombinedDashboard role={role} onLogout={handleLogout} />}
                                />
                                <Route
                                    path="/practice"
                                    element={<PracticePage onLogout={handleLogout} />}
                                />
                            </>
                        )}

                        <Route path="*" element={<Error404 />} />
                    </Routes>

                </BrowserRouter>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default App;



