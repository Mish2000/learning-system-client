import {Box} from "@mui/material";
import LoadingIcon from "./LoadingIcon.jsx";

function Loading() {
    return (
        <Box sx={{ display:"ruby-text",width:'100%', height:'100%'}}>
            <LoadingIcon style={{width:"100%",alignItems: "center", justifyContent:"center"}} />
        </Box>
    );
}export default Loading;
