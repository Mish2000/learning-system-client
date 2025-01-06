import { useState } from 'react';
import axios from 'axios';

function AnswerSubmission() {
    const [questionId, setQuestionId] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [responseData, setResponseData] = useState(null);

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        const qIdNum = parseInt(questionId, 10);
        if (!qIdNum) {
            alert('Please enter a valid question ID');
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post('http://localhost:8080/api/questions/submit',
                {
                    questionId: qIdNum,
                    userAnswer
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setResponseData(response.data);
            console.log('Submit Answer Response:', response.data);
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Failed to submit answer');
        }
    };

    return (
        <div>
            <h2>Submit an Answer</h2>
            <form onSubmit={handleSubmitAnswer}>
                <label>Question ID:</label>
                <input
                    type="number"
                    value={questionId}
                    onChange={(e) => setQuestionId(e.target.value)}
                />

                <label>Your Answer:</label>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                />

                <button type="submit">Submit Answer</button>
            </form>

            {responseData && (
                <div>
                    <p>Correct? {responseData.correct ? 'Yes' : 'No'}</p>
                    <p>Correct Answer: {responseData.correctAnswer}</p>
                    <p>Solution Steps: {responseData.solutionSteps}</p>
                </div>
            )}
        </div>
    );
}

export default AnswerSubmission;
