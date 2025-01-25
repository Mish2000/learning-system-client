import  { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Typography, Box,CardMedia, TextField, Button, Stack, Menu, MenuItem } from '@mui/material';
import Loading from "../../../Utils/Loading/Loading.jsx";
import { useTranslation } from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomAccountCircleIcon from "../../../Utils/CustomAccountCircleIcon.jsx";

function ProfilePage() {
    const { t, i18n } = useTranslation();
    const [profile, setProfile] = useState(null);
    const [language, setLanguage] = useState('');
    const [originalLanguage, setOriginalLanguage] = useState('');
    const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
    const [buttonColor, setButtonColor] = useState('default');
    const languageRef = useRef(null);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userImage, setUserImage] = useState(null);
    const [errors, setErrors] = useState({ username: false, email: false, password: false, repeatPassword: false });
    const [repeatPassword, setRepeatPassword] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('http://localhost:8080/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
                setLanguage(response.data.interfaceLanguage || 'English');
                setOriginalLanguage(response.data.interfaceLanguage || 'English');
                setNewUsername(response.data.username || '');
            } catch (error) {
                console.error('Failed to fetch profile', error);
            }
        };
        fetchProfile();
    }, []);

    const validateInputs = () => {
        const newErrors = { username: false, email: false, password: false, repeatPassword: false };
        let isValid = true;

        if (newUsername.length < 4 || newUsername.length > 30 || !/^[A-Za-z0-9]+$/.test(newUsername)) {
            newErrors.username = true;
            isValid = false;
        }

        if (!/\S+@\S+\.\S+/.test(profile.email)) {
            newErrors.email = true;
            isValid = false;
        }

        if (newPassword && (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,30}/.test(newPassword))) {
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
            alert(t('pleaseCheckFields'));
            return;
        }
        try {
            const token = localStorage.getItem('jwtToken');
            const payload = {
                username: newUsername,
                password: newPassword,
                interfaceLanguage: language
            };
            if (userImage) {
                // Implement image upload logic here
                const formData = new FormData();
                formData.append('image', userImage);
                await axios.post('http://localhost:8080/api/profile/uploadImage', formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
            }
            await axios.put(
                'http://localhost:8080/api/profile',
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert(t('profileUpdatedSuccessfully'));
            setOriginalLanguage(language);
            setButtonColor('default');
            setProfile(prev => ({ ...prev, username: newUsername }));
            setNewPassword('');
            setRepeatPassword('');
        } catch (error) {
            console.error('Failed to update profile', error);
            alert(t('updateFailed'));
        }
    };

    const handleLanguageMenuOpen = (event) => {
        setLanguageAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setLanguageAnchorEl(null);
    };

    const handleLanguageSelect = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        const langCode = selectedLanguage === 'עברית' ? 'he' : 'en';
        i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
        setButtonColor('primary');
        handleMenuClose();
    };

    let buttonColorClass = 'default';
    let isButtonDisabled = true;
    if (profile) {
        const hasLanguageChanged = language !== originalLanguage;
        const hasUsernameChanged = newUsername !== profile.username;
        const hasPasswordEntered = newPassword !== '';
        buttonColorClass = (hasLanguageChanged || hasUsernameChanged || hasPasswordEntered) ? 'primary' : 'default';
        isButtonDisabled = !(hasLanguageChanged || hasUsernameChanged || hasPasswordEntered);
    }

    if (!profile) {
        return (
            <Box>
                <Typography variant="h3" sx={{ display: "flex", margin: 10, alignItems: "center", justifyContent: "center" }}>
                    {t('loadingProfile')}
                </Typography>
                <Loading />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: "100%", width: '100%',
            }}
        >
            <Box
                sx={{
                    flex: "column",
                    gap: 5,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    {t('profileManagement')}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        margin: '5px',
                        border: '5px solid #0c8686',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100px',
                        height: '100px',
                        marginBottom: '10px',
                    }}
                >
                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                        {!userImage ?
                            <CustomAccountCircleIcon
                                style={{
                                    width: '100%',
                                    maxWidth: '100px',
                                    height: '100px'
                                }}
                            />
                            :
                            <CardMedia
                                component="img"
                                image={userImage}
                                alt="User Profile"
                                sx={{ width: '100%', height: '100px', objectFit: 'cover' }}
                            />
                        }
                    </Box>
                </Box>

                <Stack spacing={5} sx={{ height: "100%", width: '100%', maxWidth: '600px' }}>
                    <TextField
                        label={t('newUsername')}
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        fullWidth
                        error={errors.username}
                        helperText={errors.username ? t('usernameHelperText') : ''}
                    />
                    <TextField
                        label={t('newPassword')}
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        error={errors.password}
                        helperText={errors.password ? t('passwordHelperText') : ''}
                    />
                    <TextField
                        label={t('repeatPassword')}
                        type="password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        fullWidth
                        error={errors.repeatPassword}
                        helperText={errors.repeatPassword ? t('passwordsMustMatch') : ''}
                    />

                    <Box>
                        <TextField
                            label={t('interfaceLanguage')}
                            value={language}
                            onClick={handleLanguageMenuOpen}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
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
                            <MenuItem onClick={() => handleLanguageSelect('English')}>
                                English
                            </MenuItem>
                            <MenuItem onClick={() => handleLanguageSelect('עברית')}>
                                עברית
                            </MenuItem>
                        </Menu>
                    </Box>

                    <Button
                        variant="contained"
                        color={buttonColorClass}
                        onClick={handleUpdate}
                        disabled={isButtonDisabled}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {t('saveProfile')}
                        {isButtonDisabled ? (
                            <CancelIcon
                                sx={{
                                    width: '100%',
                                    maxWidth: '200px',
                                    height: '40px',
                                    marginLeft: 1,
                                }}
                            />
                        ) : (
                            <CheckIcon
                                sx={{
                                    width: '100%',
                                    maxWidth: '200px',
                                    height: '40px',
                                    marginLeft: 1,
                                }} />
                        )}
                    </Button>

                </Stack>

            </Box>
        </Box>
    );

}

export default ProfilePage;
