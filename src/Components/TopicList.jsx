import {useEffect, useState} from 'react';
import axios from 'axios';
import {Box, Typography} from "@mui/material";

function TopicList() {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/topics');
                setTopics(response.data);
            } catch (error) {
                console.error('Failed to fetch topics', error);
            }
        };
        fetchTopics();
    }, []);

    return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: {xs: 0, sm: 4, md: 4, lg: 4},
                    width: '100%',
                    maxWidth: {xs: '90%', sm: '800px'},
                    mx: 'auto',
                }}>
                <Typography variant="h4" gutterBottom>All Topics</Typography>
                <ul>
                    {topics.map(topic => (
                        <li key={topic.id}>
                            <strong>{topic.name}</strong> - {topic.description}
                            <em> (Difficulty: {topic.difficultyLevel})</em>
                        </li>
                    ))}
                </ul>
            </Box>
    );
}

export default TopicList;
