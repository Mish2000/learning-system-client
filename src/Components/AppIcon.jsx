import React from 'react';
import {CardMedia} from "@mui/material";
import PropTypes from "prop-types";

AppIcon.propTypes = {
    size: PropTypes.number.isRequired
}

function AppIcon(props) {
    return (
        <CardMedia
            image={"/src/Assets/favicon.ico"}
            sx={{ height: props.size , width: props.size }}
        />
    );
}

export default AppIcon;