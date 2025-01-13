import PropTypes from 'prop-types';
import {Button, Box, Typography, Stack} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QuestionGenerator from "../QuestionGenerator.jsx";
import AnswerSubmission from "../AnswerSubmission.jsx";
import TopicList from "../TopicList.jsx";
import {DASHBOARD_URL} from "../../Utils/Constants.js";


function PracticePage({ onLogout }) {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                marginTop: 4,
                alignItems: 'center'
            }}
        >
            <Typography variant="h3" mb={2}>Time to practice!</Typography>

            <Stack spacing={4} sx={{ width: '100%', maxWidth: '800px' }}>
                <QuestionGenerator />
                <AnswerSubmission />
            </Stack>
        </Box>
    );
}

PracticePage.propTypes = {
    onLogout: PropTypes.func
};

export default PracticePage;