import {useState, useEffect} from 'react';
import axios from 'axios';
import TopicList from "./TopicList.jsx";
import '../../../CSS/App.css'
import {Box, Grid, Button, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import {PRACTICE_URL} from "../../../Utils/Constants.js";
import {useTranslation} from "react-i18next";

function QuestionGenerator({ onQuestionGenerated }) {
    const [difficulty, setDifficulty] = useState('BASIC');
    const [parentTopics, setParentTopics] = useState([]);
    const [subTopics, setSubTopics] = useState([]);
    const [selectedParent, setSelectedParent] = useState('');
    const [selectedSubtopic, setSelectedSubtopic] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/topics");
                setParentTopics(response.data);
            } catch (error) {
                console.error("Failed to fetch parent topics", error);
            }
        };
        fetchParents();
    }, []);

    useEffect(() => {
        const fetchSubTopics = async () => {
            if (!selectedParent) {
                setSubTopics([]);
                setSelectedSubtopic("");
                return;
            }
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/topics?parentId=${selectedParent}`
                );
                setSubTopics(response.data);
            } catch (error) {
                console.error("Failed to fetch subtopics", error);
            }
        };
        fetchSubTopics();
    }, [selectedParent]);

    const handleGenerate = async () => {
        try {
            const topicId = selectedSubtopic
                ? parseInt(selectedSubtopic)
                : selectedParent
                    ? parseInt(selectedParent)
                    : null;

            const response = await axios.post("http://localhost:8080/api/questions/generate", {
                topicId: topicId,
                difficultyLevel: difficulty
            });

            const questionData = response.data;
            if (onQuestionGenerated) {
                onQuestionGenerated(questionData);
            }

            navigate(`${PRACTICE_URL}/${questionData.id}`);
        } catch (err) {
            console.error("Failed to generate question", err);
        }
    };

    return (
        <Box sx={{ margin: "10px", display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ marginTop: "20px" }} variant="h5" align="center">
                {t('pleaseGenerateQuestion')}
            </Typography>
            <Box sx={{ marginLeft: "30px", minWidth: 120 }}>
                <TopicList topics={subTopics} />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Typography>{t('questionType')}:</Typography>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel>{t('selectType')}</InputLabel>
                            <Select
                                value={selectedParent}
                                onChange={(e) => setSelectedParent(e.target.value)}
                            >
                                {parentTopics.map(topic => (
                                    <MenuItem key={topic.id} value={topic.id}>
                                        {t(topic.name)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography>{t('questionType')}:</Typography>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel>{t('selectType')}</InputLabel>
                            <Select
                                value={selectedSubtopic}
                                onChange={(e) => setSelectedSubtopic(e.target.value)}
                                disabled={!selectedParent}
                            >
                                {subTopics.map(topic => (
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
            <br />
            <Button
                disabled={!selectedParent && !selectedSubtopic}
                variant="contained"
                sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}
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
