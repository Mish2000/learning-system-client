import {useEffect, useState} from 'react';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {SERVER_URL} from '../../utils/Constants';

function TopicManagementPage() {
    const {t} = useTranslation();
    const [topics, setTopics] = useState([]);
    const [topicName, setTopicName] = useState('');
    const [description, setDescription] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState('BASIC');
    const [parentId, setParentId] = useState(null);

    useEffect(() => {
        fetchAllTopics();
    }, []);

    const fetchAllTopics = async () => {
        try {
            const res = await axios.get(`${SERVER_URL}/topics`);
            setTopics(res.data);
        } catch (error) {
            console.error("Failed to fetch topics", error);
        }
    };

    const handleCreateTopic = async () => {
        if (!topicName.trim()) {
            alert(t('pleaseEnterValidTopicName'));
            return;
        }
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.post(
                `${SERVER_URL}/topics`,
                {
                    name: topicName,
                    description,
                    difficultyLevel,
                    parentId: parentId ? parseInt(parentId) : null
                },
                {headers: {Authorization: `Bearer ${token}`}}
            );
            alert(t('topicCreatedSuccessfully'));
            setTopicName('');
            setDescription('');
            setDifficultyLevel('BASIC');
            setParentId(null);
            fetchAllTopics();
        } catch (error) {
            console.error("Failed to create topic", error);
            alert(t('topicCreationFailed'));
        }
    };

    const handleDeleteTopic = async (id) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.delete(`${SERVER_URL}/topics/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            alert(t('topicDeleted'));
            fetchAllTopics();
        } catch (error) {
            console.error("Failed to delete topic", error);
            alert(t('topicDeletionFailed'));
        }
    };

    return (
        <Box sx={{p: 4}}>
            <Typography variant="h4" gutterBottom>
                {t('adminTopicManagement')}
            </Typography>

            <Box sx={{mb: 4}}>
                <Typography variant="h6">{t('createNewTopic')}</Typography>
                <TextField
                    label={t('topicName')}
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    sx={{mr: 2, mt: 1}}
                />
                <TextField
                    label={t('description')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{mr: 2, mt: 1}}
                />
                <FormControl sx={{mr: 2, mt: 1}}>
                    <InputLabel>{t('difficulty')}</InputLabel>
                    <Select
                        value={difficultyLevel}
                        onChange={(e) => setDifficultyLevel(e.target.value)}
                        label={t('difficulty')}
                        sx={{width: 120}}
                    >
                        <MenuItem value="BASIC">{t('basic')}</MenuItem>
                        <MenuItem value="EASY">{t('easy')}</MenuItem>
                        <MenuItem value="MEDIUM">{t('medium')}</MenuItem>
                        <MenuItem value="ADVANCED">{t('advanced')}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{mr: 2, mt: 1}}>
                    <InputLabel>{t('parentTopic')}</InputLabel>
                    <Select
                        value={parentId || ''}
                        onChange={(e) => setParentId(e.target.value)}
                        label={t('parentTopic')}
                        sx={{width: 200}}
                    >
                        <MenuItem value="">
                            <em>{t('none')}</em>
                        </MenuItem>
                        {topics.map((topic) => (
                            <MenuItem key={topic.id} value={topic.id}>
                                {topic.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" sx={{mt: 2}} onClick={handleCreateTopic}>
                    {t('createTopic')}
                </Button>
            </Box>

            <Box>
                <Typography variant="h6">{t('existingTopics')}</Typography>
                {topics.length === 0 && (
                    <Typography>{t('noTopicsFound')}</Typography>
                )}
                {topics.map((topic) => (
                    <Box key={topic.id} sx={{display: 'flex', alignItems: 'center', mt: 1}}>
                        <Typography sx={{mr: 2}}>
                            <strong>{topic.name}</strong> – {topic.description} ({t('difficulty')}: {topic.difficultyLevel})
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            disabled={topic.subtopicCount > 0}
                            onClick={() => handleDeleteTopic(topic.id)}
                        >
                            {t('deleteTopic')}
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default TopicManagementPage;
