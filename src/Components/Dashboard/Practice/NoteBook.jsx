// NoteBook.jsx
import { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../../CSS/Fonts.css";
import { PRACTICE_URL } from "../../../Utils/Constants.js";
import Loading from "../../../Utils/Loading/Loading.jsx";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTranslation } from "react-i18next";
import { translateSolutionSteps } from "../../../Utils/Translate/translateSolutionSteps.js";

function NoteBook() {
    const { questionId } = useParams();
    const myFont = "Gloria Hallelujah";
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [responseData, setResponseData] = useState(null);
    const [color, setColor] = useState("inherit");
    const [ difficulty, setDifficulty ] =useState('') ;
    const [correctAnswerCounter, setCorrectAnswerCounter] = useState(0);
    const [incorrectAnswerCounter, setIncorrectAnswerCounter] = useState(0);


    useEffect(() => {
        setColor(responseData?.correct ? 'green' : 'red');
    }, [responseData]);

    useEffect(() => {
        async function fetchQuestion() {
            try {
                const res = await axios.get(`http://localhost:8080/api/questions/${questionId}`);
                setQuestion(res.data);
                setDifficulty(res.data.difficultyLevel);
                setCorrectAnswerCounter(0); // Reset counters for new question
                setIncorrectAnswerCounter(0);
            } catch (err) {
                console.error("Error fetching question:", err);
            }
        }
        if (questionId) { // Only fetch if questionId is available
            fetchQuestion();
        }
    }, [questionId]);

    const handleSubmitAnswer = async () => {
        if (!question) {
            alert(t('noQuestionLoaded'));
            return;
        }
        try {
            const token = localStorage.getItem("jwtToken");
            const res = await axios.post(
                "http://localhost:8080/api/questions/submit",
                { questionId: question.id, userAnswer },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResponseData(res.data);

            if (res.data.correct) {
                setCorrectAnswerCounter(prev => prev + 1);
                setIncorrectAnswerCounter(0);
            } else {
                setIncorrectAnswerCounter(prev => prev + 1);
                setCorrectAnswerCounter(0);
            }

            if (correctAnswerCounter >= 2) { // Adjusted thresholds
                increaseDifficulty();
                setCorrectAnswerCounter(0);
            } else if (incorrectAnswerCounter >= 2) { // Adjusted thresholds
                decreaseDifficulty();
                setIncorrectAnswerCounter(0);
            }

        } catch (error) {
            console.error("Error submitting answer:", error);
            alert(t('failedToSubmitAnswer'));
        }
    };

    const increaseDifficulty = () => {
        const difficultyLevels = ['BASIC', 'EASY', 'MEDIUM', 'ADVANCED', 'EXPERT'];
        const currentIndex = difficultyLevels.indexOf(difficulty);
        if (currentIndex < difficultyLevels.length - 1) {
            const newDifficulty = difficultyLevels[currentIndex + 1];
            setDifficulty(newDifficulty);
            console.log("Difficulty increased to:", difficultyLevels[currentIndex + 1]);
        }
    };

    const decreaseDifficulty = () => {
        const difficultyLevels = ['BASIC', 'EASY', 'MEDIUM', 'ADVANCED', 'EXPERT'];
        const currentIndex = difficultyLevels.indexOf(difficulty);
        if (currentIndex > 0) {
            const newDifficulty = difficultyLevels[currentIndex - 1];
            setDifficulty(newDifficulty);
            console.log("Difficulty decreased to:", difficultyLevels[currentIndex - 1]);
        }
    };

    if (!question) {
        return (
            <Box sx={{ margin: 4 }}>
                <Typography>{t('loadingQuestionData')}</Typography>
                <Loading />
            </Box>
        );
    }

    const translatedSteps = i18n.language === 'he' && responseData && responseData.solutionSteps
        ? translateSolutionSteps(responseData.solutionSteps, t)
        : responseData
            ? responseData.solutionSteps
            : "";


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
                    {t('question')}: {question.questionText}
                </Typography>
                <br />
                <Typography sx={{ wordSpacing: 15, fontFamily: myFont }}>{t('yourAnswer')}</Typography>
                <br />
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
                <br /><br />
                <Button
                    disabled={userAnswer.length === 0 || responseData !== null}
                    variant="text"
                    sx={{ wordSpacing: 15, fontFamily: myFont, color: "black", fontSize: 25 }}
                    onClick={handleSubmitAnswer}
                >
                    {t('submitAnswer')}
                </Button>
                <br />
                {responseData && (
                    <Box>
                        <Typography sx={{ fontFamily: myFont , color}}>
                            {t('correct')}: {responseData.correct ? t('yes') : t('no')}
                        </Typography>
                        <br />
                        <Accordion sx={{
                            bgcolor: 'transparent',
                            '& .MuiAccordionSummary-root': { bgcolor: 'transparent' },
                            '& .MuiAccordionDetails-root': { bgcolor: 'transparent' },
                            border: '2px solid #000000',
                        }}>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <Typography sx={{ fontFamily: myFont }}>{t('seeStepsAndAnswer')}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography sx={{ fontFamily: myFont }}>
                                    {t('correctAnswer')}: {responseData.correctAnswer}
                                </Typography>
                                <br />
                                <Typography sx={{ whiteSpace: "break-spaces", fontFamily: myFont }}>
                                    {t('solutionSteps')}:<br /><br />{translatedSteps}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Box sx={{ display: "flex", flexDirection: "row-reverse", justifyContent: "center", gap: 3 }}>
                            <Button
                                sx={{ wordSpacing: 15, fontFamily: myFont, color: "black", fontSize: 25 }}
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem("jwtToken");
                                        const res = await axios.post(
                                            "http://localhost:8080/api/questions/generate",
                                            { topicId: question.topicId ?? null, difficultyLevel:difficulty },
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
                                {t('nextQuestion')}
                            </Button>
                            <Button
                                sx={{ wordSpacing: 15, fontFamily: myFont, color: "black", fontSize: 25 }}
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