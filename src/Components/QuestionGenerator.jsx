import {useState, useEffect} from 'react';
import axios from 'axios';
import TopicList from "./TopicList.jsx";
import '../App.css'
import Grid from '@mui/material/Grid2';
import {Box, Button, Card, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";

function QuestionGenerator() {
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
        <Card sx={{display: 'flex', flexDirection: 'column'}}>
            <Typography sx={{marginTop:"20px"}} variant={"h5"} align={"center"}>please generate a question</Typography>
            <Box sx={{marginLeft:"30px",minWidth: 120}}>
                <TopicList/>
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <Box >
                            <Typography>Question type: </Typography>
                            <FormControl variant="standard" sx={{m: 1, minWidth: 150}}>
                                <InputLabel id={"question-label"}>-- Select Type --</InputLabel>
                                <Select
                                    labelId="question-label"
                                    id="question"
                                    value={selectedParent}
                                    label="-- Select question Type--"
                                    onChange={(e) => setSelectedParent(e.target.value)}
                                >
                                    <MenuItem value="-- Select qurstio type --">-- Select question Type --</MenuItem>
                                    {parentTopics.map(topic => (
                                        <MenuItem key={topic.id} value={topic.id}>{topic.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid size={4}>
                        <Box>
                            <Typography> Operator type: </Typography>
                            <FormControl variant="standard" sx={{m: 1, minWidth: 150}}>
                                <InputLabel id={"operator-label"}>-- Select Type --</InputLabel>
                                <Select
                                    labelId="operator-label"
                                    id="operator"
                                    value={selectedSubtopic}
                                    onChange={(e) => setSelectedSubtopic(e.target.value)}
                                    disabled={!selectedParent}
                                >
                                    <MenuItem value="-- Select Subtopic --">-- Select operator type --</MenuItem>
                                    {subTopics.map(topic => (
                                        <MenuItem key={topic.id} value={topic.id}>{topic.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid size={4}>
                        <Box>
                            <Typography>Difficulty: </Typography>
                            <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                                <MenuItem value="BASIC">BASIC</MenuItem>
                                <MenuItem value="EASY">EASY</MenuItem>
                                <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                                <MenuItem value="ADVANCED">ADVANCED</MenuItem>
                            </Select>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <br/>
            <Button variant="contained" sx={{ display:"flex",alignContent:"center",position:"flex",justifyContent:"center"}} onClick={handleGenerate}>Generate</Button>
            {generatedQuestion && (
                <Box sx={{marginLeft:"20px"}} className={"container"} style={{marginTop: 20}}>
                    <Typography>Question ID:{generatedQuestion.id}</Typography>
                    <br/>
                    <Typography sx={{wordSpacing: 12}}>Question Text: {generatedQuestion.questionText}</Typography>
                    <br/>
                    <Typography>Difficulty:{generatedQuestion.difficultyLevel}</Typography>
                </Box>
            )}
        </Card>
    );
}

export default QuestionGenerator;
