import {CardMedia} from "@mui/material";
import PropTypes from "prop-types";

AppIcon.propTypes = {
    size: PropTypes.number.isRequired
}

function AppIcon(props) {
    return (
        <CardMedia
            image={"public/logo.jpg"}
            sx={{ height: props.size , width: props.size }}
        />
    );
}

export default AppIcon;
