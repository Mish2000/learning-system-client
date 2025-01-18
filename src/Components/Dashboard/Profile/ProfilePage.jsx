import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Typography, Box, TextField, Button, Stack, Menu, MenuItem } from '@mui/material';
import Loading from "../../../Utils/Loading/Loading.jsx";
import { useTranslation } from 'react-i18next';

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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('http://localhost:8080/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
                setLanguage(response.data.interfaceLanguage || '');
                setOriginalLanguage(response.data.interfaceLanguage || '');
                setNewUsername(response.data.username || '');
            } catch (error) {
                console.error('Failed to fetch profile', error);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const payload = {
                username: newUsername,
                password: newPassword,
                interfaceLanguage: language
            };
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
        i18n.changeLanguage(selectedLanguage === 'Hebrew' ? 'he' : 'en');
        setButtonColor('primary');
        handleMenuClose();
    };

    let buttonColorClass = 'default';
    let isButtonDisabled = true;
    if(profile) {
        const hasLanguageChanged = language !== originalLanguage;
        const hasUsernameChanged = newUsername !== profile.username;
        const hasPasswordEntered = newPassword !== '';
        buttonColorClass = (hasLanguageChanged || hasUsernameChanged || hasPasswordEntered)
            ? 'primary'
            : 'default';
        isButtonDisabled = !(hasLanguageChanged || hasUsernameChanged || hasPasswordEntered);
    }

    if (!profile) {
        return(
            <Box>
                <Typography variant="h3" sx={{display:"flex", margin:10, alignItems:"center", justifyContent:"center"}}>
                    {t('loadingProfile')}
                </Typography>
                <Loading/>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4, maxWidth: '400px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>{t('profileManagement')}</Typography>
            <Typography variant="body1">{t('username')}: {profile.username}</Typography>
            <Typography variant="body1">{t('email')}: {profile.email}</Typography>

            <Stack spacing={2} mt={2}>
                <TextField
                    label={t('newUsername')}
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    fullWidth
                />
                <TextField
                    label={t('newPassword')}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                />

                <div>
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
                        <MenuItem onClick={() => handleLanguageSelect('Hebrew')}>
                            Hebrew
                        </MenuItem>
                    </Menu>
                </div>

                <Button
                    variant="contained"
                    color={buttonColorClass}
                    onClick={handleUpdate}
                    disabled={isButtonDisabled}
                >
                    {t('saveProfile')}
                </Button>
            </Stack>
        </Box>
    );
}

export default ProfilePage;
