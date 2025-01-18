import {useEffect, useState} from 'react';
import axios from 'axios';
import {Box, Table, TableBody, TableCell, TableRow, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

function TopicList() {
    const [topics, setTopics] = useState([]);
    const { t } = useTranslation();

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

                <Typography gutterBottom>{t('bankOfQuestionTypes')}</Typography>
                <Table>
                    <TableBody>
                        {topics.map(topic => (
                            <TableRow key={topic.id}>
                                <TableCell>
                                    <Typography variant="h6">{t(topic.name)}</Typography> - {topic.description}
                                    <Typography variant="body2">({t('difficulty')}: {t(topic.difficultyLevel)})</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
    );
}

export default TopicList;
