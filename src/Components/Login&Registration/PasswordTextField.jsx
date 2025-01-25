import { useState } from 'react';
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PropTypes from 'prop-types';

const PasswordTextField = ({ label, helperText, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <TextField
            {...props}
            label={label}
            type={showPassword ? 'text' : 'password'}
            helperText={helperText}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

PasswordTextField.propTypes = {
    label: PropTypes.string.isRequired,
    helperText: PropTypes.string,
};

export default PasswordTextField;