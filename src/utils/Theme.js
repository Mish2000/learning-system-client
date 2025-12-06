import { createTheme } from '@mui/material/styles';
import { heIL, enUS } from '@mui/material/locale';

const baseThemePart = {
    palette: {
        mode: 'light',
        background: {
            default: '#f4f6f8', // Slightly more neutral cool grey
            paper: '#ffffff',
        },
        primary: {
            main: '#0c8686', // Preserving your brand Teal
            light: '#4fb6b6',
            dark: '#005859',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#00ffd7',
            contrastText: '#004d40',
        },
        text: {
            primary: '#212b36', // Softer black for better readability
            secondary: '#637381',
        },
    },
    shape: {
        borderRadius: 12, // Global rounded corners for a modern feel
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: {
            textTransform: 'none', // Modern convention: no all-caps buttons
            fontWeight: 700,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: "#6b6b6b #2b2b2b",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: "transparent",
                        width: 8,
                    },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: 8,
                        backgroundColor: "#6b6b6b",
                        minHeight: 24,
                    },
                    "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                        backgroundColor: "#959595",
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // Match global shape
                    padding: '8px 22px',
                    boxShadow: 'none',
                    cursor: 'url(/Assets/pointer.png), pointer',
                    '&:hover': {
                        boxShadow: '0 8px 16px 0 rgba(12, 134, 134, 0.24)',
                        cursor: 'url(/Assets/pointer.png), pointer'
                    },
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#097070',
                    }
                },
                outlined: {
                    borderWidth: 2,
                    '&:hover': {
                        borderWidth: 2,
                    },
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)', // Soft, modern elevation
                    borderRadius: 16,
                    border: 'none', // Remove default borders in favor of shadow
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                elevation1: {
                    boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
                },
            },
        },
        // --- Cursor Overrides Preserved Below ---
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
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                    },
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