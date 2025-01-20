import React, { useEffect, useState, useRef } from 'react';
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


        <Box
            sx={{
                // Full height of the viewport
                display: 'flex',
                flexDirection: 'column',
                height: "100%", width: '100%' ,
            }}
        >
            {/* Header Section */}
            <Box
                sx={{
                    flex:"column",
                    gap:5,
                    textAlign: 'center',
                 // Keep the header at the top without stretching
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
                    justifyContent: 'center', // Center the form vertically
                    alignItems: 'center', // Center the form horizontally
                }}
            >
                <Box
                    sx={{
                        margin: '5px', // Space outside the box
                        border: '5px solid #0c8686', // Black border
                        display: 'flex',
                        justifyContent: 'center',
                        // transform: 'translateX(-225px)',
                        alignItems: 'center',
                        width: '100px', // Adjusted box width
                        height: '100px', // Fixed box height
                        marginBottom: '10px',
                    }}
                >
                    <Box style={{display: 'flex', justifyContent: 'center'}}>
                        {!userImage?
                        <CustomAccountCircleIcon
                        style={{width:'100%',
                            maxWidth:'100px',
                             height:'100px'}}
                        />
                        :
                        <CardMedia
                        image={userImage}
                        />
                        }
                    </Box>

                </Box>


                <Stack spacing={5} sx={{height: "100%", width: '100%', maxWidth : '600px'}}>
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
                        sx={{
                            display: 'flex',
                            alignItems: 'center', // Align icon and text
                            justifyContent: 'center',
                        }}
                    >
                        {t('saveProfile')}
                        {isButtonDisabled ? (
                            <CancelIcon
                                color = {'#FF0000'}
                                sx={{
                                    width: '100%',
                                    maxWidth: '200px',
                                    height: '40px',
                                    marginLeft: 1, // Add spacing between text and icon
                                }}
                            />
                        ) : (
                            <CheckIcon
                                sx={{
                                    width: '100%',
                                    maxWidth: '200px',
                                    height: '40px',
                                    marginLeft: 1, // Add spacing between text and icon
                                }}/>
                        )}
                    </Button>

                </Stack>

            </Box>
        </Box>

    );

}

export default ProfilePage;
