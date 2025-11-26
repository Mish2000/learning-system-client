import {forwardRef, useEffect, useRef, useState, useMemo} from 'react';
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
import {formatFinalHebrewBlocks} from '../../../utils/hebrewSpacing.js';
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
    const {disabled, ...rest} = props;
    return <MuiButton ref={ref} disabled={coerceDisabled(disabled)} {...rest} />;
});

function concatSmart(prev, next) {
    if (!prev) return next ?? '';
    if (!next) return prev;
    if (prev.endsWith('\r') && next.startsWith('\n')) return prev + next;
    return prev + next;
}

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
    const [answerLocked, setAnswerLocked] = useState(false);
    const isAnswerLocked = answerLocked || !!responseData;

    const questionLoadTimeRef = useRef(null);
    const aiSolutionRef = useRef(null);

    const uiLang = i18n.language;
    const isHebrew = uiLang === 'he';
    const currentDir = useMemo(() => GET_DIRECTION(uiLang), [uiLang]);
    const textAlign = isHebrew ? 'right' : 'left';
    const translatedDifficulty = t(difficulty || 'BASIC');

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

    const isFractionMode =
        answerPartOne === 'Numerator' && answerPartTwo === 'Denominator';

    const handleSubmitAnswer = async () => {
        if (!question) return;

        setAnswerLocked(true);

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
        } catch (err) {
            console.error('Error submitting answer:', err);
            alert(t('failedToSubmitAnswer'));

            setAnswerLocked(false);
        }
    };

    const handleAskAiSolution = () => {
        if (!question) return;
        setErrorAiSolution(null);
        setLoadingAiSolution(true);
        setAiSolution('');
        eventSource?.close();

        const questionText = question?.questionText || '';

        const url =
            `${SERVER_URL}/ai/stream?question=${encodeURIComponent(
                questionText
            )}&lang=${encodeURIComponent(uiLang)}`;
        const es = new EventSource(url, {withCredentials: true});
        setEventSource(es);

        let finished = false;
        let buf = '';

        const onChunk = (e) => {
            let piece;
            try {
                const parsed = JSON.parse(e.data);
                piece = typeof parsed === 'string' ? parsed : parsed?.t ?? '';
            } catch {
                piece = e.data ?? '';
            }
            buf = concatSmart(buf, piece);
            setAiSolution(buf);
        };

        const onStatus = (e) => {
            setAiSolution((prev) => (prev ? `${prev}\n${e.data}` : e.data));
        };

        const onDone = () => {
            finished = true;
            es.removeEventListener('error', onError);
            es.close();
            setLoadingAiSolution(false);
            setAiSolution(buf);
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

    const questionText = question?.questionText || '';

    const displayedQuestion = formatFinalHebrewBlocks(
        isHebrew && questionText
            ? translateSolutionSteps(questionText, t)
            : questionText,
        uiLang
    );

    const displayedSteps = formatFinalHebrewBlocks(
        isHebrew && responseData?.solutionSteps
            ? translateSolutionSteps(responseData.solutionSteps, t)
            : responseData?.solutionSteps || '',
        uiLang
    );

    const displayedAiSolution = formatFinalHebrewBlocks(
        isHebrew && aiSolution
            ? translateSolutionSteps(aiSolution, t)
            : aiSolution || '',
        uiLang
    );

    const displayedCorrectAnswer = formatFinalHebrewBlocks(
        isHebrew && responseData?.correctAnswer
            ? translateSolutionSteps(responseData.correctAnswer, t)
            : responseData?.correctAnswer || '',
        uiLang
    );

    return (
        <Box
            className={`container ${isHebrew ? 'rtl-notebook' : ''}`}
            dir={currentDir}
            sx={{
                position: 'absolute',
                width: '95%',
                height: '95%',
                mt: 3,
                mb: 3,
                p: 2,
                overflowY: 'scroll',
                border: '1px solid #ccc',
                bgcolor: '#fafafa',
                '&::-webkit-scrollbar': {width: '0.4em'},
                '&::-webkit-scrollbar-thumb': {backgroundColor: 'rgba(0,0,0,.1)'},
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexGrow: 1,
                    overflow: 'hidden',
                }}
            >
                <Typography variant="h4" sx={{fontFamily: myFont, mb: 2}}>
                    {t('notebook')}
                </Typography>

                <Typography
                    sx={{
                        fontFamily: myFont,
                        mb: 1,
                        fontSize: 18,
                        alignSelf: 'flex-start',
                    }}
                >
                    {t('difficulty')}: {translatedDifficulty}
                </Typography>

                <Box
                    sx={{
                        flexGrow: 1,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'transparent',
                        borderRadius: 2,
                        p: 2,
                        boxShadow: 1,
                        overflow: 'hidden',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: myFont,
                            fontSize: 22,
                            mb: 2,
                            textAlign: 'start',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                    >
                        {displayedQuestion}
                    </Typography>

                    {/* Removed "answerSelection" label as requested */}

                    <Typography sx={{mt: 2, textAlign: 'start'}}>
                        {t('yourAnswer')}
                    </Typography>

                    <Box sx={{mt: 1}}>
                        {answerPartOne && answerPartTwo ? (
                            <>
                                <TextField
                                    variant="standard"
                                    placeholder={t(
                                        String(answerPartOne).toLowerCase()
                                    )}
                                    value={userAnswerPart1}
                                    onChange={(e) => setUserAnswerPart1(e.target.value)}
                                    disabled={isAnswerLocked}
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            textAlign,
                                        },
                                    }}
                                />
                                <TextField
                                    variant="standard"
                                    placeholder={t(
                                        String(answerPartTwo).toLowerCase()
                                    )}
                                    value={userAnswerPart2}
                                    onChange={(e) => setUserAnswerPart2(e.target.value)}
                                    disabled={isAnswerLocked}
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            textAlign,
                                        },
                                    }}
                                />
                            </>
                        ) : (
                            <TextField
                                variant="standard"
                                placeholder={t('writeYourAnswerHere')}
                                value={userAnswer}
                                fullWidth
                                onChange={(e) => setUserAnswer(e.target.value)}
                                disabled={isAnswerLocked}
                                sx={{
                                    '& .MuiInputBase-input': {
                                        textAlign,
                                    },
                                }}
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
                        onClick={async () => {
                            setIsClicked(true);
                            await handleSubmitAnswer();
                        }}
                        disabled={
                            !question ||
                            isAnswerLocked ||
                            (isFractionMode
                                ? (!/^\d+$/.test(userAnswerPart1) ||
                                    !/^\d+$/.test(userAnswerPart2) ||
                                    (!userAnswerPart1 && !userAnswerPart2))
                                : answerPartOne && answerPartTwo
                                    ? (!/^\d+(\.\d*)?$/.test(userAnswerPart1) ||
                                        !/^\d+(\.\d*)?$/.test(userAnswerPart2) ||
                                        (!userAnswerPart1 && !userAnswerPart2))
                                    : userAnswer.length === 0)
                        }
                    >
                        {t('submitAnswer')}
                    </Button>

                    {responseData && (
                        <Box sx={{mt: 4}}>
                            <Typography
                                sx={{fontFamily: myFont, color, textAlign: 'start'}}
                            >
                                {t('correct')}? : {isCorrect ? t('yes') : t('no')}
                            </Typography>

                            <Accordion
                                sx={{mt: 2, bgcolor: 'transparent', border: '2px solid #000'}}
                            >
                                <AccordionSummary expandIcon={<ArrowDropDownIcon/>}>
                                    <Typography sx={{fontFamily: myFont}}>
                                        {t('solutionSteps')}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails dir={currentDir}>
                                    <Box
                                        sx={{
                                            fontFamily: myFont,
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            textAlign: 'start',
                                        }}
                                    >
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                        >
                                            {displayedSteps}
                                        </ReactMarkdown>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>

                            {/* Removed labels "yourAnswerWas" and "correctAnswerIs" –
                                we keep the values only to avoid raw i18n keys in UI */}
                            {responseData.userAnswer && (
                                <Typography
                                    sx={{
                                        mt: 2,
                                        fontFamily: myFont,
                                        textAlign: 'start',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {responseData.userAnswer}
                                </Typography>
                            )}

                            {displayedCorrectAnswer && (
                                <Typography
                                    sx={{
                                        mt: 1,
                                        fontFamily: myFont,
                                        textAlign: 'start',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {displayedCorrectAnswer}
                                </Typography>
                            )}

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection:
                                        currentDir === 'rtl' ? 'row' : 'row-reverse',
                                    justifyContent: 'center',
                                    gap: 15,
                                    mt: 2,
                                }}
                            >
                                <Button
                                    sx={{
                                        fontFamily: myFont,
                                        color: 'black',
                                        fontSize: 25,
                                    }}
                                    onClick={async () => {
                                        try {
                                            // Reset user answer and submission state
                                            setIsClicked(false);
                                            setUserAnswer('');
                                            setUserAnswerPart1('');
                                            setUserAnswerPart2('');
                                            setResponseData(null);
                                            setAnswerLocked(false);

                                            // Reset AI alternative solution state
                                            setAiSolution('');
                                            setErrorAiSolution(null);
                                            setLoadingAiSolution(false);
                                            if (eventSource) {
                                                eventSource.close();
                                                setEventSource(null);
                                            }

                                            // Generate the next question with the same topic (if available)
                                            const {data} = await axios.post(
                                                `${SERVER_URL}/questions/generate`,
                                                {
                                                    topicId: question?.topicId ?? null,
                                                }
                                            );

                                            setQuestion(data);
                                            setDifficulty(data.difficultyLevel);
                                            // keep URL in sync with the new question
                                            navigate(`/practice/${data.id}`);
                                        } catch (err) {
                                            console.error(
                                                'Failed to get next question:',
                                                err
                                            );
                                        }
                                    }}
                                >
                                    {t('nextQuestion')}
                                </Button>

                                <Button
                                    sx={{
                                        fontFamily: myFont,
                                        color: 'black',
                                        fontSize: 25,
                                    }}
                                    onClick={() => navigate(PRACTICE_URL)}
                                >
                                    {t('changeSubject')}
                                </Button>

                                <Button
                                    variant="text"
                                    onClick={handleAskAiSolution}
                                    disabled={!question || loadingAiSolution}
                                    sx={{
                                        fontFamily: myFont,
                                        color: 'black',
                                        fontSize: 25,
                                    }}
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
                                <Typography color="error">
                                    {errorAiSolution}
                                </Typography>
                            )}

                            {aiSolution && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid #ccc',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        backgroundColor: '#f9f9f9', // keep AI answer frame design
                                    }}
                                    ref={aiSolutionRef}
                                    dir={currentDir}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{fontFamily: myFont}}
                                    >
                                        {t('alternativeSolutionFromAi')}
                                    </Typography>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {displayedAiSolution}
                                    </ReactMarkdown>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default NoteBook;
