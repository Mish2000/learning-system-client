import {useState, useEffect, useRef} from 'react';
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';
import {
    CssBaseline,
    ThemeProvider,
} from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

import axios from 'axios';
import { SERVER_URL } from './utils/Constants.js';

import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Error404 from './components/Dashboard/Error404.jsx';
import CombinedDashboard from './components/Dashboard/CombinedDashboard';
import PracticePage from './components/Dashboard/Practice/PracticePage';
import {
    HOME_URL,
    LOGIN_URL,
    PRACTICE_URL,
    PROFILE_URL,
    REGISTER_URL,
    STATISTICS_URL,
} from './utils/Constants.js';
import NavBar from './components/Dashboard/NavBar.jsx';
import Home from './components/Dashboard/Home.jsx';
import ProfilePage from './components/Dashboard/ProfilePage.jsx';
import NoteBook from './components/Dashboard/Practice/NoteBook.jsx';

import i18n from './utils/Dictionary.js';
import createAppTheme from './utils/Theme.js';
import TopicManagementPage from "./components/Admin/TopicManagementPage.jsx";

const createEmotionCache = (dir = 'ltr') =>
    createCache({
        key: dir === 'rtl' ? 'mui-rtl' : 'mui',
        stylisPlugins: dir === 'rtl' ? [prefixer, rtlPlugin] : [],
    });

function App() {
    const [language, setLanguage] = useState(i18n.language || 'en');
    const [theme, setTheme]       = useState(createAppTheme(language));
    const [cache, setCache]       = useState(createEmotionCache(theme.direction));

    useEffect(() => {
        document.documentElement.setAttribute('dir', language === 'he' ? 'rtl' : 'ltr');
    }, [language]);

    useEffect(() => {
        const onLangChange = (lng) => {
            setLanguage(lng);
            setTheme(createAppTheme(lng));
            setCache(createEmotionCache(lng === 'he' ? 'rtl' : 'ltr'));
        };
        i18n.on('languageChanged', onLangChange);
        return () => i18n.off('languageChanged', onLangChange);
    }, []);

    // === Auth state (cookie-based) ===
    const [isAuth, setIsAuth] = useState(null); // null = unknown, true/false otherwise
    const [role,  setRole ]   = useState(null);

    const refreshAuthState = async () => {
        try {
            const { data } = await axios.get(`${SERVER_URL}/auth/me`, { withCredentials: true });
            setIsAuth(true);
            setRole(data?.role?.replace('ROLE_', '') || null);
        } catch {
            setIsAuth(false);
            setRole(null);
        }
    };

    const didRun = useRef(false);
    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        const path = window.location.pathname;
        const onAuthScreens = (path === LOGIN_URL) || (path === REGISTER_URL) || (path === '/');
        if (onAuthScreens) {
            setIsAuth(false);
            setRole(null);
            return;
        }
        // Only check /auth/me for real app routes
        refreshAuthState();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${SERVER_URL}/auth/logout`, null, { withCredentials: true });
        } catch { /* ignore */ }
        setIsAuth(false);
        setRole(null);
    };

    const handleLoginSuccess = async () => {
        // After successful /auth/login (cookies set), resolve auth via /auth/me
        await refreshAuthState();
    };

    // Optional small loader while auth state is unknown on protected screens only
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const onAuthScreens = (currentPath === LOGIN_URL || currentPath === REGISTER_URL);
    if (isAuth === null && !onAuthScreens) {
        return (
            <CacheProvider value={cache}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <div />
                </ThemeProvider>
            </CacheProvider>
        );
    }

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        {isAuth ? (
                            <Route path={LOGIN_URL} element={<Navigate to={HOME_URL} replace />} />
                        ) : (
                            <Route path={LOGIN_URL} element={<Login onLoginSuccess={handleLoginSuccess} />} />
                        )}

                        <Route path={REGISTER_URL} element={<Register />} />

                        {!isAuth && (
                            <>
                                <Route path={STATISTICS_URL} element={<Navigate to={LOGIN_URL} replace />} />
                                <Route path={PRACTICE_URL}   element={<Navigate to={LOGIN_URL} replace />} />
                                <Route path={PROFILE_URL}    element={<Navigate to={LOGIN_URL} replace />} />
                            </>
                        )}

                        {isAuth && (
                            <Route element={<NavBar />}>
                                <Route path={HOME_URL}                      element={<Home />} />
                                <Route path={STATISTICS_URL}                element={<CombinedDashboard role={role} onLogout={handleLogout} />} />
                                <Route path={PRACTICE_URL}                  element={<PracticePage onLogout={handleLogout} />} />
                                <Route path={`${PRACTICE_URL}/:questionId`} element={<NoteBook />} />
                                <Route path={`${PRACTICE_URL}/:id`}         element={<NoteBook />} />
                                <Route path={PROFILE_URL}                   element={<ProfilePage />} />
                                {role === 'ADMIN' && (
                                    <Route path="/manage-topics" element={<TopicManagementPage />} />
                                )}
                            </Route>
                        )}
                        <Route path="/" element={<Navigate to={LOGIN_URL} replace />} />
                        <Route path="*" element={<Error404 />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </CacheProvider>
    );
}

export default App;
