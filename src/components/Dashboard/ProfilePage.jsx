import {useEffect, useState, useRef, useMemo} from 'react';
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
} from '@mui/material';
import Loading from '../Common/Loading.jsx';
import {useTranslation} from 'react-i18next';
import CustomAccountCircleIcon from '../Common/CustomAccountCircleIcon.jsx';
import PasswordTextField from '../Common/PasswordTextField.jsx';
import PasswordStrengthIndicator from '../Common/PasswordStrengthIndicator.jsx';
import {GET_DIRECTION, SERVER_URL} from '../../utils/Constants.js';

// ---- Language helpers ----
const LANG_OPTIONS = [
    { code: 'en', label: 'English' },
    { code: 'he', label: 'עברית' },
];

const codeToLabel = (code) => {
    const hit = LANG_OPTIONS.find(o => o.code === String(code || '').toLowerCase());
    return hit ? hit.label : 'English';
};

// Robust canonicalization: accept codes, English labels, Hebrew text, or historical mojibake
const toLangCode = (raw) => {
    const s = String(raw || '').trim();
    const lower = s.toLowerCase();

    // common codes / English labels
    if (lower === 'en' || lower.startsWith('eng') || lower.includes('english')) return 'en';
    if (lower === 'he' || lower === 'iw' || lower.startsWith('heb') || lower.includes('hebrew')) return 'he';

    // raw Hebrew text → he
    if (/[א-ת]/.test(s)) return 'he';

    // historical mojibake for "עברית"
    if (s === '×¢×‘×¨×™×ª') return 'he';

    return 'en';
};

export default function ProfilePage() {
    const { t, i18n } = useTranslation();

    const [profile, setProfile] = useState(null);

    // store language **as code**, show label in UI
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

    const usernameRegex = /^[A-Za-z0-9]{4,30}$/;
    const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}'":;?.<>,-]).{8,30}$/;

    const dir = useMemo(() => GET_DIRECTION(i18n.language), [i18n.language]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const resp = await axios.get(`${SERVER_URL}/profile`, { withCredentials: true });
                setProfile(resp.data);

                // normalize whatever is stored to a code ('en' / 'he')
                const code = toLangCode(resp.data?.interfaceLanguage || 'English');
                setLanguageCode(code);
                setOriginalLanguageCode(code);

                setNewUsername(resp.data?.username || '');

                // keep runtime i18n aligned with stored value
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
            newErrors.username = true; isValid = false;
        }
        if (newPassword && !passwordRegex.test(newPassword)) {
            newErrors.password = true; isValid = false;
        }
        if (newPassword && newPassword !== repeatPassword) {
            newErrors.repeatPassword = true; isValid = false;
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
            // 1) Upload image if any
            if (userImage) {
                const formData = new FormData();
                formData.append('image', userImage);
                await axios.post(`${SERVER_URL}/profile/uploadImage`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });
            }

            // 2) Update profile fields — SAVE **code** to DB
            const payload = {
                username: newUsername,
                password: newPassword || undefined,
                interfaceLanguage: languageCode, // <-- important: 'en' | 'he'
            };

            const resp = await axios.put(`${SERVER_URL}/profile`, payload, { withCredentials: true });

            if (resp.data?.newToken) localStorage.setItem('jwtToken', resp.data.newToken);

            setSnackbarSeverity('success');
            setSnackbarMessage(t('profileUpdatedSuccessfully'));
            setSnackbarOpen(true);

            setNewPassword('');
            setRepeatPassword('');

            // refresh & broadcast to NavBar
            const refreshed = await axios.get(`${SERVER_URL}/profile`, { withCredentials: true });
            setProfile(refreshed.data);
            window.dispatchEvent(new CustomEvent('profile-updated', { detail: refreshed.data }));

            // update baselines
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

    const handleLanguageMenuOpen = (event) => setLanguageAnchorEl(event.currentTarget);
    const handleMenuClose = () => setLanguageAnchorEl(null);
    const handleLanguageSelect = (code) => {
        setLanguageCode(code);
        i18n.changeLanguage(code);
        localStorage.setItem('language', code);
        handleMenuClose();
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUserImage(e.target.files[0]);
        }
    };

    if (!profile) {
        return (
            <Box>
                <Typography variant="h3" sx={{ m: 10 }}>
                    {t('loadingProfile')}
                </Typography>
                <Loading />
            </Box>
        );
    }

    // Compute preview (new upload > stored picture)
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
    const buttonEnabled =
        hasLanguageChanged || hasUsernameChanged || hasPasswordEntered || hasImageUploaded;

    return (
        <Box
            sx={{
                direction: dir,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            }}
        >
            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Title */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    {t('profileManagement')}
                </Typography>
            </Box>

            {/* Image + actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                    sx={{
                        m: 1,
                        border: '5px solid #0c8686',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        width: 160,
                        height: 160,
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f5f5f5',
                    }}
                >
                    <input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt="User Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <CustomAccountCircleIcon style={{ width: '80%', height: '80%' }} />
                    )}
                </Box>

                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => document.getElementById('profile-image-upload').click()}
                    >
                        {t('UploadNewPhoto') || 'Upload New Photo'}
                    </Button>
                    {profile?.profileImage && (
                        <Button variant="text" color="error" onClick={handleDeleteImage}>
                            {t('RemovePhoto') || 'Remove photo'}
                        </Button>
                    )}
                </Stack>

                {/* Difficulty line */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">
                        {t('currentDifficulty')}: {t(profile.currentDifficulty || 'BASIC')}
                        {profile.subDifficultyLevel > 0 && (
                            <> ({t('subLevel')} {profile.subDifficultyLevel})</>
                        )}
                    </Typography>
                </Box>

                {/* Form */}
                <Stack
                    spacing={3}
                    sx={{ direction: dir, width: '90%', maxWidth: 600 }}
                >
                    <TextField
                        label={t('newUsername')}
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        error={errors.username}
                        helperText={errors.username ? t('usernameHelperText') : ''}
                    />

                    <PasswordTextField
                        label={t('newPassword')}
                        type="password"
                        value={newPassword}
                        error={errors.password}
                        helperText={errors.password ? t('RegisterPasswordHelperText') : ''}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <PasswordStrengthIndicator password={newPassword} />

                    <PasswordTextField
                        label={t('repeatPassword')}
                        type="password"
                        value={repeatPassword}
                        error={errors.repeatPassword}
                        helperText={errors.repeatPassword ? t('passwordsMustMatch') : ''}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />

                    {/* Language as a read-only field that opens a menu; show label, store code */}
                    <TextField
                        label={t('interfaceLanguage')}
                        value={codeToLabel(languageCode)}
                        onClick={(e) => setLanguageAnchorEl(e.currentTarget)}
                        InputProps={{ readOnly: true }}
                        inputRef={languageRef}
                    />
                    <Menu
                        anchorEl={languageAnchorEl}
                        open={Boolean(languageAnchorEl)}
                        onClose={() => setLanguageAnchorEl(null)}
                        PaperProps={{
                            style: {
                                width: languageRef.current ? languageRef.current.offsetWidth : 'auto',
                            },
                        }}
                    >
                        <MenuItem
                            selected={languageCode === 'en'}
                            onClick={() => handleLanguageSelect('en')}
                        >
                            English
                        </MenuItem>
                        <MenuItem
                            selected={languageCode === 'he'}
                            onClick={() => handleLanguageSelect('he')}
                        >
                            עברית
                        </MenuItem>
                    </Menu>

                    <Button
                        variant="contained"
                        color={buttonEnabled ? 'primary' : 'inherit'}
                        disabled={!buttonEnabled}
                        onClick={handleUpdate}
                    >
                        {t('saveProfile')}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}
