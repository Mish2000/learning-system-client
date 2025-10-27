import { Button, ButtonGroup } from "@mui/material";
import { useTranslation } from 'react-i18next';

function setCookie(name, value, days = 365) {
    try {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    } catch {
        // no-op
    }
}

function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const current = i18n.language || 'en';

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setCookie('language', lng, 365);
    };

    return (
        <ButtonGroup variant="outlined" aria-label="language switcher">
            <Button
                onClick={() => changeLanguage('en')}
                variant={current === 'en' ? 'contained' : 'outlined'}
            >
                EN
            </Button>
            <Button
                onClick={() => changeLanguage('he')}
                variant={current === 'he' ? 'contained' : 'outlined'}
            >
                HE
            </Button>
        </ButtonGroup>
    );
}

export default LanguageSwitcher;
