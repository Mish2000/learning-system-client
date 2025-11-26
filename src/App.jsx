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
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import {prefixer} from 'stylis';

import axios from 'axios';
import {ADMIN_DASHBOARD_URL, LANDING_URL, SERVER_URL} from './utils/Constants.js';

import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Error404 from './components/Dashboard/Error404.jsx';
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
import LandingPage from './components/Dashboard/LandingPage.jsx';
import ProfilePage from './components/Dashboard/ProfilePage.jsx';
import NoteBook from './components/Dashboard/Practice/NoteBook.jsx';

import i18n from './utils/Dictionary.js';
import createAppTheme from './utils/Theme.js';
import UserDashboardSSE from "./components/Dashboard/UserDashboardSSE.jsx";
import AdminSectionPage from "./components/Admin/AdminSectionPage.jsx";
import Home from "./components/Dashboard/Home.jsx";
import LastRouteTracker from "./utils/LastRouteTracker.jsx";


const createEmotionCache = (dir = 'ltr') =>
    createCache({
        key: dir === 'rtl' ? 'mui-rtl' : 'mui',
        stylisPlugins: dir === 'rtl' ? [prefixer, rtlPlugin] : [],
    });

function App() {
    // --- Initialize i18n from cookie (if present), then keep reacting to changes ---
    const [language, setLanguage] = useState(i18n.language || 'en');

    // Read cookie "language" once on mount and sync i18n
    useEffect(() => {
        const match = typeof document !== 'undefined'
            ? document.cookie.match(/(?:^|;\s*)language=([^;]+)/)
            : null;
        const cookieLang = match ? decodeURIComponent(match[1]) : null;
        if (cookieLang && cookieLang !== i18n.language) {
            i18n.changeLanguage(cookieLang);
            setLanguage(cookieLang);
        }
    }, []);

    const [theme, setTheme] = useState(createAppTheme(language));
    const [cache, setCache] = useState(createEmotionCache(theme.direction));

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
    const [role, setRole] = useState(null);

    const refreshAuthState = async () => {
        try {
            const {data} = await axios.get(`${SERVER_URL}/auth/me`, {withCredentials: true});
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
        const onAuthScreens =
            (path === LOGIN_URL) ||
            (path === REGISTER_URL) ||
            (path === "/") ||
            (path === LANDING_URL);

        if (onAuthScreens) {
            setIsAuth(false);
            setRole(null);
            return;
        }

        refreshAuthState();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${SERVER_URL}/auth/logout`, null, {withCredentials: true});
        } catch { /* ignore */
        }
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
                    <CssBaseline/>
                    <div/>
                </ThemeProvider>
            </CacheProvider>
        );
    }

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <BrowserRouter>
                    <LastRouteTracker/>
                    <Routes>
                        {/* LOGIN / REGISTER */}
                        {isAuth ? (
                            <Route path={LOGIN_URL} element={<Navigate to={HOME_URL} replace/>}/>
                        ) : (
                            <Route path={LOGIN_URL} element={<Login onLoginSuccess={handleLoginSuccess}/>}/>
                        )}
                        <Route path={REGISTER_URL} element={<Register/>}/>

                        {/* PUBLIC LANDING (no NavBar). If already authenticated, bounce to protected default */}
                        <Route
                            path={LANDING_URL}
                            element={isAuth ? <Navigate to={HOME_URL} replace/> : <LandingPage/>}
                        />

                        {/* REDIRECTS for unauthenticated users hitting protected routes */}
                        {!isAuth && (
                            <>
                                {/* /home is now a protected user route */}
                                <Route path={HOME_URL} element={<Navigate to={LANDING_URL} replace/>}/>

                                <Route path={STATISTICS_URL} element={<Navigate to={LOGIN_URL} replace/>}/>
                                <Route path={ADMIN_DASHBOARD_URL} element={<Navigate to={HOME_URL} replace/>}/>

                                {/* After assessment/logout we want LANDING instead of LOGIN */}
                                <Route path={PRACTICE_URL} element={<Navigate to={LANDING_URL} replace/>}/>
                                <Route
                                    path={`${PRACTICE_URL}/:questionId`}
                                    element={<Navigate to={LANDING_URL} replace/>}
                                />
                                <Route
                                    path={`${PRACTICE_URL}/:id`}
                                    element={<Navigate to={LANDING_URL} replace/>}
                                />

                                <Route path={PROFILE_URL} element={<Navigate to={LOGIN_URL} replace/>}/>

                                {/* Backwards compatibility: old /manage-topics URL now points into Admin Section */}
                                <Route path="/manage-topics" element={<Navigate to={LOGIN_URL} replace/>}/>
                            </>
                        )}

                        {/* AUTHENTICATED AREA (with NavBar) */}
                        {isAuth && (
                            <Route element={<NavBar/>}>
                                <Route path={HOME_URL} element={<Home/>}/>

                                <Route path={STATISTICS_URL} element={<UserDashboardSSE/>}/>

                                <Route
                                    path={ADMIN_DASHBOARD_URL}
                                    element={
                                        role === "ADMIN"
                                            ? <AdminSectionPage/>
                                            : <Navigate to={STATISTICS_URL} replace/>
                                    }
                                />

                                <Route path={PRACTICE_URL} element={<PracticePage onLogout={handleLogout}/>}/>
                                <Route path={`${PRACTICE_URL}/:questionId`} element={<NoteBook/>}/>
                                <Route path={`${PRACTICE_URL}/:id`} element={<NoteBook/>}/>

                                <Route path={PROFILE_URL} element={<ProfilePage/>}/>

                                {/* Backwards compatibility inside auth area */}
                                <Route path="/manage-topics" element={<Navigate to={ADMIN_DASHBOARD_URL} replace/>}/>
                            </Route>
                        )}

                        <Route path="/" element={<Navigate to={isAuth ? HOME_URL : LANDING_URL} replace/>}/>

                        {/* 404 */}
                        <Route path="*" element={<Error404/>}/>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </CacheProvider>
    );
}

export default App;
