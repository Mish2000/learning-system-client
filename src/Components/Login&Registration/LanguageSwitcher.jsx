import { Button, ButtonGroup } from "@mui/material";
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    return (
        <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={() => changeLanguage('en')}>EN</Button>
            <Button onClick={() => changeLanguage('he')}>HE</Button>
        </ButtonGroup>
    );
}

export default LanguageSwitcher;