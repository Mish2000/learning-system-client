import {useEffect, useState} from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography} from "@mui/material";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import "../../../CSS/Fonts.css";
import {PRACTICE_URL} from "../../../Utils/Constants.js";
import Loading from "../../../Utils/Loading/Loading.jsx";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {useTranslation} from "react-i18next";

function NoteBook() {
    const {questionId} = useParams();
    const myFont = "Gloria Hallelujah";
    const [question, setQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [responseData, setResponseData] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

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
                    headers: {Authorization: `Bearer ${token}`}
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
            <Box sx={{margin: 4}}>
                <Typography>{t('loadingQuestionData')}</Typography>
                <Loading/>
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
            <Box sx={{display: "flex", flexDirection: "column", wordSpacing: 15, fontFamily: myFont}}>
                <Typography sx={{wordSpacing: 15, fontFamily: myFont}}>
                    {t('question')}: {question.questionText}
                </Typography>
                <br/>
                <Typography sx={{wordSpacing: 15, fontFamily: myFont}}>{t('yourAnswer')}</Typography>
                <br/>
                <TextField
                    variant="standard"
                    placeholder={t('writeYourAnswerHere')}
                    type="text"
                    value={userAnswer}
                    onChange={(e) => {
                        e.target.style.fontFamily = myFont;
                        setUserAnswer(e.target.value);
                    }}
                />
                <br/>
                <br/>
                <Button
                    sx={{wordSpacing: 15, fontFamily: myFont, color: "black", fontSize: 25}}
                    variant="text"
                    onClick={handleSubmitAnswer}
                >
                    {t('submitAnswer')}
                </Button>

                <br/>
                {responseData && (
                    <Box>
                        <Typography sx={{fontFamily: myFont}}>
                            {t('correct')}: {responseData.correct ? t('yes') : t('no')}
                        </Typography>
                        <br/>
                        <Accordion sx={{
                            bgcolor: 'transparent',
                            '& .MuiAccordionSummary-root': {
                                bgcolor: 'transparent',
                            },
                            '& .MuiAccordionDetails-root': {
                                bgcolor: 'transparent',
                            },
                            border: '2px solid #000000',
                        }}>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon/>}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <Typography sx={{fontFamily: myFont}} component="span">{t('seeStepsAndAnswer')}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography sx={{fontFamily: myFont}}>
                                    {t('correctAnswer')}: {responseData.correctAnswer}
                                </Typography>
                                <br/>
                                <Typography sx={{fontFamily: myFont}}>
                                    {t('solutionSteps')}: {responseData.solutionSteps}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Box sx={{display: "flex", flexDirection: "row-reverse", justifyContent: "center", gap: 3}}>
                            <Button
                                sx={{wordSpacing: 15, fontFamily: myFont, color: "black", fontSize: 25}}
                                onClick={async () => {
                                    try {
                                        console.log(question)
                                        const token = localStorage.getItem("jwtToken");
                                        const res = await axios.post(
                                            "http://localhost:8080/api/questions/generate",
                                            {
                                                topicId: question.topicId ?? null,
                                                difficultyLevel: question.difficultyLevel
                                            },
                                            {headers: {Authorization: `Bearer ${token}`}}
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
                                {t('nextQuestion')}
                            </Button>
                            <Button
                                sx={{wordSpacing: 15, fontFamily: myFont, color: "black", fontSize: 25}}
                                onClick={() => navigate(PRACTICE_URL)}
                            >
                                {t('changeSubject')}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default NoteBook;