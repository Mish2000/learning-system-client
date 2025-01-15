import React, {useEffect, useState} from 'react';
import {Box, Button, TextField, Typography} from "@mui/material";
import axios from "axios";
import {useLocation} from "react-router-dom";
import "../../../CSS/Fonts.css";

function NoteBook() {
    const location = useLocation();
    const myFont = "Gloria Hallelujah"
    const [generatedQuestion, setGeneratedQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState("")
    const [responseData, setResponseData] = useState("");

    const handleGenerate = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/questions/generate',
                {
                    topicId: location.pathname.split("/")[2],
                    difficultyLevel: "EASY"
                }
            );
            setGeneratedQuestion(response.data);
        } catch (err) {
            console.error('Failed to generate question', err);
        }
    };
    useEffect(() => {
        handleGenerate()
    }, []);

    const handleSubmitAnswer = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(
                'http://localhost:8080/api/questions/submit',
                {
                    questionId: generatedQuestion.id,
                    userAnswer
                },
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            );
            setResponseData(response.data);
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Failed to submit answer');
        }
    }

    return (
        <Box className="container"
             sx={{position: "absolute", width: "95%", height: "95%", marginTop: 15, marginBottom: 15}}>
            {generatedQuestion && (
                <Box sx={{display:"flex",flexDirection:"column" ,wordSpacing: 15, fontFamily: myFont}}>

                    <Typography sx={{wordSpacing: 15, fontFamily: myFont}}>
                        Question: {generatedQuestion.questionText}
                    </Typography>
                    <br/>
                    <Typography sx={{wordSpacing: 15, fontFamily: myFont}}>Your Answer:</Typography>
                    <br/>
                    <TextField sx={{fontFamily: myFont}}
                               variant="standard"
                               placeholder="Write your answer here"
                               type="text"
                               value={userAnswer}

                               onChange={(e) => {
                                   e.target.style.fontFamily = myFont;
                                   setUserAnswer(e.target.value);

                               }
                    }
                    />
                    <br/><br/>
                    <Button
                        sx={{wordSpacing: 15 , fontFamily: myFont ,color:"black",fontSize:25}}
                        variant="text" onClick={handleSubmitAnswer}>
                        Submit Answer
                    </Button>

                    {responseData && (
                        <Box sx={{marginLeft: "10px", padding: "10px"}}>
                            <Typography
                                sx={{fontFamily: myFont}}>Correct? {responseData.correct ? 'Yes' : 'No'}</Typography>
                            <Typography sx={{fontFamily: myFont}}>Correct
                                Answer: {responseData.correctAnswer}</Typography>
                            <Typography sx={{fontFamily: myFont}}>Solution
                                Steps: {responseData.solutionSteps}</Typography>
                        </Box>
                    )}

                </Box>
            )}
        </Box>
    );
}

export default NoteBook;