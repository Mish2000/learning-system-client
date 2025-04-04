import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Error404 from './components/Dashboard/Error404.jsx';
import CombinedDashboard from './components/Dashboard/CombinedDashboard';
import PracticePage from './components/Dashboard/Practice/PracticePage';
import { HOME_URL, LOGIN_URL, PRACTICE_URL, PROFILE_URL, REGISTER_URL, STATISTICS_URL } from './utils/Constants.js';
import NavBar from "./components/Dashboard/NavBar.jsx";
import Home from "./components/Dashboard/Home.jsx";
import ProfilePage from "./components/Dashboard/ProfilePage.jsx";
import NoteBook from "./components/Dashboard/Practice/NoteBook.jsx";
import theme from './utils/Theme.js';
import TopicManagementPage from "./components/Admin/TopicManagementPage.jsx";

function App() {
    const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
    const [role, setRole] = useState(localStorage.getItem('role') || null);

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
            <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        {token ? (
                            <Route path={LOGIN_URL} element={<Navigate to={HOME_URL} />} />
                        ) : (
                            <Route path={LOGIN_URL} element={<Login onLoginSuccess={handleLoginSuccess} />} />
                        )}
                        <Route path={REGISTER_URL} element={<Register />} />

                        {!token && (
                            <>
                                <Route path={STATISTICS_URL} element={<Navigate to={LOGIN_URL} />} />
                                <Route path={PRACTICE_URL} element={<Navigate to={LOGIN_URL} />} />
                                <Route path={PROFILE_URL} element={<Navigate to={LOGIN_URL} />} />
                            </>
                        )}
                        {token && (
                            <Route element={<NavBar />}>
                                <Route path={HOME_URL} element={<Home />} />
                                <Route path={STATISTICS_URL} element={<CombinedDashboard role={role} onLogout={handleLogout} />} />
                                <Route path={PRACTICE_URL} element={<PracticePage onLogout={handleLogout} />} />
                                <Route path={`${PRACTICE_URL}/:questionId`} element={<NoteBook />} />
                                <Route path={`${PRACTICE_URL}/:id`} element={<NoteBook />} />
                                <Route path={PROFILE_URL} element={<ProfilePage />} />

                                {role === "ADMIN" && (
                                    <Route path="/manage-topics" element={<TopicManagementPage />} />
                                )}
                            </Route>
                        )}
                        <Route path="*" element={<Error404 />} />
                    </Routes>
                </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;