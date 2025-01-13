import PropTypes from 'prop-types';
import {Button, Box, Typography, Stack} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QuestionGenerator from "../QuestionGenerator.jsx";
import AnswerSubmission from "../AnswerSubmission.jsx";
import {DASHBOARD_URL} from "../../Utils/Constants.js";
import {useState} from "react";

function PracticePage({ onLogout }) {
    const navigate = useNavigate();
    const [lastQuestionId, setLastQuestionId] = useState(null);

    const handleQuestionGenerated = (questionData) => {
        setLastQuestionId(questionData.id);
    };

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
            <Typography variant="h3" mb={2}>
                Time to practice!
            </Typography>

            <Stack spacing={4} sx={{ width: '100%', maxWidth: '800px' }}>
                <QuestionGenerator onQuestionGenerated={handleQuestionGenerated} />
                <AnswerSubmission lastQuestionId={lastQuestionId} />
            </Stack>

            <Box mt={4} sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(DASHBOARD_URL)}
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