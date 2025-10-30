import {forwardRef, useEffect, useRef, useState} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../../../styles/Fonts.css';
import {
    GET_DIRECTION,
    PRACTICE_URL,
    SERVER_URL,
} from '../../../utils/Constants.js';
import Loading from '../../Common/Loading.jsx';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {useTranslation} from 'react-i18next';
import {translateSolutionSteps} from '../../../utils/translateSolutionSteps.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import MuiButton from '@mui/material/Button';

const coerceDisabled = (value) => {
    if (typeof value === 'object') {
        return value ? Object.keys(value).length > 0 : false;
    }
    return !!value;
};

const Button = forwardRef(function Button(props, ref) {
    // eslint-disable-next-line react/prop-types
    const { disabled, ...rest } = props;
    return <MuiButton ref={ref} disabled={coerceDisabled(disabled)} {...rest} />;
});

const concatSmart = (prev, next) => {
    if (!prev) return next;
    const last = prev.at(-1);
    const first = next[0] || '';
    if (/\s/.test(last) || /\s/.test(first)) return prev + next;
    if (/[.,;:!?()[\]{}"'`]/.test(last) || /[.,;:!?()[\]{}"'`]/.test(first))
        return prev + next;
    const isAlnum = (c) => /[A-Za-z0-9]/.test(c);
    if (isAlnum(last) && isAlnum(first)) {
        if (/\d/.test(last) && /\d/.test(first)) return prev + next;
        return prev + ' ' + next;
    }
    return prev + next;
};

function NoteBook() {
    const {questionId} = useParams();
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const myFont = 'Gloria Hallelujah';

    const [question, setQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [answerPartOne, setAnswerPartOne] = useState('');
    const [answerPartTwo, setAnswerPartTwo] = useState('');
    const [userAnswerPart1, setUserAnswerPart1] = useState('');
    const [userAnswerPart2, setUserAnswerPart2] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [color, setColor] = useState('inherit');
    const [difficulty, setDifficulty] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [aiSolution, setAiSolution] = useState('');
    const [loadingAiSolution, setLoadingAiSolution] = useState(false);
    const [errorAiSolution, setErrorAiSolution] = useState(null);
    const [eventSource, setEventSource] = useState(null);

    const questionLoadTimeRef = useRef(null);
    const aiSolutionRef = useRef(null);

    const currentDir = GET_DIRECTION(i18n.language);
    const isHebrew = i18n.language === 'he';
    const textAlign = isHebrew ? 'right' : 'left';
    const translatedDifficulty = t(difficulty || 'BASIC');

    const inputPropsDir = {
        dir: currentDir,
        style: {textAlign},
    };

    useEffect(() => {
        if (!questionId) return;

        (async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/questions/${questionId}`);
                setQuestion(res.data);
                setDifficulty(res.data.difficultyLevel);
                questionLoadTimeRef.current = Date.now();

                if (res.data.topicId) {
                    const {data: topic} = await axios.get(
                        `${SERVER_URL}/topics/${res.data.topicId}`
                    );

                    if (topic.parentId === 1 && topic.name === 'Fractions') {
                        setAnswerPartOne('Numerator');
                        setAnswerPartTwo('Denominator');
                    } else if (topic.parentId === 3) {
                        setAnswerPartOne('Area');
                        switch (topic.name) {
                            case 'Polygon':
                                setAnswerPartOne('Polygon');
                                break;
                            case 'Rectangle':
                                setAnswerPartTwo('Perimeter');
                                break;
                            case 'Triangle':
                                setAnswerPartTwo('Hypotenuse');
                                break;
                            case 'Circle':
                                setAnswerPartTwo('Circumference');
                                break;
                            default:
                                break;
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching question:', err);
            }
        })();
    }, [questionId]);

    useEffect(() => {
        setColor(responseData?.correct ? 'green' : 'red');
    }, [responseData]);

    useEffect(() => {
        if (!isClicked) return;
        if (answerPartOne && answerPartTwo && userAnswerPart1 && userAnswerPart2) {
            setUserAnswer(
                answerPartOne === 'Numerator'
                    ? `${userAnswerPart1}/${userAnswerPart2}`
                    : `${userAnswerPart1}, ${userAnswerPart2}`
            );
            setUserAnswerPart1('');
            setUserAnswerPart2('');
        }
    }, [isClicked, answerPartOne, answerPartTwo, userAnswerPart1, userAnswerPart2]);

    const isValidDouble = (v) => /^\d+(\.\d*)?$/.test(v);
    const isOnlyDigits = (v) => /^\d+$/.test(v);
    const isFractionMode =
        answerPartOne === 'Numerator' && answerPartTwo === 'Denominator';

    const handleSubmitAnswer = async () => {
        if (!question) return;

        try {
            const timeTakenSeconds = Math.floor(
                (Date.now() - questionLoadTimeRef.current) / 1000
            );

            const finalUserAnswer =
                userAnswer ||
                (isFractionMode
                    ? `${userAnswerPart1}/${userAnswerPart2}`
                    : `${userAnswerPart1},${userAnswerPart2}`);

            const {data} = await axios.post(`${SERVER_URL}/questions/submit`, {
                questionId: question.id,
                userAnswer: finalUserAnswer,
                timeTakenSeconds,
            });
            setResponseData(data);

            // Removed /profile fetch; the next loaded question will carry its difficulty
        } catch (err) {
            console.error('Error submitting answer:', err);
            alert(t('failedToSubmitAnswer'));
        }
    };

    const handleAskAiSolution = () => {
        if (!question) return;
        setErrorAiSolution(null);
        setLoadingAiSolution(true);
        setAiSolution('');
        eventSource?.close();

        const url = `${SERVER_URL}/ai/stream?question=${encodeURIComponent(question.questionText)}`;
        const es = new EventSource(url, { withCredentials: true });
        setEventSource(es);

        let finished = false;
        let buf = '';

        const onChunk = (e) => {
            buf = concatSmart(buf, e.data);
            setAiSolution(buf);
        };

        const onStatus = (e) => {
            setAiSolution(prev => (prev ? `${prev}\n${e.data}` : e.data));
        };

        const onDone = () => {
            finished = true;
            es.removeEventListener('error', onError);
            es.close();
            setLoadingAiSolution(false);
            setAiSolution(buf.trim());
        };

        const onError = () => {
            if (finished) return;
            es.close();
            setLoadingAiSolution(false);
            setErrorAiSolution(t('failedToGetAiSolution'));
        };

        es.addEventListener('chunk', onChunk);
        es.addEventListener('status', onStatus);
        es.addEventListener('done', onDone);
        es.addEventListener('error', onError);
    };

    useEffect(() => {
        aiSolutionRef.current?.scrollTo(0, aiSolutionRef.current.scrollHeight);
    }, [aiSolution]);

    if (!question) {
        return (
            <Box sx={{m: 4}}>
                <Typography>{t('loadingQuestionData')}</Typography>
                <Loading/>
            </Box>
        );
    }

    const isCorrect = responseData?.correct === true;
    const displayedSteps = isHebrew
        ? translateSolutionSteps(responseData?.solutionSteps || '', t)
        : responseData?.solutionSteps || '';

    return (
        <Box
            className={`container ${i18n.language === 'he' ? 'rtl-notebook' : ''}`}
            dir={GET_DIRECTION(i18n.language)}
            sx={{
                position: 'absolute',
                width: '95%',
                height: '95%',
                mt: 3,
                mb: 3,
                p: 2,
            }}
        >

            <Typography
                sx={{
                    fontFamily: myFont,
                    fontSize: 20,
                    mt: 2,
                    mb: 2,
                    width: '100%',
                    textAlign: 'start',
                }}
            >
                {t('currentDifficulty')}: {translatedDifficulty}
            </Typography>

            <Box sx={{display: 'flex', flexDirection: 'column', fontFamily: myFont, width: '100%'}}>
                <Typography sx={{width: '100%', textAlign: 'start'}}>
                    {t('question')}: {t(question.questionText)}
                </Typography>

                <Typography sx={{mt: 2, textAlign: 'start'}}>{t('yourAnswer')}</Typography>

                <Box sx={{mt: 1}}>
                    {answerPartOne && answerPartTwo ? (
                        <>
                            <TextField
                                variant="standard"
                                placeholder={t(answerPartOne)}
                                value={userAnswerPart1}
                                inputProps={inputPropsDir}
                                onChange={(e) => setUserAnswerPart1(e.target.value)}
                            />
                            <TextField
                                variant="standard"
                                placeholder={t(answerPartTwo)}
                                value={userAnswerPart2}
                                inputProps={inputPropsDir}
                                onChange={(e) => setUserAnswerPart2(e.target.value)}
                            />
                        </>
                    ) : (
                        <TextField
                            variant="standard"
                            placeholder={t('writeYourAnswerHere')}
                            value={userAnswer}
                            fullWidth
                            inputProps={inputPropsDir}
                            onChange={(e) => setUserAnswer(e.target.value)}
                        />
                    )}
                </Box>

                <Button
                    variant="text"
                    sx={{
                        mt: 3,
                        fontFamily: myFont,
                        color: 'black',
                        fontSize: 25,
                        alignSelf: 'center',
                    }}
                    onClick={() => {
                        setIsClicked(true);
                        handleSubmitAnswer();
                    }}
                    disabled={
                        !question ||
                        responseData ||
                        (isFractionMode
                            ? (!isOnlyDigits(userAnswerPart1) ||
                                !isOnlyDigits(userAnswerPart2) ||
                                (!userAnswerPart1 && !userAnswerPart2))
                            : answerPartOne && answerPartTwo
                                ? (!isValidDouble(userAnswerPart1) ||
                                    !isValidDouble(userAnswerPart2) ||
                                    (!userAnswerPart1 && !userAnswerPart2))
                                : userAnswer.length === 0)
                    }
                >
                    {t('submitAnswer')}
                </Button>

                {responseData && (
                    <Box sx={{mt: 4}}>
                        <Typography sx={{fontFamily: myFont, color, textAlign: 'start'}}>
                            {t('correct')}? : {isCorrect ? t('yes') : t('no')}
                        </Typography>

                        <Accordion
                            sx={{mt: 2, bgcolor: 'transparent', border: '2px solid #000'}}
                        >
                            <AccordionSummary expandIcon={<ArrowDropDownIcon/>}>
                                <Typography sx={{fontFamily: myFont}}>
                                    {t('seeStepsAndAnswer')}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails dir={currentDir}>
                                <Typography sx={{fontFamily: myFont}}>
                                    {t('correctAnswer')}: {responseData.correctAnswer}
                                </Typography>
                                <Typography
                                    sx={{whiteSpace: 'break-spaces', mt: 2, fontFamily: myFont}}
                                >
                                    {t('solutionSteps')}:
                                    <br/>
                                    <br/>
                                    {displayedSteps}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: currentDir === 'rtl' ? 'row' : 'row-reverse',
                                justifyContent: 'center',
                                gap: 15,
                                mt: 2,
                            }}
                        >
                            <Button
                                sx={{fontFamily: myFont, color: 'black', fontSize: 25}}
                                onClick={async () => {
                                    try {
                                        setIsClicked(false);
                                        setUserAnswer('');
                                        setResponseData(null);
                                        const {data} = await axios.post(`${SERVER_URL}/questions/generate`, {
                                            topicId: question?.topicId ?? null
                                        });
                                        setQuestion(data);
                                        setDifficulty(data.difficultyLevel);
                                        // keep URL in sync with the new question
                                        navigate(`/practice/${data.id}`);
                                    } catch (err) {
                                        console.error('Failed to get next question:', err);
                                    }
                                }}
                            >
                                {t('nextQuestion')}
                            </Button>

                            <Button
                                sx={{fontFamily: myFont, color: 'black', fontSize: 25}}
                                onClick={() => navigate(PRACTICE_URL)}
                            >
                                {t('changeSubject')}
                            </Button>

                            <Button
                                variant="text"
                                onClick={handleAskAiSolution}
                                disabled={!question || loadingAiSolution}
                                sx={{fontFamily: myFont, color: 'black', fontSize: 25}}
                            >
                                {t('askAiSolution')}
                            </Button>
                        </Box>

                        {loadingAiSolution && (
                            <Box sx={{mt: 2}}>
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
                                    mt: 2,
                                    p: 2,
                                    border: '1px solid #ccc',
                                    maxWidth: 700,
                                    maxHeight: 300,
                                    overflowX: 'hidden',
                                    overflowY: 'auto',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    backgroundColor: '#f9f9f9',
                                }}
                                ref={aiSolutionRef}
                                dir={currentDir}
                            >
                                <Typography variant="h6" sx={{fontFamily: myFont}}>
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
                )}
            </Box>
        </Box>
    );
}

export default NoteBook;
