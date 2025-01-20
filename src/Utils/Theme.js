// theme.js
import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    cursor: 'url(src/Assets/img.png), pointer',
                    '&:hover': {
                        cursor: 'url(src/Assets/pointer.png), pointer',
                    },
                },
            },
            MuiSelect: {
                styleOverrides: {
                    root: {
                        cursor: 'url(src/Assets/img.png), pointer',
                        '&:hover': {
                            cursor: 'url(src/Assets/img.png), pointer',
                        },
                        '&:focus': {
                            cursor: 'url(src/Assets/img.png), pointer',
                        },
                        '&[type="submit"]': {
                            cursor: 'url(src/Assets/pointer.png), pointer',
                            '&:hover': {
                                cursor: 'url(src/Assets/pointer.png), pointer',
                            },
                        },
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        cursor: 'url(src/Assets/img.png), pointer',
                        '&:hover': {
                            cursor: 'url(src/Assets/img.png), hand',
                        },
                        '&:focus': {
                            cursor: 'url(src/Assets/img.png), pointer',
                        },
                    },
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    input: {
                        cursor: 'url(src/Assets/img.png), text',
                        '&:hover': {
                            cursor: 'url(src/Assets/img.png), text',
                        },
                        '&:focus': {
                            cursor: 'url(src/Assets/img.png), text',
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& textarea.MuiInputBase-input.MuiTextarea-input': {
                            cursor: 'url(src/Assets/img.png), text',
                        },
                    },
                },
            },

        },
        palette: {
            background: {
                default: '#f0f0f0',
            },
            primary: {
                main: '#0c8686',
            },
            secondary: {
                main: '#00ffd7',
            },

        }
    }
});

export default theme;