// NoteBook.jsx
import { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Fonts.css";
import { PRACTICE_URL } from "../../../utils/Constants.js";
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
    const [correctAnswerCounter, setCorrectAnswerCounter] = useState(0);
    const [incorrectAnswerCounter, setIncorrectAnswerCounter] = useState(0);
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
                setCorrectAnswerCounter(0); // Reset counters for new question
                setIncorrectAnswerCounter(0);
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
        // Regular expression to match:
        // 1. Only numbers: ^\d+$
        // 2. Number with a point but no digits after it: ^\d+\.$
        // 3. Number with a point and 1 or more digits after it: ^\d+\.\d+$
        const doublePattern = /^\d+(\.\d*)?$/;

        // Test if the input matches the pattern
        return doublePattern.test(input);
    }


    function handleNumberFormatting(input) {
        // Trim any unnecessary spaces
        input = input.trim();

        // Option 1: Integer (no decimal part)
        const integerPattern = /^\d+$/;
        // Option 2: Integer with a decimal point but no digits after it
        const integerWithDotPattern = /^\d+\.$/;
        // Option 3: Double with 1 decimal digit
        const oneDecimalPattern = /^\d+\.\d$/;
        // Option 4: Double with exactly 2 decimal digits
        const twoDecimalPattern = /^\d+\.\d{2}$/;
        // Option 5: Double with 3 to 10 decimal digits
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
                    console.log("answerPartOne", finalUserAnswer);
                } else {
                    finalUserAnswer = userAnswer;
                }
            } else if (isFractions()) {
                finalUserAnswer = `${userAnswerPart1}/${userAnswerPart2}`;
                console.log("entered us1,us2");
            } else {
                // setUserAnswerPart1(formatAnswerPart(userAnswerPart1));
                // setUserAnswerPart2(formatAnswerPart(userAnswerPart2));
                if (answerPartTwo === "Circumference" || answerPartTwo === "Hypotenuse") {
                    const formattedPart1 = handleNumberFormatting(userAnswerPart1);
                    const formattedPart2 = handleNumberFormatting(userAnswerPart2);
                    finalUserAnswer = `${formattedPart1},${formattedPart2}`;
                    console.log("circumference", finalUserAnswer);
                } else
                    finalUserAnswer = `${userAnswerPart1},${userAnswerPart2}`;
            }
            console.log("finalUserAnswer "+finalUserAnswer);
            const res = await axios.post(
                "http://localhost:8080/api/questions/submit",
                {
                    questionId: question.id,
                    userAnswer: finalUserAnswer
                },
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
                                onClick={
                                    async () => {
                                        try {
                                            setIsClicked(false);
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