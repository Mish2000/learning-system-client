import {useState, useEffect} from 'react';
import axios from 'axios';
import TopicList from "./TopicList.jsx";
import '../App.css'
import Grid from '@mui/material/Grid2';
import {Box, Button, Card, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import PropTypes from "prop-types";

function QuestionGenerator({ onQuestionGenerated }) {
    const [difficulty, setDifficulty] = useState('BASIC');
    const [parentTopics, setParentTopics] = useState([]);
    const [subTopics, setSubTopics] = useState([]);
    const [selectedParent, setSelectedParent] = useState('');
    const [selectedSubtopic, setSelectedSubtopic] = useState('');
    const [generatedQuestion, setGeneratedQuestion] = useState(null);

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/topics');
                setParentTopics(response.data);
            } catch (error) {
                console.error('Failed to fetch parent topics', error);
            }
        };
        fetchParents();
    }, []);

    useEffect(() => {
        const fetchSubTopics = async () => {
            if (!selectedParent) {
                setSubTopics([]);
                setSelectedSubtopic('');
                return;
            }
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/topics?parentId=${selectedParent}`
                );
                setSubTopics(response.data);
            } catch (error) {
                console.error('Failed to fetch subtopics', error);
            }
        };
        fetchSubTopics();
    }, [selectedParent]);

    const handleGenerate = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/questions/generate',
                {
                    topicId: selectedSubtopic ? parseInt(selectedSubtopic) : null,
                    difficultyLevel: difficulty
                }
            );
            setGeneratedQuestion(response.data);
            if (onQuestionGenerated) {
                onQuestionGenerated(response.data);
            }
        } catch (err) {
            console.error('Failed to generate question', err);
        }
    };

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ marginTop: "20px" }} variant="h5" align="center">
                please generate a question
            </Typography>
            <Box sx={{ marginLeft: "30px", minWidth: 120 }}>
                <TopicList />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Typography>Question type:</Typography>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel id="question-label">-- Select Type --</InputLabel>
                            <Select
                                labelId="question-label"
                                id="question"
                                value={selectedParent}
                                label="-- Select question Type--"
                                onChange={(e) => setSelectedParent(e.target.value)}
                            >
                                <MenuItem value="">-- Select question Type --</MenuItem>
                                {parentTopics.map(topic => (
                                    <MenuItem key={topic.id} value={topic.id}>
                                        {topic.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography>Operator type:</Typography>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel id="operator-label">-- Select Type --</InputLabel>
                            <Select
                                labelId="operator-label"
                                id="operator"
                                value={selectedSubtopic}
                                onChange={(e) => setSelectedSubtopic(e.target.value)}
                                disabled={!selectedParent}
                            >
                                <MenuItem value="">-- Select operator type --</MenuItem>
                                {subTopics.map(topic => (
                                    <MenuItem key={topic.id} value={topic.id}>
                                        {topic.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography>Difficulty:</Typography>
                        <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            <MenuItem value="BASIC">BASIC</MenuItem>
                            <MenuItem value="EASY">EASY</MenuItem>
                            <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                            <MenuItem value="ADVANCED">ADVANCED</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
            </Box>
            <br />
            <Button
                variant="contained"
                sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}
                onClick={handleGenerate}
            >
                Generate
            </Button>

            {generatedQuestion && (
                <Box className="container" style={{ marginTop: 15, marginBottom: 15 }}>
                    <Box sx={{ marginLeft: "20px", marginTop: "23px", marginBottom: "15px" }}>
                        <Typography>Question ID: {generatedQuestion.id}</Typography>
                        <br />
                        <Typography sx={{ wordSpacing: 15 }}>
                            Question Text: {generatedQuestion.questionText}
                        </Typography>
                        <br />
                        <Typography>Difficulty: {generatedQuestion.difficultyLevel}</Typography>
                    </Box>
                </Box>
            )}
        </Card>
    );
}

QuestionGenerator.propTypes = {
    onQuestionGenerated: PropTypes.func
};

export default QuestionGenerator;
