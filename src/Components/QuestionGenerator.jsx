import { useState, useEffect } from 'react';
import axios from 'axios';
import TopicList from "./TopicList.jsx";
import {Box, Button, MenuItem, Select, Typography} from "@mui/material";

function QuestionGenerator() {
    const [difficulty, setDifficulty] = useState('BASIC');
    const [parentTopics, setParentTopics] = useState([]);
    const [subTopics, setSubTopics]     = useState([]);
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
                const response = await axios.get(`http://localhost:8080/api/topics?parentId=${selectedParent}`);
                setSubTopics(response.data);
            } catch (error) {
                console.error('Failed to fetch subtopics', error);
            }
        };
        fetchSubTopics();
    }, [selectedParent]);

    const handleGenerate = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/questions/generate', {
                topicId: selectedSubtopic ? parseInt(selectedSubtopic) : null,
                difficultyLevel: difficulty
            });
            setGeneratedQuestion(response.data);
            console.log(response.data);
        } catch (err) {
            console.error('Failed to generate question', err);
        }
    };

    return (
        <Box>
            <Typography>Generate a Question</Typography>
            <Box>
                <TopicList/>
                <Typography>Parent Topic: </Typography>
                <select
                    value={selectedParent}
                    onChange={(e) => setSelectedParent(e.target.value)}
                >
                    <option value="">-- Select Parent --</option>
                    {parentTopics.map(topic => (
                        <option key={topic.id} value={topic.id}>{topic.name}</option>
                    ))}
                </select>
            </Box>

            <Box>
                <Typography>Subtopic: </Typography>
                <Select
                    value={selectedSubtopic}
                    onChange={(e) => setSelectedSubtopic(e.target.value)}
                    disabled={!selectedParent}
                >
                    <MenuItem value="">-- Select Subtopic --</MenuItem>
                    {subTopics.map(topic => (
                        <MenuItem key={topic.id} value={topic.id}>{topic.name}</MenuItem>
                    ))}
                </Select>
            </Box>

            <Box>
                <Typography>Difficulty: </Typography>
                <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <MenuItem value="BASIC">BASIC</MenuItem>
                    <MenuItem value="EASY">EASY</MenuItem>
                    <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                    <MenuItem value="ADVANCED">ADVANCED</MenuItem>
                </Select>
            </Box>

            <Button onClick={handleGenerate}>Generate</Button>

            {generatedQuestion && (
                <Box style={{ marginTop: 20 }}>
                    <Typography>Question ID:{generatedQuestion.id}</Typography>
                    <Typography>Question Text:{generatedQuestion.questionText}</Typography>
                    <Typography>Difficulty:{generatedQuestion.difficultyLevel}</Typography>
                </Box>
            )}
        </Box>
    );
}

export default QuestionGenerator;
