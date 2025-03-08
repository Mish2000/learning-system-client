import {CardMedia} from "@mui/material";
import PropTypes from "prop-types";

function AppIcon(props) {
    return (
        <CardMedia
            image={"src/assets/favicon.png"}
            sx={{ height: props.size , width: props.size }}
        />
    );
}

export default AppIcon;

AppIcon.propTypes = {
    size: PropTypes.number.isRequired
}
