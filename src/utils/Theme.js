import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    cursor: `url(/Assets/pointer.png), pointer`,
                    '&:hover': {
                        cursor: `url(/Assets/pointer.png), pointer`,
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    cursor: `url(/Assets/pointer.png), pointer`,
                    '&:hover': {
                        cursor: `url(/Assets/pointer.png), pointer`,
                    },
                    '&:focus': {
                        cursor: `url(/Assets/pointer.png), pointer`,
                    },
                    '&[type="submit"]': {
                        cursor: `url(/Assets/pointer.png), pointer`,
                        '&:hover': {
                            cursor: `url(/Assets/pointer.png), pointer`,
                        },
                    },
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    cursor: `url(/Assets/pointer.png), pointer`,
                    '&:hover': {
                        cursor: `url(/Assets/pointer.png), pointer`,
                    },
                    '&:focus': {
                        cursor: `url(/Assets/pointer.png), pointer`,
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    cursor: `url(/Assets/pointer.png), text`,
                    '&:hover': {
                        cursor: `url(/Assets/pointer.png), text`,
                    },
                    '&:focus': {
                        cursor: `url(/Assets/pointer.png), text`,
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& textarea.MuiInputBase-input.MuiTextarea-input': {
                        cursor: `url(/Assets/pointer.png), text`,
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
    },
});

export default theme;

