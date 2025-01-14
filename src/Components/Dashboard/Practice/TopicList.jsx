import {useEffect, useState} from 'react';
import axios from 'axios';
import {Box, Table, TableCell, Typography} from "@mui/material";

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
                    minHeight: '10vh',
                    padding: {xs: 0, sm: 4, md: 4, lg: 4},
                    width: '100%',
                    maxWidth: {xs: '90%', sm: '800px'},
                    mx: 'auto',
                }}>

                <Table>
                    <Typography variant="h6" gutterBottom>Here is a list of recommended type of questions for you:</Typography>
                    {topics.map(topic => (
                        <TableCell key={topic.id}>
                            <Typography variant={"h6"}>{topic.name}</Typography> - {topic.description}
                            <Typography variant="em"> (Difficulty: {topic.difficultyLevel})</Typography>
                        </TableCell>
                    ))}
                </Table>
            </Box>
    );
}

export default TopicList;
