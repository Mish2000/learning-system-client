import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Typography, Box, TextField, Button, Stack, Menu, MenuItem } from '@mui/material';
import Loading from "../../../Utils/Loading/Loading.jsx";
import LoadingIcon from "../../../Utils/Loading/LoadingIcon.jsx";

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [language, setLanguage] = useState('');
    const [detailLevel, setDetailLevel] = useState('');
    const [originalLanguage, setOriginalLanguage] = useState(''); // To track original language
    const [originalDetailLevel, setOriginalDetailLevel] = useState(''); // To track original detail level
    const [languageAnchorEl, setLanguageAnchorEl] = useState(null); // To control the language dropdown menu
    const [detailLevelAnchorEl, setDetailLevelAnchorEl] = useState(null); // To control the detail level dropdown menu
    const [buttonColor, setButtonColor] = useState('default'); // For tracking button color change
    const languageRef = useRef(null); // Ref for the "Interface Language" TextField
    const detailLevelRef = useRef(null); // Ref for the "Solution Detail Level" TextField

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('http://localhost:8080/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
                setLanguage(response.data.interfaceLanguage || '');
                setDetailLevel(response.data.solutionDetailLevel || '');
                setOriginalLanguage(response.data.interfaceLanguage || ''); // Save original
                setOriginalDetailLevel(response.data.solutionDetailLevel || ''); // Save original
            } catch (error) {
                console.error('Failed to fetch profile', error);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(
                'http://localhost:8080/api/profile',
                {
                    interfaceLanguage: language,
                    solutionDetailLevel: detailLevel
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert('Profile updated successfully!');
            setOriginalLanguage(language); // Update the original state
            setOriginalDetailLevel(detailLevel); // Update the original state
            setButtonColor('default'); // Reset button color to default (gray)
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Update failed');
        }
    };

    const handleLanguageMenuOpen = (event) => {
        setLanguageAnchorEl(event.currentTarget); // Open the language menu
    };

    const handleDetailLevelMenuOpen = (event) => {
        setDetailLevelAnchorEl(event.currentTarget); // Open the detail level menu
    };

    const handleMenuClose = () => {
        setLanguageAnchorEl(null); // Close the language menu
        setDetailLevelAnchorEl(null); // Close the detail level menu
    };

    const handleLanguageSelect = (selectedLanguage) => {
        setLanguage(selectedLanguage); // Update the language state
        setButtonColor('primary'); // Change button color to indicate a change
        handleMenuClose(); // Close the dropdown after selection
    };

    const handleDetailLevelSelect = (selectedLevel) => {
        setDetailLevel(selectedLevel); // Update the detail level state
        setButtonColor('primary'); // Change button color to indicate a change
        handleMenuClose(); // Close the dropdown after selection
    };

    // Compare the current language/detail level with the original one to decide the button color
    const buttonColorClass = (language !== originalLanguage || detailLevel !== originalDetailLevel)
        ? 'primary' : 'default';

    // Disable button when the current values are the same as the original
    const isButtonDisabled = (language === originalLanguage && detailLevel === originalDetailLevel);

    if (!profile) {
        return(
            <Box>
                <Typography variant={"h3"} sx={{display:"flex",margin:10,alignItems: "center", justifyContent:"center"}}>Loading Profile...</Typography>
               <Loading/>
            </Box>

        );
    }

    return (
        <Box sx={{ padding: 4, maxWidth: '400px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Profile Management</Typography>
            <Typography variant="body1">Username: {profile.username}</Typography>
            <Typography variant="body1">Email: {profile.email}</Typography>

            <Stack spacing={2} mt={2}>
                <div>
                    {/* Interface Language with Dropdown */}
                    <TextField
                        label="Interface Language"
                        value={language}
                        onClick={handleLanguageMenuOpen} // Open the language menu on click
                        InputProps={{
                            readOnly: true, // Make it non-editable directly
                        }}
                        fullWidth
                        inputRef={languageRef} // Assign ref to the TextField
                    />
                    <Menu
                        anchorEl={languageAnchorEl}
                        open={Boolean(languageAnchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            style: {
                                width: languageRef.current ? languageRef.current.offsetWidth : 'auto', // Match width of the TextField
                            },
                        }}
                    >
                        <MenuItem onClick={() => handleLanguageSelect('English')}>
                            English
                        </MenuItem>
                        <MenuItem onClick={() => handleLanguageSelect('Hebrew')}>
                            Hebrew
                        </MenuItem>
                        <MenuItem onClick={() => handleLanguageSelect('Spanish')}>
                            Spanish
                        </MenuItem>
                    </Menu>
                </div>

                <div>
                    {/* Solution Detail Level with Dropdown */}
                    <TextField
                        label="Solution Detail Level"
                        value={detailLevel}
                        onClick={handleDetailLevelMenuOpen} // Open the detail level menu on click
                        InputProps={{
                            readOnly: true, // Make it non-editable directly
                        }}
                        fullWidth
                        inputRef={detailLevelRef} // Assign ref to the TextField
                    />
                    <Menu
                        anchorEl={detailLevelAnchorEl}
                        open={Boolean(detailLevelAnchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            style: {
                                width: detailLevelRef.current ? detailLevelRef.current.offsetWidth : 'auto', // Match width of the TextField
                            },
                        }}
                    >
                        <MenuItem onClick={() => handleDetailLevelSelect('Easy')}>
                            Easy
                        </MenuItem>
                        <MenuItem onClick={() => handleDetailLevelSelect('Medium')}>
                            Medium
                        </MenuItem>
                        <MenuItem onClick={() => handleDetailLevelSelect('Hard')}>
                            Hard
                        </MenuItem>
                    </Menu>
                </div>

                <Button
                    variant="contained"
                    color={buttonColorClass}
                    onClick={handleUpdate}
                    disabled={isButtonDisabled} // Disable the button if no changes have been made
                >
                    Save Profile
                </Button>
            </Stack>
        </Box>
    );
}

export default ProfilePage;
