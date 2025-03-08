import {useState, useEffect} from 'react';
import axios from 'axios';
import TopicList from "./TopicList.jsx";
import '../../../styles/App.css'
import {Box, Grid, Button, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import {PRACTICE_URL, SERVER_URL} from "../../../utils/Constants.js";
import {useTranslation} from "react-i18next";

function QuestionGenerator({ onQuestionGenerated }) {
    const [difficulty, setDifficulty] = useState('');
    const [parentTopics, setParentTopics] = useState([]);
    const [subTopics, setSubTopics] = useState([]);
    const [selectedParent, setSelectedParent] = useState('');
    const [selectedSubtopic, setSelectedSubtopic] = useState('');
    const [isGeometry, setIsGeometry] = useState(false);
    const [isAdmin] = useState(localStorage.getItem('role') === 'ADMIN');
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetchParents();
    }, []);

    const fetchParents = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/topics`);
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
            const response = await axios.get(`${SERVER_URL}/topics?parentId=${parentId}`);
            setSubTopics(response.data);
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

            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(
                `${SERVER_URL}/questions/generate`,
                {
                    topicId: topicId,
                    difficultyLevel: difficulty
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
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

    const addTopic = async () => {
        const newName = prompt(t('pleaseEnterValidTopicName'), 'New Topic');
        if (!newName) return;

        const newDesc = prompt(t('description'), '');
        const descValue = newDesc === null ? '' : newDesc;

        const token = localStorage.getItem('jwtToken');
        try {
            await axios.post(
                `${SERVER_URL}/topics`,
                {
                    name: newName,
                    description: descValue,
                    difficultyLevel: 'BASIC',
                    parentId: null
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
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

        const token = localStorage.getItem('jwtToken');
        try {
            await axios.post(
                `${SERVER_URL}/topics`,
                {
                    name: newName,
                    description: descValue,
                    difficultyLevel: 'BASIC',
                    parentId: parseInt(selectedParent)
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert(t('topicCreatedSuccessfully'));
            fetchSubTopics(selectedParent);
        } catch (error) {
            console.error('Failed to create subtopic', error);
            alert(t('topicCreationFailed'));
        }
    };

    return (
        <Box sx={{ margin: '10px', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ marginTop: '20px' }} variant="h5" align="center">
                {t('pleaseGenerateQuestion')}
            </Typography>
            {isAdmin && (
                <>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                        {t('parentTopics')}
                    </Typography>
                    <TopicList
                        topics={parentTopics}
                        onDeleted={() => {
                            fetchParents();
                        }}
                    />
                </>
            )}

            <TopicList
                topics={subTopics}
                onDeleted={() => {
                    fetchSubTopics(selectedParent);
                }}
            />

            <Box sx={{ marginLeft: '30px', minWidth: 12 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Typography>{t('questionType')}:</Typography>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel>{t('selectType')}</InputLabel>
                            <Select
                                value={selectedParent}
                                onChange={(e) => handleParentSelect(e.target.value)}
                            >
                                {parentTopics.map((topic) => (
                                    <MenuItem key={topic.id} value={topic.id}>
                                        {t(topic.name)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography>
                            {t(isGeometry ? 'shapeType' : 'operatorType')}:
                        </Typography>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel>{t('selectType')}</InputLabel>
                            <Select
                                value={selectedSubtopic}
                                onChange={(e) => setSelectedSubtopic(e.target.value)}
                                disabled={!selectedParent}
                            >
                                {subTopics.map((topic) => (
                                    <MenuItem key={topic.id} value={topic.id}>
                                        {t(topic.name)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography>{t('difficulty')}:</Typography>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel>{t('selectDifficulty')}</InputLabel>
                            <Select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <MenuItem value="BASIC">{t('basic')}</MenuItem>
                                <MenuItem value="EASY">{t('easy')}</MenuItem>
                                <MenuItem value="MEDIUM">{t('medium')}</MenuItem>
                                <MenuItem value="ADVANCED">{t('advanced')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {isAdmin && (
                <Box
                    sx={{
                        marginTop: 2,
                        marginLeft: '48px',
                        alignSelf: 'start',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 4
                    }}
                >
                    <Button variant="contained" onClick={addTopic}>
                        {t('addTopic')}
                    </Button>
                    <Button variant="contained" onClick={addSubtopic}>
                        {t('addSubtopic')}
                    </Button>
                </Box>
            )}

            <br />
            <Button
                disabled={!selectedParent && !selectedSubtopic}
                variant="contained"
                sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}
                onClick={handleGenerate}
            >
                {t('generate')}
            </Button>
        </Box>
    );
}

QuestionGenerator.propTypes = {
    onQuestionGenerated: PropTypes.func
};

export default QuestionGenerator;
