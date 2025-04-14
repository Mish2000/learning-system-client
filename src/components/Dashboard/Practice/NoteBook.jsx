import { useEffect, useRef, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Fonts.css";
import { GET_DIRECTION, PRACTICE_URL, SERVER_URL } from "../../../utils/Constants.js";
import Loading from "../../Common/Loading.jsx";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTranslation } from "react-i18next";
import { translateSolutionSteps } from "../../../utils/translateSolutionSteps.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import 'katex/dist/katex.min.css';

function NoteBook() {
    const { questionId } = useParams();
    const myFont = "Gloria Hallelujah";
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [question, setQuestion] = useState(null);

    const [userAnswer, setUserAnswer] = useState("");
    const [answerPartOne, setAnswerPartOne] = useState("");
    const [answerPartTwo, setAnswerPartTwo] = useState("");
    const [userAnswerPart1, setUserAnswerPart1] = useState("");
    const [userAnswerPart2, setUserAnswerPart2] = useState("");

    const [responseData, setResponseData] = useState(null);

    const [color, setColor] = useState("inherit");
    const [difficulty, setDifficulty] = useState("");
    const [isClicked, setIsClicked] = useState(false);

    const questionLoadTimeRef = useRef(null);

    const [aiSolution, setAiSolution] = useState("");
    const [loadingAiSolution, setLoadingAiSolution] = useState(false);
    const [errorAiSolution, setErrorAiSolution] = useState(null);

    const [eventSource, setEventSource] = useState(null);

    const aiSolutionRef = useRef(null);

    useEffect(() => {
        async function fetchQuestion() {
            try {
                const res = await axios.get(`${SERVER_URL}/questions/${questionId}`);
                setQuestion(res.data);
                setDifficulty(res.data.difficultyLevel);
                questionLoadTimeRef.current = Date.now();

                if (res.data.topicId) {
                    const topicRes = await axios.get(`${SERVER_URL}/topics/${res.data.topicId}`);
                    if (topicRes.data.parentId === 1 && topicRes.data.name === "Fractions") {
                        setAnswerPartOne("Numerator");
                        setAnswerPartTwo("Denominator");
                    } else if (topicRes.data.parentId === 3) {
                        setAnswerPartOne("Area");
                        switch (topicRes.data.name) {
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
                            default:
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

    useEffect(() => {
        if (responseData?.correct) setColor("green");
        else setColor("red");
    }, [responseData]);

    useEffect(() => {
        if (!isClicked) return;
        if (answerPartOne && answerPartTwo && userAnswerPart1 && userAnswerPart2) {
            if (answerPartOne === "Numerator" && answerPartTwo === "Denominator") {
                setUserAnswer(`${userAnswerPart1}/${userAnswerPart2}`);
            } else {
                setUserAnswer(`${userAnswerPart1}, ${userAnswerPart2}`);
            }
            setUserAnswerPart1("");
            setUserAnswerPart2("");
        }
    }, [isClicked, answerPartOne, answerPartTwo, userAnswerPart1, userAnswerPart2]);

    function isValidDouble(val) {
        return /^\d+(\.\d*)?$/.test(val);
    }
    function isFractions() {
        return (answerPartOne === "Numerator" && answerPartTwo === "Denominator");
    }
    function isOnlyDigitsMeansInteger(str) {
        return /^\d+$/.test(str);
    }

    const handleSubmitAnswer = async () => {
        if (!question) {
            alert(t('noQuestionLoaded'));
            return;
        }
        try {
            const token = localStorage.getItem("jwtToken");
            const endTime = Date.now();
            const timeTakenSeconds = Math.floor((endTime - questionLoadTimeRef.current) / 1000);

            let finalUserAnswer;
            if (userAnswer) {
                finalUserAnswer = userAnswer;
            } else if (isFractions()) {
                finalUserAnswer = `${userAnswerPart1}/${userAnswerPart2}`;
            } else {
                finalUserAnswer = `${userAnswerPart1},${userAnswerPart2}`;
            }

            await axios.post(
                `${SERVER_URL}/questions/submit`,
                {
                    questionId: question.id,
                    userAnswer: finalUserAnswer,
                    timeTakenSeconds
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedQ = await axios.get(`${SERVER_URL}/questions/${question.id}`);
            setResponseData(updatedQ.data);

            const prof = await axios.get(`${SERVER_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDifficulty(prof.data.currentDifficulty);

        } catch (err) {
            console.error("Error submitting answer:", err);
            alert(t('failedToSubmitAnswer'));
        }
    };

    function postProcessSpacing(text) {
        if (!text) return "";
        let result = text;
        result = result.replace(/([.,;!?])([^\s.,;!?])/g, "$1 $2");
        result = result.replace(/(#{1,6})(\d)/g, "$1 $2");
        result = result.replace(/\s{2,}/g, " ");

        return result.trim();
    }

    function smartAppend(prev, newChunk) {
        if (!prev) return newChunk;

        const lastChar = prev.slice(-1);
        const firstChar = newChunk[0] || "";
        const lastIsAlnum = /[a-zA-Z0-9]/.test(lastChar);
        const firstIsAlnum = /[a-zA-Z0-9]/.test(firstChar);

        if (lastIsAlnum && firstIsAlnum) {
            return prev + " " + newChunk;
        }
        return prev + newChunk;
    }

    const handleAskAiSolution = () => {
        if (!question) return;
        setErrorAiSolution(null);
        setLoadingAiSolution(true);
        setAiSolution("");

        if (eventSource) {
            eventSource.close();
        }

        const token = localStorage.getItem("jwtToken");
        const url = `${SERVER_URL}/ai/stream?question=${encodeURIComponent(question.questionText)}&token=${token}`;
        const es = new EventSource(url);
        setEventSource(es);

        let interimText = "";

        es.onopen = () => {
            console.log("SSE open for AI solution streaming");
        };

        es.onerror = (e) => {
            console.error("SSE error:", e);
            setErrorAiSolution(t('failedToGetAiSolution'));
            setLoadingAiSolution(false);
            es.close();
        };

        es.addEventListener("chunk", (e) => {
            interimText = smartAppend(interimText, e.data);
            setAiSolution(interimText);
        });

        es.addEventListener("done", () => {
            es.close();
            setLoadingAiSolution(false);

            const fixed = postProcessSpacing(interimText);
            setAiSolution(fixed);
        });
    };

    useEffect(() => {
        if (aiSolutionRef.current) {
            aiSolutionRef.current.scrollTop = aiSolutionRef.current.scrollHeight;
        }
    }, [aiSolution]);

    if (!question) {
        return (
            <Box sx={{ margin: 4 }}>
                <Typography>{t('loadingQuestionData')}</Typography>
                <Loading />
            </Box>
        );
    }

    const isCorrect = responseData?.correct === true;
    const correctAnswer = responseData?.correctAnswer || "";
    const solutionSteps = responseData?.solutionSteps || "";
    const displayedSteps = (i18n.language === 'he')
        ? translateSolutionSteps(solutionSteps, t)
        : solutionSteps;

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
                padding: 2,
            }}
        >
            <Typography sx={{ fontFamily: myFont, fontSize: 20, marginTop: 2, marginBottom: 2 }}>
                {t('currentDifficulty')}: {difficulty}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", wordSpacing: 15, fontFamily: myFont }}>
                <Typography sx={{ wordSpacing: 15, fontFamily: myFont }}>
                    {t('question')}: {t(question.questionText)}
                </Typography>
                <br/>
                <Typography sx={{ wordSpacing: 15, fontFamily: myFont }}>
                    {t('yourAnswer')}
                </Typography>
                <br/>

                {answerPartOne && answerPartTwo ? (
                    <>
                        <TextField
                            variant="standard"
                            placeholder={t(answerPartOne)}
                            value={userAnswerPart1}
                            onChange={(e) => {
                                e.target.style.fontFamily = myFont;
                                setUserAnswerPart1(e.target.value);
                            }}
                        />
                        <TextField
                            variant="standard"
                            placeholder={t(answerPartTwo)}
                            value={userAnswerPart2}
                            onChange={(e) => {
                                e.target.style.fontFamily = myFont;
                                setUserAnswerPart2(e.target.value);
                            }}
                        />
                    </>
                ) : (
                    <TextField
                        variant="standard"
                        placeholder={t('writeYourAnswerHere')}
                        value={userAnswer}
                        onChange={(e) => {
                            e.target.style.fontFamily = myFont;
                            setUserAnswer(e.target.value);
                        }}
                    />
                )}

                <br/><br/>
                <Button
                    variant="text"
                    sx={{ wordSpacing: 15, fontFamily: myFont, color: "black", fontSize: 25 }}
                    onClick={() => {
                        setIsClicked(true);
                        handleSubmitAnswer();
                    }}
                    disabled={
                        (!question) ||
                        (responseData !== null) ||
                        (
                            isFractions()
                                ? (
                                    (!isOnlyDigitsMeansInteger(userAnswerPart1) || !isOnlyDigitsMeansInteger(userAnswerPart2))
                                    || (userAnswerPart1.length === 0 && userAnswerPart2.length === 0)
                                )
                                : (answerPartOne && answerPartTwo)
                                    ? (
                                        (!isValidDouble(userAnswerPart1) || !isValidDouble(userAnswerPart2))
                                        || (userAnswerPart1.length === 0 && userAnswerPart2.length === 0)
                                    )
                                    : (userAnswer.length === 0)
                        )
                    }
                >
                    {t('submitAnswer')}
                </Button>

                <br/>
                {responseData && (
                    <Box>
                        <Typography sx={{ fontFamily: myFont, color }}>
                            {t('correct')}? : {isCorrect ? t('yes') : t('no')}
                        </Typography>
                        <br/>
                        <Accordion sx={{
                            bgcolor: 'transparent',
                            '& .MuiAccordionSummary-root': { bgcolor: 'transparent' },
                            '& .MuiAccordionDetails-root': { bgcolor: 'transparent' },
                            border: '2px solid #000000'
                        }}>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon/>}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <Typography sx={{ fontFamily: myFont }}>
                                    {t('seeStepsAndAnswer')}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography sx={{ fontFamily: myFont }}>
                                    {t('correctAnswer')}: {correctAnswer}
                                </Typography>
                                <br/>
                                <Typography sx={{ whiteSpace: "break-spaces", fontFamily: myFont }}>
                                    {t('solutionSteps')}:<br/><br/>{displayedSteps}
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
                                        const resp = await axios.post(
                                            `${SERVER_URL}/questions/generate`,
                                            { topicId: question.topicId ?? null, difficultyLevel: null },
                                            { headers: { Authorization: `Bearer ${token}` } }
                                        );
                                        setQuestion(resp.data);
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

                            <Button
                                variant="text"
                                onClick={handleAskAiSolution}
                                disabled={!question || loadingAiSolution}
                                sx={{ marginTop: 2 }}
                            >
                                {t('askAiSolution')}
                            </Button>

                            {loadingAiSolution && (
                                <Box sx={{ margin: 2 }}>
                                    <Loading/>
                                    <Typography>{t('loadingAiSolution')}</Typography>
                                </Box>
                            )}

                            {errorAiSolution && (
                                <Typography color="error">{errorAiSolution}</Typography>
                            )}

                            {aiSolution && (
                                <Box
                                    sx={{
                                        marginTop: 2,
                                        padding: 2,
                                        border: '1px solid #ccc',
                                        maxWidth: '700px',
                                        maxHeight: '300px',
                                        overflowX: 'hidden',
                                        overflowY: 'auto',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        backgroundColor: '#f9f9f9'
                                    }}
                                    ref={aiSolutionRef}
                                >
                                    <Typography variant="h6" sx={{ fontFamily: myFont }}>
                                        {t('alternativeSolutionFromAi')}
                                    </Typography>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {aiSolution}
                                    </ReactMarkdown>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default NoteBook;
