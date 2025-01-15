import PropTypes from 'prop-types';
import {Box, Typography, Stack, Card} from '@mui/material';
import QuestionGenerator from "./QuestionGenerator.jsx";

function PracticePage({ onLogout }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginTop: 4,
                alignItems: "center"
            }}
        >
            <Typography variant="h3" mb={2}>
                Time to practice!
            </Typography>

            <Stack spacing={4} sx={{ marginTop: 0, width: "100%", maxWidth: "800px" }}>
                <Card>
                    <QuestionGenerator />
                </Card>
            </Stack>
        </Box>
    );
}

PracticePage.propTypes = {
    onLogout: PropTypes.func
};

export default PracticePage;