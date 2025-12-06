import { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';
import {
    Typography,
    Box,
    TextField,
    Button,
    Stack,
    Menu,
    MenuItem,
    Alert,
    Snackbar,
    Container,
    Card,
    CardContent,
    Avatar,
    Fade
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import TranslateIcon from '@mui/icons-material/Translate';

import Loading from '../Common/Loading.jsx';
import { useTranslation } from 'react-i18next';
import CustomAccountCircleIcon from '../Common/CustomAccountCircleIcon.jsx';
import PasswordTextField from '../Common/PasswordTextField.jsx';
import PasswordStrengthIndicator from '../Common/PasswordStrengthIndicator.jsx';
import { GET_DIRECTION, SERVER_URL } from '../../utils/Constants.js';

// ---- Language helpers ----
const LANG_OPTIONS = [
    { code: 'en', label: 'English' },
    { code: 'he', label: 'עברית' },
];
const codeToLabel = (code) => {
    const hit = LANG_OPTIONS.find(o => o.code === String(code || '').toLowerCase());
    return hit ? hit.label : 'English';
};

const toLangCode = (raw) => {
    const s = String(raw || '').trim();
    const lower = s.toLowerCase();
    if (lower === 'en' || lower.startsWith('eng') || lower.includes('english')) return 'en';
    if (lower === 'he' || lower === 'iw' || lower.startsWith('heb') || lower.includes('hebrew')) return 'he';
    if (/[א-ת]/.test(s)) return 'he'; // Hebrew charset detection
    if (s === '×¢×‘×¨×™×ª') return 'he'; // Mojibake check
    return 'en';
};

export default function ProfilePage() {
    const { t, i18n } = useTranslation();

    const [profile, setProfile] = useState(null);
    const [languageCode, setLanguageCode] = useState('en');
    const [originalLanguageCode, setOriginalLanguageCode] = useState('en');
    const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
    const languageRef = useRef(null);

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [userImage, setUserImage] = useState(null);

    const [errors, setErrors] = useState({
        username: false,
        password: false,
        repeatPassword: false,
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const usernameRegex = /^[a-zA-Z0-9\u0590-\u05FF]{4,30}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}'":;?.<>,-]).{8,30}$/;

    const dir = useMemo(() => GET_DIRECTION(i18n.language), [i18n.language]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const resp = await axios.get(`${SERVER_URL}/profile`, { withCredentials: true });
                setProfile(resp.data);

                const code = toLangCode(resp.data?.interfaceLanguage || 'English');
                setLanguageCode(code);
                setOriginalLanguageCode(code);
                setNewUsername(resp.data?.username || '');

                i18n.changeLanguage(code);
                localStorage.setItem('language', code);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        };
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateInputs = () => {
        const newErrors = { username: false, password: false, repeatPassword: false };
        let isValid = true;

        if (newUsername && !usernameRegex.test(newUsername)) {
            newErrors.username = true;
            isValid = false;
        }
        if (newPassword && !passwordRegex.test(newPassword)) {
            newErrors.password = true;
            isValid = false;
        }
        if (newPassword && newPassword !== repeatPassword) {
            newErrors.repeatPassword = true;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleDeleteImage = async () => {
        try {
            await axios.delete(`${SERVER_URL}/profile/image`, { withCredentials: true });
        } catch (err) {
            const code = err?.response?.status;
            if (code === 404 || code === 405) {
                await axios.post(`${SERVER_URL}/profile/image/delete`, null, { withCredentials: true });
            } else {
                console.error('Failed to delete profile image', err);
                setSnackbarSeverity('error');
                setSnackbarMessage(t('updateFailed'));
                setSnackbarOpen(true);
                return;
            }
        }

        const refreshed = await axios.get(`${SERVER_URL}/profile`, { withCredentials: true });
        setProfile(refreshed.data);
        setUserImage(null);
        window.dispatchEvent(new CustomEvent('profile-updated', { detail: refreshed.data }));
        setSnackbarSeverity('success');
        setSnackbarMessage(t('profileImageRemoved') || 'Profile image removed');
        setSnackbarOpen(true);
    };

    const handleUpdate = async () => {
        if (!validateInputs()) {
            setSnackbarSeverity('error');
            setSnackbarMessage(t('pleaseCheckFields'));
            setSnackbarOpen(true);
            return;
        }
        try {
            if (userImage) {
                const formData = new FormData();
                formData.append('image', userImage);
                await axios.post(`${SERVER_URL}/profile/uploadImage`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });
            }

            const payload = {
                username: newUsername,
                password: newPassword || undefined,
                interfaceLanguage: languageCode,
            };

            const resp = await axios.put(`${SERVER_URL}/profile`, payload, { withCredentials: true });

            if (resp.data?.newToken) localStorage.setItem('jwtToken', resp.data.newToken);

            setSnackbarSeverity('success');
            setSnackbarMessage(t('profileUpdatedSuccessfully'));
            setSnackbarOpen(true);

            setNewPassword('');
            setRepeatPassword('');

            const refreshed = await axios.get(`${SERVER_URL}/profile`, { withCredentials: true });
            setProfile(refreshed.data);
            window.dispatchEvent(new CustomEvent('profile-updated', { detail: refreshed.data }));

            setOriginalLanguageCode(languageCode);
            i18n.changeLanguage(languageCode);
            localStorage.setItem('language', languageCode);
        } catch (err) {
            console.error('Failed to update profile', err);
            setSnackbarSeverity('error');
            setSnackbarMessage(t('updateFailed'));
            setSnackbarOpen(true);
        }
    };

    const handleLanguageSelect = (code) => {
        setLanguageCode(code);
        // Do NOT change global i18n here; only on Save
        setLanguageAnchorEl(null);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUserImage(e.target.files[0]);
        }
    };

    if (!profile) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <Loading />
            </Box>
        );
    }

    let displayImage = null;
    if (userImage) {
        displayImage = URL.createObjectURL(userImage);
    } else if (profile.profileImage) {
        displayImage = `data:image/jpeg;base64,${profile.profileImage}`;
    }

    const hasLanguageChanged = languageCode !== originalLanguageCode;
    const hasUsernameChanged = (newUsername || '') !== (profile.username || '');
    const hasPasswordEntered = newPassword.length > 0 || repeatPassword.length > 0;
    const hasImageUploaded = !!userImage;
    const buttonEnabled = hasLanguageChanged || hasUsernameChanged || hasPasswordEntered || hasImageUploaded;

    return (
        <Fade in={true} timeout={600}>
            <Container maxWidth="sm" sx={{ py: 6 }} dir={dir}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        {t('profileManagement')}
                    </Typography>
                </Box>

                <Card sx={{ overflow: 'visible' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, position: 'relative' }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: 120,
                                    height: 120,
                                    mb: 2,
                                    '&:hover .overlay': { opacity: 1 }
                                }}
                            >
                                <Avatar
                                    src={displayImage}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        bgcolor: 'primary.light',
                                        fontSize: 40,
                                        boxShadow: 3
                                    }}
                                >
                                    {!displayImage && <CustomAccountCircleIcon />}
                                </Avatar>

                                <Box
                                    className="overlay"
                                    onClick={() => document.getElementById('profile-image-upload').click()}
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        bgcolor: 'rgba(0,0,0,0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0,
                                        transition: 'opacity 0.2s',
                                        cursor: 'pointer',
                                        color: '#fff'
                                    }}
                                >
                                    <PhotoCameraIcon />
                                </Box>
                            </Box>

                            <input
                                id="profile-image-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />

                            <Stack direction="row" spacing={1}>
                                <Button
                                    size="small"
                                    startIcon={<PhotoCameraIcon />}
                                    onClick={() => document.getElementById('profile-image-upload').click()}
                                >
                                    {t('UploadNewPhoto') || 'Change Photo'}
                                </Button>
                                {profile?.profileImage && (
                                    <Button
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={handleDeleteImage}
                                    >
                                        {t('RemovePhoto') || 'Remove'}
                                    </Button>
                                )}
                            </Stack>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                {t('currentDifficulty')}: <b>{t(profile.currentDifficulty || 'BASIC')}</b>
                                {profile.subDifficultyLevel > 0 && ` (${t('subLevel')} ${profile.subDifficultyLevel})`}
                            </Typography>
                        </Box>

                        <Stack spacing={3}>
                            <TextField
                                label={t('newUsername')}
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                error={errors.username}
                                helperText={errors.username ? t('usernameHelperText') : ''}
                                fullWidth
                            />

                            <Box>
                                <TextField
                                    label={t('interfaceLanguage')}
                                    value={codeToLabel(languageCode)}
                                    onClick={(e) => setLanguageAnchorEl(e.currentTarget)}
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: <TranslateIcon color="action" sx={{ mr: 1 }} />
                                    }}
                                    inputRef={languageRef}
                                    fullWidth
                                    sx={{ cursor: 'pointer' }}
                                />
                                <Menu
                                    anchorEl={languageAnchorEl}
                                    open={Boolean(languageAnchorEl)}
                                    onClose={() => setLanguageAnchorEl(null)}
                                    PaperProps={{ style: { width: languageRef.current ? languageRef.current.offsetWidth : 'auto' } }}
                                >
                                    {LANG_OPTIONS.map((opt) => (
                                        <MenuItem
                                            key={opt.code}
                                            selected={languageCode === opt.code}
                                            onClick={() => handleLanguageSelect(opt.code)}
                                        >
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>

                            <Box sx={{ pt: 2 }}>
                                <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                                    {t('changePassword') || 'Change Password'}
                                </Typography>
                                <Stack spacing={2}>
                                    <PasswordTextField
                                        label={t('newPassword')}
                                        value={newPassword}
                                        error={errors.password}
                                        helperText={errors.password ? t('RegisterPasswordHelperText') : ''}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        fullWidth
                                    />
                                    {newPassword && <PasswordStrengthIndicator password={newPassword} />}

                                    <PasswordTextField
                                        label={t('repeatPassword')}
                                        value={repeatPassword}
                                        error={errors.repeatPassword}
                                        helperText={errors.repeatPassword ? t('passwordsMustMatch') : ''}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                        fullWidth
                                    />
                                </Stack>
                            </Box>

                            <Button
                                variant="contained"
                                size="large"
                                disabled={!buttonEnabled}
                                onClick={handleUpdate}
                                sx={{ mt: 2 }}
                            >
                                {t('saveProfile')}
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </Fade>
    );
}