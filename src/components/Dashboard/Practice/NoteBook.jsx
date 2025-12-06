import { forwardRef, useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import PropTypes from 'prop-types';

// MUI Components
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    TextField,
    Typography,
    Paper,
    Stack,
    Chip,
    Fade,
    Divider,
    CircularProgress,
    Container
} from '@mui/material';
import MuiButton from '@mui/material/Button';
import { alpha } from '@mui/material/styles';

// Icons
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ReplyIcon from '@mui/icons-material/Reply';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Local Utilities & Components
import Loading from '../../Common/Loading.jsx';
import {
    GET_DIRECTION,
    PRACTICE_URL,
    SERVER_URL,
} from '../../../utils/Constants.js';
import { translateSolutionSteps } from '../../../utils/translateSolutionSteps.js';
import { formatFinalHebrewBlocks } from '../../../utils/hebrewSpacing.js';
import '../../../styles/Fonts.css';

// --- Helpers & Constants ---
const NOTEBOOK_FONT = 'Gloria Hallelujah';

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

function concatSmart(prev, next) {
    if (!prev) return next ?? '';
    if (!next) return prev;
    if (prev.endsWith('\r') && next.startsWith('\n')) return prev + next;
    return prev + next;
}

// **Fix #2:** Component defined OUTSIDE the render function to prevent focus loss
const HandWrittenTextField = ({ sx, ...props }) => (
    <TextField
        variant="standard"
        {...props}
        sx={{
            '& .MuiInputBase-input': {
                fontFamily: NOTEBOOK_FONT,
                fontSize: '1.5rem',
                textAlign: 'center',
                color: '#2c3e50',
            },
            '& .MuiInput-underline:before': { borderBottom: '2px dashed #95a5a6' },
            '& .MuiInput-underline:after': { borderBottom: '2px solid #2c3e50' },
            minWidth: 100,
            ...sx
        }}
    />
);

HandWrittenTextField.propTypes = {
    sx: PropTypes.object,
};

function NoteBook() {
    const { questionId } = useParams();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    // Data State
    const [question, setQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [answerPartOne, setAnswerPartOne] = useState('');
    const [answerPartTwo, setAnswerPartTwo] = useState('');
    const [userAnswerPart1, setUserAnswerPart1] = useState('');
    const [userAnswerPart2, setUserAnswerPart2] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [difficulty, setDifficulty] = useState('');

    // UI State
    const [isClicked, setIsClicked] = useState(false);
    const [answerLocked, setAnswerLocked] = useState(false);
    const [loadingAiSolution, setLoadingAiSolution] = useState(false);
    const [aiSolution, setAiSolution] = useState('');
    const [errorAiSolution, setErrorAiSolution] = useState(null);
    const [eventSource, setEventSource] = useState(null);

    const questionLoadTimeRef = useRef(null);
    const aiSolutionRef = useRef(null);
    const isAnswerLocked = answerLocked || !!responseData;

    const uiLang = i18n.language;
    const isHebrew = uiLang === 'he';
    const currentDir = useMemo(() => GET_DIRECTION(uiLang), [uiLang]);
    // Fix #1: Removed unused 'textAlign' variable

    // Grid Paper Background CSS Pattern
    const gridPaperSx = {
        bgcolor: '#ffffff',
        backgroundImage: `
            linear-gradient(#e1e1e1 1px, transparent 1px),
            linear-gradient(90deg, #e1e1e1 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
        backgroundPosition: 'center top',
        boxShadow: 4,
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            left: isHebrew ? 'auto' : 40,
            right: isHebrew ? 40 : 'auto',
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: '#f8a5c2', // The pink margin line
            opacity: 0.6,
            zIndex: 0
        }
    };

    // --- Effects ---

    useEffect(() => {
        if (!questionId) return;

        (async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/questions/${questionId}`, { withCredentials: true });
                setQuestion(res.data);
                setDifficulty(res.data.difficultyLevel);
                questionLoadTimeRef.current = Date.now();

                if (res.data.topicId) {
                    const { data: topic } = await axios.get(
                        `${SERVER_URL}/topics/${res.data.topicId}`, { withCredentials: true }
                    );

                    if (topic.parentId === 1 && topic.name === 'Fractions') {
                        setAnswerPartOne('Numerator');
                        setAnswerPartTwo('Denominator');
                    } else if (topic.parentId === 3) {
                        setAnswerPartOne('Area');
                        switch (topic.name) {
                            case 'Polygon': setAnswerPartOne('Polygon'); break;
                            case 'Rectangle': setAnswerPartTwo('Perimeter'); break;
                            case 'Triangle': setAnswerPartTwo('Hypotenuse'); break;
                            case 'Circle': setAnswerPartTwo('Circumference'); break;
                            default: break;
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching question:', err);
            }
        })();
    }, [questionId]);

    // Construct composite answer for fractions/geometry
    useEffect(() => {
        if (!isClicked) return;
        if (answerPartOne && answerPartTwo && userAnswerPart1 && userAnswerPart2) {
            setUserAnswer(
                answerPartOne === 'Numerator'
                    ? `${userAnswerPart1}/${userAnswerPart2}`
                    : `${userAnswerPart1}, ${userAnswerPart2}`
            );
        }
    }, [isClicked, answerPartOne, answerPartTwo, userAnswerPart1, userAnswerPart2]);

    const isFractionMode = answerPartOne === 'Numerator' && answerPartTwo === 'Denominator';

    const handleSubmitAnswer = async () => {
        if (!question) return;
        setAnswerLocked(true);
        try {
            const timeTakenSeconds = Math.floor((Date.now() - questionLoadTimeRef.current) / 1000);
            const finalUserAnswer = userAnswer || (isFractionMode
                ? `${userAnswerPart1}/${userAnswerPart2}`
                : `${userAnswerPart1},${userAnswerPart2}`);

            const { data } = await axios.post(`${SERVER_URL}/questions/submit`, {
                questionId: question.id,
                userAnswer: finalUserAnswer,
                timeTakenSeconds,
            }, { withCredentials: true });

            setResponseData(data);
        } catch (err) {
            console.error('Error submitting answer:', err);
            setAnswerLocked(false);
        }
    };

    const handleAskAiSolution = () => {
        if (!question) return;
        setErrorAiSolution(null);
        setLoadingAiSolution(true);
        setAiSolution('');
        eventSource?.close();

        const qText = question?.questionText || '';
        const url = `${SERVER_URL}/ai/stream?question=${encodeURIComponent(qText)}&lang=${encodeURIComponent(uiLang)}`;
        const es = new EventSource(url, { withCredentials: true });
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

    // Auto-scroll AI solution
    useEffect(() => {
        aiSolutionRef.current?.scrollTo(0, aiSolutionRef.current.scrollHeight);
    }, [aiSolution]);

    if (!question) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>{t('loadingQuestionData')}</Typography>
                <Loading />
            </Box>
        );
    }

    // Format text for rendering
    const questionText = question?.questionText || '';
    const displayedQuestion = formatFinalHebrewBlocks(
        isHebrew && questionText ? translateSolutionSteps(questionText, t) : questionText,
        uiLang
    );
    const displayedSteps = formatFinalHebrewBlocks(
        isHebrew && responseData?.solutionSteps ? translateSolutionSteps(responseData.solutionSteps, t) : responseData?.solutionSteps || '',
        uiLang
    );
    const displayedAiSolution = formatFinalHebrewBlocks(
        isHebrew && aiSolution ? translateSolutionSteps(aiSolution, t) : aiSolution || '',
        uiLang
    );
    const displayedCorrectAnswer = formatFinalHebrewBlocks(
        isHebrew && responseData?.correctAnswer ? translateSolutionSteps(responseData.correctAnswer, t) : responseData?.correctAnswer || '',
        uiLang
    );

    const isCorrect = responseData?.correct === true;

    return (
        <Fade in={true} timeout={500}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Chip
                        label={`${t('difficulty')}: ${t(difficulty || 'BASIC')}`}
                        color={
                            difficulty === 'ADVANCED' ? 'error' :
                                difficulty === 'MEDIUM' ? 'warning' : 'success'
                        }
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                <Paper elevation={4} sx={gridPaperSx}>
                    <Box sx={{ p: { xs: 3, md: 6 }, minHeight: '60vh', position: 'relative', zIndex: 1 }}>

                        {/* 1. Header & Question */}
                        <Typography
                            variant="h4"
                            component="div"
                            dir={currentDir}
                            sx={{
                                fontFamily: NOTEBOOK_FONT,
                                mb: 4,
                                lineHeight: 1.6,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}
                        >
                            {displayedQuestion}
                        </Typography>

                        {/* 2. Input Area */}
                        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                {t('yourAnswer')}
                            </Typography>

                            {answerPartOne && answerPartTwo ? (
                                isFractionMode ? (
                                    // Fraction Layout
                                    <Stack alignItems="center" spacing={0.5} sx={{ display: 'inline-flex' }}>
                                        <HandWrittenTextField
                                            placeholder={t(String(answerPartOne).toLowerCase())}
                                            value={userAnswerPart1}
                                            onChange={(e) => setUserAnswerPart1(e.target.value)}
                                            disabled={isAnswerLocked}
                                            inputProps={{ inputMode: 'numeric' }}
                                        />
                                        <Divider sx={{ width: '100%', borderBottomWidth: 3, borderColor: '#2c3e50' }} />
                                        <HandWrittenTextField
                                            placeholder={t(String(answerPartTwo).toLowerCase())}
                                            value={userAnswerPart2}
                                            onChange={(e) => setUserAnswerPart2(e.target.value)}
                                            disabled={isAnswerLocked}
                                            inputProps={{ inputMode: 'numeric' }}
                                        />
                                    </Stack>
                                ) : (
                                    // Two Parts (Geometry) Layout
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center">
                                        <HandWrittenTextField
                                            label={t(String(answerPartOne).toLowerCase())}
                                            value={userAnswerPart1}
                                            onChange={(e) => setUserAnswerPart1(e.target.value)}
                                            disabled={isAnswerLocked}
                                            sx={{ mt: 2 }}
                                        />
                                        <HandWrittenTextField
                                            label={t(String(answerPartTwo).toLowerCase())}
                                            value={userAnswerPart2}
                                            onChange={(e) => setUserAnswerPart2(e.target.value)}
                                            disabled={isAnswerLocked}
                                            sx={{ mt: 2 }}
                                        />
                                    </Stack>
                                )
                            ) : (
                                // Standard Single Input
                                <HandWrittenTextField
                                    placeholder={t('writeYourAnswerHere')}
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    disabled={isAnswerLocked}
                                    fullWidth
                                    sx={{ maxWidth: 400 }}
                                />
                            )}
                        </Box>

                        {/* 3. Action Buttons */}
                        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                            {!responseData ? (
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<SendIcon />}
                                    onClick={async () => {
                                        setIsClicked(true);
                                        await handleSubmitAnswer();
                                    }}
                                    disabled={
                                        !question || isAnswerLocked ||
                                        (isFractionMode
                                            ? (!userAnswerPart1 && !userAnswerPart2)
                                            : answerPartOne && answerPartTwo
                                                ? (!userAnswerPart1 && !userAnswerPart2)
                                                : userAnswer.length === 0)
                                    }
                                >
                                    {t('submitAnswer')}
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        startIcon={<ReplyIcon />}
                                        onClick={() => navigate(PRACTICE_URL)}
                                    >
                                        {t('changeSubject')}
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        endIcon={<NavigateNextIcon />}
                                        onClick={async () => {
                                            // Reset State
                                            setIsClicked(false);
                                            setUserAnswer('');
                                            setUserAnswerPart1('');
                                            setUserAnswerPart2('');
                                            setResponseData(null);
                                            setAnswerLocked(false);
                                            setAiSolution('');
                                            setErrorAiSolution(null);
                                            setLoadingAiSolution(false);
                                            if (eventSource) {
                                                eventSource.close();
                                                setEventSource(null);
                                            }

                                            // Generate Next
                                            try {
                                                const { data } = await axios.post(`${SERVER_URL}/questions/generate`, {
                                                    topicId: question?.topicId ?? null,
                                                }, { withCredentials: true });
                                                setQuestion(data);
                                                setDifficulty(data.difficultyLevel);
                                                navigate(`/practice/${data.id}`);
                                            } catch (err) {
                                                console.error('Failed to get next question:', err);
                                            }
                                        }}
                                    >
                                        {t('nextQuestion')}
                                    </Button>
                                </>
                            )}
                        </Stack>

                        {/* 4. Feedback & Solution Area */}
                        {responseData && (
                            <Box sx={{ mt: 5 }} dir={currentDir}>
                                {/* Result Banner */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        mb: 3,
                                        borderRadius: 2,
                                        bgcolor: isCorrect ? alpha('#2e7d32', 0.1) : alpha('#d32f2f', 0.1),
                                        border: '1px solid',
                                        borderColor: isCorrect ? '#2e7d32' : '#d32f2f',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}
                                >
                                    {isCorrect ? <CheckCircleOutlineIcon color="success" fontSize="large" /> : <ErrorOutlineIcon color="error" fontSize="large" />}
                                    <Box>
                                        <Typography variant="h6" color={isCorrect ? 'success.main' : 'error.main'} sx={{ fontWeight: 'bold' }}>
                                            {isCorrect ? t('yes') + '! ' + t('correct') : t('no') + '...'}
                                        </Typography>
                                        {displayedCorrectAnswer && (
                                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                                                {displayedCorrectAnswer}
                                            </Typography>
                                        )}
                                    </Box>
                                </Paper>

                                {/* Steps Accordion */}
                                <Accordion
                                    defaultExpanded
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.8)',
                                        boxShadow: 'none',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px !important',
                                        '&:before': { display: 'none' }
                                    }}
                                >
                                    <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {t('solutionSteps')}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ textAlign: 'start' }}>
                                        <Box sx={{ fontFamily: NOTEBOOK_FONT, fontSize: '1.1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                                                {displayedSteps}
                                            </ReactMarkdown>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>

                                {/* AI Button & Output */}
                                <Box sx={{ mt: 4 }}>
                                    {!loadingAiSolution && !aiSolution && (
                                        <Button
                                            startIcon={<AutoAwesomeIcon />}
                                            onClick={handleAskAiSolution}
                                            color="secondary"
                                            disabled={loadingAiSolution}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            {t('askAiSolution')}
                                        </Button>
                                    )}

                                    {loadingAiSolution && (
                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                                            <CircularProgress size={20} />
                                            <Typography variant="body2">{t('loadingAiSolution')}</Typography>
                                        </Stack>
                                    )}

                                    {errorAiSolution && (
                                        <Typography color="error" sx={{ mt: 2 }}>{errorAiSolution}</Typography>
                                    )}

                                    {aiSolution && (
                                        <Paper
                                            elevation={2}
                                            ref={aiSolutionRef}
                                            sx={{
                                                mt: 2,
                                                p: 3,
                                                bgcolor: '#f3e5f5', // Slight purple tint for AI
                                                borderLeft: '4px solid #9c27b0',
                                                borderRadius: 2,
                                                // Fix #3: Removed fixed height/overflow to allow natural scrolling
                                            }}
                                        >
                                            <Typography variant="subtitle2" color="secondary" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AutoAwesomeIcon fontSize="small" /> {t('alternativeSolutionFromAi')}
                                            </Typography>
                                            <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
                                                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                                                    {displayedAiSolution}
                                                </ReactMarkdown>
                                            </Box>
                                        </Paper>
                                    )}
                                </Box>
                            </Box>
                        )}

                    </Box>
                </Paper>
            </Container>
        </Fade>
    );
}

export default NoteBook;