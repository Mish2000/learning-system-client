import { CardMedia } from "@mui/material";
import PropTypes from "prop-types";
import favicon from "../../assets/favicon.png";

function AppIcon({ size }) {
    return (
        <CardMedia
            component="img"
            image={favicon}
            alt="QuickMath logo"
            sx={{ height: size, width: size }}
        />
    );
}

AppIcon.propTypes = {
    size: PropTypes.number.isRequired
};

export default AppIcon;
