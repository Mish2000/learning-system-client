import {Button, Stack, Typography} from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import {Link} from "react-router-dom";
import {HOME_URL} from "../../Utils/Constants.js";


function Error404() {
    return (
        <Stack
            textAlign="center"
            padding={16}
            direction="column"
            spacing={4}
        >

            <Typography color='error'
                        variant="h1"
            >
                <ErrorIcon sx={{width: 90, height: 90}}/> Error 404
            </Typography>

            <Typography color='error'
                        variant="h4"
            >
                Not Found
            </Typography>

            <Link to={HOME_URL}>
                <Button
                    variant={'contained'}
                    color={'error'}
                    sx={{textTransform: 'inherit'}}
                >
                    Go Back
                </Button>

            </Link>
        </Stack>

    );
}

export default Error404;
