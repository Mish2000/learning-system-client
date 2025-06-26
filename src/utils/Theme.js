import { createTheme } from '@mui/material/styles';
import { heIL, enUS } from '@mui/material/locale';

const baseThemePart = {
    palette: {
        background: { default: '#f0f0f0' },
        primary:   { main: '#0c8686'   },
        secondary: { main: '#00ffd7'   },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    cursor: 'url(/Assets/pointer.png), pointer',
                    '&:hover': { cursor: 'url(/Assets/pointer.png), pointer' },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    cursor: 'url(/Assets/pointer.png), pointer',
                    '&:hover': { cursor: 'url(/Assets/pointer.png), pointer' },
                    '&:focus': { cursor: 'url(/Assets/pointer.png), pointer' },
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    cursor: 'url(/Assets/pointer.png), pointer',
                    '&:hover': { cursor: 'url(/Assets/pointer.png), pointer' },
                    '&:focus': { cursor: 'url(/Assets/pointer.png), pointer' },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    cursor: 'url(/Assets/pointer.png), text',
                    '&:hover': { cursor: 'url(/Assets/pointer.png), text' },
                    '&:focus': { cursor: 'url(/Assets/pointer.png), text' },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& textarea.MuiInputBase-input.MuiTextarea-input': {
                        cursor: 'url(/Assets/pointer.png), text',
                    },
                },
            },
        },
    },
};

const createAppTheme = (lng = 'en') => {
    const isRtl = lng === 'he';
    const direction = isRtl ? 'rtl' : 'ltr';
    const locale = isRtl ? heIL : enUS;

    return createTheme(
        { ...baseThemePart, direction },
        locale
    );
};

export default createAppTheme;