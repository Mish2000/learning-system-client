import {useEffect, useState} from 'react';
import axios from 'axios';
import {Box, Table, TableBody, TableCell, TableRow, Typography} from "@mui/material";

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

                <Typography gutterBottom>Bank of Question types:</Typography>
                <Table>
                    <TableBody>
                        {topics.map(topic => (
                            <TableRow key={topic.id}>
                                <TableCell>
                                    <Typography variant="h6">{topic.name}</Typography> - {topic.description}
                                    <Typography variant="body2"> (Difficulty: {topic.difficultyLevel})</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
    );
}

export default TopicList;
