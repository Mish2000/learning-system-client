import {useEffect, useState} from 'react';
import {Box, Button, TextField, Typography} from "@mui/material";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import "../../../CSS/Fonts.css";
import {PRACTICE_URL} from "../../../Utils/Constants.js";
import Loading from "../../../Utils/Loading/Loading.jsx";

function NoteBook() {
    const { questionId } = useParams();
    const myFont = "Gloria Hallelujah";

    const [question, setQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [responseData, setResponseData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchQuestion() {
            try {
                const res = await axios.get(`http://localhost:8080/api/questions/${questionId}`);
                setQuestion(res.data);
            } catch (err) {
                console.error("Error fetching question:", err);
            }
        }
        fetchQuestion();
    }, [questionId]);

    const handleSubmitAnswer = async () => {
        if (!question) {
            alert("No question loaded yet.");
            return;
        }
        try {
            const token = localStorage.getItem("jwtToken");
            const res = await axios.post(
                "http://localhost:8080/api/questions/submit",
                {
                    questionId: question.id,
                    userAnswer
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setResponseData(res.data);
        } catch (error) {
            console.error("Error submitting answer:", error);
            alert("Failed to submit answer");
        }
    };

    if (!question) {
        return (
            <Box sx={{ margin: 4 }}>
                <Typography>Loading question data...</Typography>
                <Loading />
            </Box>
        );
    }

    return (
        <Box
            className="container"
            sx={{
                position: "absolute",
                width: "95%",
                height: "95%",
                marginTop: 15,
                marginBottom: 15,
                padding: 2
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", wordSpacing: 15, fontFamily: myFont }}>
                <Typography sx={{ wordSpacing: 15, fontFamily: myFont }}>
                    Question: {question.questionText}
                </Typography>
                <br />
                <Typography sx={{ wordSpacing: 15, fontFamily: myFont }}>Your Answer:</Typography>
                <br />
                <TextField
                    variant="standard"
                    placeholder="Write your answer here"
                    type="text"
                    value={userAnswer}
                    onChange={(e) => {
                        e.target.style.fontFamily = myFont;
                        setUserAnswer(e.target.value);
                    }}
                />
                <br />
                <br />
                <Button
                    sx={{ wordSpacing: 15, fontFamily: myFont, color: "black", fontSize: 25 }}
                    variant="text"
                    onClick={handleSubmitAnswer}
                >
                    Submit Answer
                </Button>

                <br />
                {responseData && (
                    <Box>
                        <Typography sx={{ fontFamily: myFont }}>
                            Correct? {responseData.correct ? "Yes" : "No"}
                        </Typography>
                        <Typography sx={{ fontFamily: myFont }}>
                            Correct Answer: {responseData.correctAnswer}
                        </Typography>
                        <Typography sx={{ fontFamily: myFont }}>
                            Solution Steps: {responseData.solutionSteps}
                        </Typography>
                        <br />
                        <br />
                        <Box sx={{ display: "flex", flexDirection: "row-reverse", justifyContent: "center", gap: 3 }}>
                            <Button
                                sx={{ wordSpacing: 15, fontFamily: myFont, color: "black", fontSize: 25 }}
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem("jwtToken");
                                        const res = await axios.post(
                                            "http://localhost:8080/api/questions/generate",
                                            { topicId: question.topic?.id ?? null, difficultyLevel: question.difficultyLevel },
                                            { headers: { Authorization: `Bearer ${token}` } }
                                        );
                                        const newQ = res.data;
                                        setQuestion(newQ);
                                        setUserAnswer("");
                                        setResponseData(null);
                                    } catch (err) {
                                        console.error("Failed to get next question:", err);
                                    }
                                }}
                            >
                                Next Question
                            </Button>
                            <Button
                                sx={{ wordSpacing: 15, fontFamily: myFont, color: "black", fontSize: 25 }}
                                onClick={() => navigate(PRACTICE_URL)}
                            >
                                change Subject
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default NoteBook;