import {useState, useEffect} from 'react';
import axios from 'axios';
import TopicList from "./TopicList.jsx";
import '../../../CSS/App.css'
import {Box, Grid, Button, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import {PRACTICE_URL} from "../../../Utils/Constants.js";

function QuestionGenerator({ onQuestionGenerated }) {
    const [difficulty, setDifficulty] = useState('BASIC');
    const [parentTopics, setParentTopics] = useState([]);
    const [subTopics, setSubTopics] = useState([]);
    const [selectedParent, setSelectedParent] = useState('');
    const [selectedSubtopic, setSelectedSubtopic] = useState('');
    const [generatedQuestion, setGeneratedQuestion] = useState(null);
    const navigate = useNavigate();

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
            setGeneratedQuestion(questionData);

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
                please generate a question
            </Typography>
            <Box sx={{ marginLeft: "30px", minWidth: 120 }}>
                <TopicList />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Typography>Question type:</Typography>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel>-- Select Type --</InputLabel>
                            <Select
                                value={selectedParent}
                                onChange={(e) => setSelectedParent(e.target.value)}
                            >
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
                            <InputLabel>-- Select Type --</InputLabel>
                            <Select
                                value={selectedSubtopic}
                                onChange={(e) => setSelectedSubtopic(e.target.value)}
                                disabled={!selectedParent}
                            >
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
                        <Select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
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
                disabled={!selectedSubtopic}
                variant="contained"
                sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}
                onClick={handleGenerate}
            >
                Generate
            </Button>
        </Box>
    );
}

QuestionGenerator.propTypes = {
    onQuestionGenerated: PropTypes.func
};

export default QuestionGenerator;
