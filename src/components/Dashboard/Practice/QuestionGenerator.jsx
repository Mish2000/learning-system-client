import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
    Box,
    Grid,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Stack,
    Paper,
    Fade
} from "@mui/material";
// Icons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import CategoryIcon from '@mui/icons-material/Category';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { PRACTICE_URL, SERVER_URL } from "../../../utils/Constants.js";

function QuestionGenerator({ onQuestionGenerated }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [parentTopics, setParentTopics] = useState([]);
    const [subTopics, setSubTopics] = useState([]);
    const [selectedParent, setSelectedParent] = useState('');
    const [selectedSubtopic, setSelectedSubtopic] = useState('');
    const [isGeometry, setIsGeometry] = useState(false);
    const [isAdmin] = useState(localStorage.getItem('role') === 'ADMIN');

    useEffect(() => {
        fetchParents();
    }, []);

    const fetchParents = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/topics`, { withCredentials: true });
            setParentTopics(response.data);
        } catch (error) {
            console.error('Failed to fetch parent topics', error);
        }
    };

    const fetchSubTopics = async (parentId) => {
        if (!parentId) {
            setSubTopics([]);
            setSelectedSubtopic('');
            return;
        }
        try {
            const response = await axios.get(
                `${SERVER_URL}/topics`,
                { params: { parentId }, withCredentials: true }
            );
            setSubTopics(response.data);
            setSelectedSubtopic(''); // Reset subtopic when parent changes
        } catch (error) {
            console.error('Failed to fetch subtopics', error);
        }
    };

    useEffect(() => {
        fetchSubTopics(selectedParent);
    }, [selectedParent]);

    const handleParentSelect = (parentId) => {
        setSelectedParent(parentId);
        const chosenTopic = parentTopics.find((topic) => topic.id === parentId);
        if (chosenTopic && chosenTopic.name.toLowerCase() === 'geometry') {
            setIsGeometry(true);
        } else {
            setIsGeometry(false);
        }
    };

    const handleGenerate = async () => {
        try {
            const topicId = selectedSubtopic
                ? parseInt(selectedSubtopic)
                : selectedParent
                    ? parseInt(selectedParent)
                    : null;

            const response = await axios.post(
                `${SERVER_URL}/questions/generate`,
                { topicId },
                { withCredentials: true }
            );

            const questionData = response.data;

            if (onQuestionGenerated) {
                onQuestionGenerated(questionData);
            }
            navigate(`${PRACTICE_URL}/${questionData.id}`);
        } catch (err) {
            console.error('Failed to generate question', err);
        }
    };

    // --- Admin Functions ---
    const addTopic = async () => {
        const newName = prompt(t('pleaseEnterValidTopicName'), 'New Topic');
        if (!newName) return;

        const newDesc = prompt(t('description'), '');
        const descValue = newDesc === null ? '' : newDesc;

        try {
            await axios.post(`${SERVER_URL}/topics`, {
                name: newName,
                description: descValue,
                difficultyLevel: 'BASIC',
                parentId: null
            }, { withCredentials: true });
            alert(t('topicCreatedSuccessfully'));
            fetchParents();
        } catch (error) {
            console.error('Failed to create topic', error);
            alert(t('topicCreationFailed'));
        }
    };

    const addSubtopic = async () => {
        if (!selectedParent) {
            alert(t('pleaseEnterValidTopicName'));
            return;
        }
        const newName = prompt(t('pleaseEnterValidTopicName'), 'New Subtopic');
        if (!newName) return;

        const newDesc = prompt(t('description'), '');
        const descValue = newDesc === null ? '' : newDesc;

        try {
            await axios.post(`${SERVER_URL}/topics`, {
                name: newName,
                description: descValue,
                difficultyLevel: 'BASIC',
                parentId: parseInt(selectedParent)
            }, { withCredentials: true });
            alert(t('topicCreatedSuccessfully'));
            fetchSubTopics(selectedParent);
        } catch (error) {
            console.error('Failed to create subtopic', error);
            alert(t('topicCreationFailed'));
        }
    };

    // Helper to get description of current selection for the UI
    const currentDescription = useMemo(() => {
        if (selectedSubtopic) {
            const sub = subTopics.find(s => s.id === selectedSubtopic);
            if (sub) return t(sub.name + 'Description') !== sub.name + 'Description' ? t(sub.name + 'Description') : sub.description;
        }
        if (selectedParent) {
            const par = parentTopics.find(p => p.id === selectedParent);
            if (par) return t(par.name + 'Description') !== par.name + 'Description' ? t(par.name + 'Description') : par.description;
        }
        return null;
    }, [selectedParent, selectedSubtopic, subTopics, parentTopics, t]);


    return (
        <Stack spacing={4}>
            {/* Header */}
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {t('pleaseGenerateQuestion')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {t('selectType')}
                </Typography>
            </Box>

            {/* Selection Area */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="parent-topic-label">{t('questionType')}</InputLabel>
                        <Select
                            labelId="parent-topic-label"
                            label={t('questionType')}
                            value={selectedParent}
                            onChange={(e) => handleParentSelect(e.target.value)}
                            startAdornment={<CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />}
                            sx={{ borderRadius: 2 }}
                        >
                            {parentTopics.map((topic) => (
                                <MenuItem key={topic.id} value={topic.id}>
                                    {t(topic.name)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" disabled={!selectedParent}>
                        <InputLabel id="sub-topic-label">
                            {t(isGeometry ? 'shapeType' : 'operatorType')}
                        </InputLabel>
                        <Select
                            labelId="sub-topic-label"
                            label={t(isGeometry ? 'shapeType' : 'operatorType')}
                            value={selectedSubtopic}
                            onChange={(e) => setSelectedSubtopic(e.target.value)}
                            startAdornment={<SchoolIcon sx={{ mr: 1, color: 'secondary.main' }} />}
                            sx={{ borderRadius: 2 }}
                        >
                            {subTopics.map((topic) => (
                                <MenuItem key={topic.id} value={topic.id}>
                                    {t(topic.name)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Dynamic Description / Insight Card */}
            <Fade in={!!currentDescription} timeout={500}>
                <Box>
                    {currentDescription ? (
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                bgcolor: 'primary.lighter', // Soft background
                                borderColor: 'primary.light'
                            }}
                        >
                            <LightbulbIcon color="primary" />
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" color="primary.dark">
                                    {t('topic')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {currentDescription}
                                </Typography>
                            </Box>
                        </Paper>
                    ) : (
                        // Placeholder to prevent layout jump if desired, or just null
                        <Box sx={{ p: 2, visibility: 'hidden' }} />
                    )}
                </Box>
            </Fade>

            {/* Generate Action */}
            <Button
                variant="contained"
                onClick={handleGenerate}
                disabled={!selectedParent || !selectedSubtopic}
                size="large"
                endIcon={<AutoAwesomeIcon />}
                sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    background: (theme) => !selectedParent || !selectedSubtopic
                        ? theme.palette.action.disabledBackground
                        : `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                    color: (theme) => !selectedParent || !selectedSubtopic
                        ? theme.palette.text.disabled
                        : '#fff',
                    boxShadow: (theme) => `0 8px 16px ${theme.palette.primary.main}40`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: (theme) => `0 12px 20px ${theme.palette.primary.main}60`,
                    }
                }}
            >
                {t('generate')}
            </Button>

            {/* Admin Quick Actions (Collapsed visually) */}
            {isAdmin && (
                <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, color: 'text.secondary' }}>
                        <InfoOutlinedIcon fontSize="small" /> {t('adminSection')}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={addTopic}
                            size="small"
                            color="inherit"
                        >
                            {t('addTopic')}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={addSubtopic}
                            disabled={!selectedParent}
                            size="small"
                            color="inherit"
                        >
                            {t('addSubtopic')}
                        </Button>
                    </Stack>
                </Box>
            )}
        </Stack>
    );
}

QuestionGenerator.propTypes = {
    onQuestionGenerated: PropTypes.func
};

export default QuestionGenerator;