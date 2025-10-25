import {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import {
    Typography,
    Box,
    CardMedia,
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

export default function ProfilePage() {
    const {t, i18n} = useTranslation();

    const [profile, setProfile] = useState(null);
    const [language, setLanguage] = useState('');
    const [originalLanguage, setOriginalLanguage] = useState('');
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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Cookie flow: do NOT gate on localStorage token.
                const resp = await axios.get(`${SERVER_URL}/profile`, {
                    withCredentials: true,
                });

                setProfile(resp.data);
                const uiLang = resp.data.interfaceLanguage || 'English';
                setLanguage(uiLang);
                setOriginalLanguage(uiLang);
                setNewUsername(resp.data.username || '');
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        };
        fetchProfile();
    }, []);

    const validateInputs = () => {
        const newErrors = {username: false, password: false, repeatPassword: false};
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
                    headers: {'Content-Type': 'multipart/form-data'},
                    withCredentials: true,
                });
            }

            const payload = {
                username: newUsername,
                password: newPassword,
                interfaceLanguage: language,
            };

            const resp = await axios.put(`${SERVER_URL}/profile`, payload, {
                withCredentials: true,
            });

            // Legacy support (harmless if unused now):
            if (resp.data?.newToken) {
                localStorage.setItem('jwtToken', resp.data.newToken);
            }

            setSnackbarSeverity('success');
            setSnackbarMessage(t('profileUpdatedSuccessfully'));
            setSnackbarOpen(true);

            setNewPassword('');
            setRepeatPassword('');

            // Refresh the profile view from server (cookie-auth)
            const refreshed = await axios.get(`${SERVER_URL}/profile`, {
                withCredentials: true,
            });
            setProfile(refreshed.data);

            // Reset baselines so the Save button disables when nothing pending
            setOriginalLanguage(language);

        } catch (err) {
            console.error('Failed to update profile', err);
            setSnackbarSeverity('error');
            setSnackbarMessage(t('updateFailed'));
            setSnackbarOpen(true);
        }
    };

    const handleLanguageMenuOpen = (event) => setLanguageAnchorEl(event.currentTarget);
    const handleMenuClose = () => setLanguageAnchorEl(null);
    const handleLanguageSelect = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        const langCode = selectedLanguage === 'עברית' ? 'he' : 'en';
        i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
        handleMenuClose();
    };

    const handleImageClick = () =>
        document.getElementById('profile-image-upload').click();

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUserImage(e.target.files[0]);
        }
    };

    if (!profile) {
        return (
            <Box>
                <Typography variant="h3" sx={{m: 10}}>
                    {t('loadingProfile')}
                </Typography>
                <Loading/>
            </Box>
        );
    }

    let displayImage = null;
    if (userImage) {
        displayImage = URL.createObjectURL(userImage);
    } else if (profile.profileImage) {
        displayImage = `data:image/jpeg;base64,${profile.profileImage}`;
    }

    const hasLanguageChanged = language !== originalLanguage;
    const hasUsernameChanged = newUsername !== profile.username;
    const hasPasswordEntered = newPassword.length > 0 || repeatPassword.length > 0;
    const hasImageUploaded = !!userImage;
    const buttonEnabled =
        hasLanguageChanged ||
        hasUsernameChanged ||
        hasPasswordEntered ||
        hasImageUploaded;

    return (
        <Box
            sx={{
                direction: GET_DIRECTION(i18n.language),
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            }}
        >
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{width: '100%'}}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Box sx={{textAlign: 'center', mt: 3}}>
                <Typography variant="h4" gutterBottom>
                    {t('profileManagement')}
                </Typography>
            </Box>

            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box
                    sx={{
                        m: 1,
                        border: '5px solid #0c8686',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 100,
                        height: 100,
                        mb: 2,
                        cursor: 'pointer',
                    }}
                    onClick={handleImageClick}
                >
                    <input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        style={{display: 'none'}}
                        onChange={handleImageChange}
                    />
                    {displayImage ? (
                        <CardMedia
                            component="img"
                            image={displayImage}
                            alt="User Profile"
                            sx={{width: '100%', height: 100, objectFit: 'cover'}}
                        />
                    ) : (
                        <CustomAccountCircleIcon style={{width: '100%', height: 100}}/>
                    )}
                </Box>

                <Box sx={{mb: 2}}>
                    <Typography variant="h6">
                        {t('currentDifficulty')}: {t(profile.currentDifficulty || 'BASIC')}
                        {profile.subDifficultyLevel > 0 && (
                            <> ({t('subLevel')} {profile.subDifficultyLevel})</>
                        )}
                    </Typography>
                </Box>

                <Stack
                    spacing={3}
                    sx={{direction: GET_DIRECTION(i18n.language), width: '90%', maxWidth: 600}}
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

                    <PasswordStrengthIndicator password={newPassword}/>

                    <PasswordTextField
                        label={t('repeatPassword')}
                        type="password"
                        value={repeatPassword}
                        error={errors.repeatPassword}
                        helperText={errors.repeatPassword ? t('passwordsMustMatch') : ''}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />

                    <TextField
                        label={t('interfaceLanguage')}
                        value={language}
                        onClick={handleLanguageMenuOpen}
                        InputProps={{readOnly: true}}
                        inputRef={languageRef}
                    />
                    <Menu
                        anchorEl={languageAnchorEl}
                        open={Boolean(languageAnchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            style: {
                                width: languageRef.current ? languageRef.current.offsetWidth : 'auto',
                            },
                        }}
                    >
                        <MenuItem onClick={() => handleLanguageSelect('English')}>English</MenuItem>
                        <MenuItem onClick={() => handleLanguageSelect('עברית')}>עברית</MenuItem>
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
