import { useState } from 'react';
import axios from 'axios';
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import PropTypes from "prop-types";

function AnswerSubmission({ lastQuestionId }) {
    const [userAnswer, setUserAnswer] = useState('');
    const [responseData, setResponseData] = useState(null);

    const handleSubmitAnswer = async () => {
        if (!lastQuestionId) {
            alert('No question generated yet. Please generate a question first.');
            return;
        }
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(
                'http://localhost:8080/api/questions/submit',
                {
                    questionId: lastQuestionId,
                    userAnswer
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setResponseData(response.data);
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Failed to submit answer');
        }
    };

    return (
        <Box sx={{ margin: "10px", padding: "10px" }}>
            <Stack spacing={2}>
                <Typography>Your Answer:</Typography>
                    <TextField
                        placeholder="Write your answer here"
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                    />
                <Button variant="contained" onClick={handleSubmitAnswer}>
                    Submit Answer
                </Button>
            </Stack>
            <br />
            {responseData && (
                    <Box sx={{ marginLeft: "10px", padding: "10px" }}>
                        <Typography>Correct? {responseData.correct ? 'Yes' : 'No'}</Typography>
                        <Typography>Correct Answer: {responseData.correctAnswer}</Typography>
                        <Typography>Solution Steps: {responseData.solutionSteps}</Typography>
                    </Box>
            )}
        </Box>
    );
}

AnswerSubmission.propTypes = {
    lastQuestionId: PropTypes.number
};

export default AnswerSubmission;
