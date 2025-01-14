import PropTypes from 'prop-types';
import {Box, Typography, Stack, Card} from '@mui/material';
import QuestionGenerator from "./QuestionGenerator.jsx";
import AnswerSubmission from "./AnswerSubmission.jsx";
import {useState} from "react";

function PracticePage({ onLogout }) {
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
                <Card>
                    <QuestionGenerator onQuestionGenerated={handleQuestionGenerated} />

                    <AnswerSubmission lastQuestionId={lastQuestionId} />
                </Card>
            </Stack>
        </Box>
    );
}

PracticePage.propTypes = {
    onLogout: PropTypes.func
};

export default PracticePage;