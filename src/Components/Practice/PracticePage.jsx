import PropTypes from 'prop-types';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QuestionGenerator from "../QuestionGenerator.jsx";
import AnswerSubmission from "../AnswerSubmission.jsx";
import TopicList from "../TopicList.jsx";


function PracticePage({ onLogout }) {
    const navigate = useNavigate();

    return (
        <Box >
            <Typography variant="h3" mb={2}>Practice Section</Typography>

            <QuestionGenerator />
            <AnswerSubmission />
            <TopicList />

            <Box mt={4}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/dashboard')}
                    sx={{ marginRight: 2 }}
                >
                    Back to Dashboard
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        onLogout();
                        navigate('/');
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );
}

PracticePage.propTypes = {
    onLogout: PropTypes.func
};

export default PracticePage;