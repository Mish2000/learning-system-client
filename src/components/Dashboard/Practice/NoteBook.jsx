// NoteBook.jsx
import { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Fonts.css";
import {GET_DIRECTION, PRACTICE_URL} from "../../../utils/Constants.js";
import Loading from "../../Common/Loading.jsx";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTranslation } from "react-i18next";
import { translateSolutionSteps } from "../../../utils/translateSolutionSteps.js";

function NoteBook() {
    const { questionId } = useParams();
    const myFont = "Gloria Hallelujah";
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [answerPartOne,setAnswerPartOne] = useState("");
    const [answerPartTwo, setAnswerPartTwo] = useState("");
    const [userAnswerPart1, setUserAnswerPart1] = useState("");
    const [userAnswerPart2, setUserAnswerPart2] = useState("");
    const [responseData, setResponseData] = useState(null);
    const [color, setColor] = useState("inherit");
    const [difficulty, setDifficulty ] =useState('') ;
    const [isClicked, setIsClicked] = useState(false);



    useEffect(() => {
        setColor(responseData?.correct ? 'green' : 'red');
    }, [responseData]);

    const isFractions = ()  =>{
        console.log("entered ");
        return answerPartOne === "Numerator" && answerPartTwo === "Denominator";
    };

    const isOnlyDigitsMeansInteger = (str) => {
        const pattern = /^\d+$/;
        return pattern.test(str);
    };

    useEffect(() => {
        async function fetchQuestion() {
            try {
                const res = await axios.get(`http://localhost:8080/api/questions/${questionId}`);
                setQuestion(res.data);
                setDifficulty(res.data.difficultyLevel);
                if (res.data.topicId) {
                    const resTopic = await axios.get(`http://localhost:8080/api/topics/${res.data.topicId}`);
                    if (resTopic.data.parentId === 1) {
                        switch (resTopic.data.name) {
                            case "Fractions" :
                                setAnswerPartOne("Numerator");
                                setAnswerPartTwo("Denominator");
                                break;
                            default:
                                break;
                        }
                    } else if (resTopic.data.parentId === 3) {
                        setAnswerPartOne("Area");
                        switch (resTopic.data.name) {
                            case "Polygon":
                                setAnswerPartOne("Polygon");
                                break;
                            case "Rectangle":
                                setAnswerPartTwo("Perimeter");
                                break;
                            case "Triangle":
                                setAnswerPartTwo("Hypotenuse");
                                break;
                            case "Circle":
                                setAnswerPartTwo("Circumference");
                                break;
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching question:", err);
            }
        }
        if (questionId) {
            fetchQuestion();
        }
    }, [questionId]);

    function isValidDouble(input) {
        const doublePattern = /^\d+(\.\d*)?$/;
        return doublePattern.test(input);
    }


    function handleNumberFormatting(input) {
        input = input.trim();

        const integerPattern = /^\d+$/;
        const integerWithDotPattern = /^\d+\.$/;
        const oneDecimalPattern = /^\d+\.\d$/;
        const twoDecimalPattern = /^\d+\.\d{2}$/;
        const threeToTenDecimalPattern = /^\d+\.\d{3,10}$/;

        let formattedValue;

        if (integerPattern.test(input)) {
            formattedValue = parseFloat(input).toFixed(2);
        } else if (integerWithDotPattern.test(input)) {
            formattedValue = parseFloat(input).toFixed(2);
        } else if (oneDecimalPattern.test(input)) {
            formattedValue = parseFloat(input).toFixed(2);
        } else if (twoDecimalPattern.test(input)) {
            formattedValue = input;
        } else if (threeToTenDecimalPattern.test(input)) {
            const decimalPart = input.split('.')[1];
            const firstTwoDigits = decimalPart.substring(0, 2);
            const thirdDigit = parseInt(decimalPart[2]);
            const integerPart = input.split('.')[0];

            if (thirdDigit > 0) {
                const firstTwoDigitsRounded = parseFloat(firstTwoDigits) + 1;
                formattedValue = `${integerPart}.${String(firstTwoDigitsRounded).padStart(2, '0')}`;
            } else {
                formattedValue = parseFloat(input).toFixed(2);
            }
        } else {
            return null;
        }

        return formattedValue;
    }

    const handleSubmitAnswer = async () => {
        if (!question) {
            alert(t('noQuestionLoaded'));
            return;
        }
        try {
            const token = localStorage.getItem("jwtToken");
            let finalUserAnswer;
            if (userAnswer) {
                if (answerPartOne === "Polygon") {
                    const formatted = handleNumberFormatting(userAnswer);
                    finalUserAnswer = `${formatted}`;
                } else {
                    finalUserAnswer = userAnswer;
                }
            } else if (isFractions()) {
                finalUserAnswer = `${userAnswerPart1}/${userAnswerPart2}`;
            } else {
                if (answerPartTwo === "Circumference" || answerPartTwo === "Hypotenuse") {
                    const formattedPart1 = handleNumberFormatting(userAnswerPart1);
                    const formattedPart2 = handleNumberFormatting(userAnswerPart2);
                    finalUserAnswer = `${formattedPart1},${formattedPart2}`;
                } else {
                    finalUserAnswer = `${userAnswerPart1},${userAnswerPart2}`;
                }
            }

            const submitRes = await axios.post(
                "http://localhost:8080/api/questions/submit",
                { questionId: question.id, userAnswer: finalUserAnswer },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResponseData(submitRes.data);

            const profileRes = await axios.get(
                "http://localhost:8080/api/profile",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedDifficulty = profileRes.data.currentDifficulty;
            setDifficulty(updatedDifficulty);

        } catch (error) {
            console.error("Error submitting answer:", error);
            alert(t('failedToSubmitAnswer'));
        }
    };

    useEffect(() => {
        if (!isClicked) return;

        async function handleUserAnswerWithTwoParts() {
            if (userAnswerPart1.length > 0 && userAnswerPart2.length > 0 ) {
                if (isFractions()) {
                    setUserAnswer(userAnswerPart1 + "/" + userAnswerPart2);
                } else {
                    setUserAnswer(userAnswerPart1 + ", " + userAnswerPart2);
                }
                setUserAnswerPart1("");
                setUserAnswerPart2("");
            }
        }

        handleUserAnswerWithTwoParts();
    }, [isClicked]);


    useEffect(() => {
        console.log("userAnswer : "+userAnswer);
    }, [userAnswer]);


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
                direction: GET_DIRECTION(i18n.language),
                position: "absolute",
                width: "95%",
                height: "95%",
                marginTop: 15,
                marginBottom: 15,
                padding: 2
            }}
        >
            <Typography sx={{ fontFamily: myFont, fontSize: 20, marginTop: 2, marginBottom: 2 }}>
                {t('currentDifficulty')}: {difficulty}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", wordSpacing: 15, fontFamily: myFont }}>
                <Typography sx={{ wordSpacing: 15, fontFamily: myFont }}>
                    {t('question')}: {t(question.questionText)}
                </Typography>
                <br />
                <Typography sx={{ wordSpacing: 15, fontFamily: myFont }}>{t('yourAnswer')}</Typography>
                <br />
                {
                    (answerPartOne.length > 0 && answerPartTwo.length > 0) ?
                        <>

                            <TextField
                                variant="standard"
                                placeholder={t(answerPartOne)}
                                type="text"
                                value={userAnswerPart1}
                                onChange={(e) => {
                                    e.target.style.fontFamily = myFont;
                                    setUserAnswerPart1(e.target.value);
                                }}
                            />
                            <TextField
                                variant="standard"
                                placeholder={t(answerPartTwo)}
                                type="text"
                                value={userAnswerPart2}
                                onChange={(e) => {
                                    e.target.style.fontFamily = myFont;
                                    setUserAnswerPart2(e.target.value);
                                }}
                            />
                        </>
                        :
                        <>
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
                        </>
                }
                <br /><br />
                <Button

                    disabled={
                        isFractions() ?
                            (!isOnlyDigitsMeansInteger(userAnswerPart1) || !isOnlyDigitsMeansInteger(userAnswerPart2))
                            || (userAnswerPart1.length === 0 && userAnswerPart2.length === 0 )
                            : (userAnswerPart1.length > 0 && userAnswerPart2.length > 0) ?
                                (userAnswerPart1.length === 0 && userAnswerPart2.length === 0
                                    ||
                                    (!isValidDouble(userAnswerPart1) || !isValidDouble(userAnswerPart2))
                                ) : (userAnswer.length === 0 || responseData !== null)}

                    variant="text"
                    sx={{ wordSpacing: 15, fontFamily: myFont, color: "black", fontSize: 25 }}
                    onClick={() => {
                        setIsClicked(true);
                        handleSubmitAnswer();
                    }}
                >
                    {t('submitAnswer')}
                </Button>
                <br />
                {responseData && (
                    <Box>
                        <Typography sx={{ fontFamily: myFont , color}}>
                            {t('correct')}? : {responseData.correct ? t('yes') : t('no')}
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
                        <Box sx={{ display: "flex", flexDirection: "row-reverse", justifyContent: "center", gap: 15 }}>
                            <Button
                                sx={{ wordSpacing: 15, fontFamily: myFont, color: "black", fontSize: 25 }}
                                onClick={async () => {
                                    try {
                                        setIsClicked(false);
                                        setUserAnswer("");
                                        setResponseData(null);

                                        const token = localStorage.getItem("jwtToken");
                                        const response = await axios.post(
                                            "http://localhost:8080/api/questions/generate",
                                            {
                                                topicId: question.topicId ?? null,
                                                difficultyLevel: null
                                            },
                                            { headers: { Authorization: `Bearer ${token}` } }
                                        );
                                        const newQ = response.data;
                                        setQuestion(newQ);
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