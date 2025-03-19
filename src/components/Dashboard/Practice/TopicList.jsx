import {Box, Stack, Table, TableBody, TableCell, TableRow, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import {GET_DIRECTION, SERVER_URL} from "../../../utils/Constants.js";
import {useState} from "react";

function TopicList({topics, onDeleted}) {
    const {t,i18n} = useTranslation();
    const [isAdmin] = useState(localStorage.getItem('role') === 'ADMIN');

    const deleteTopic = async (topicId) => {
        const token = localStorage.getItem('jwtToken');
        try {
            await axios.delete(`${SERVER_URL}/topics/${topicId}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            alert(t('topicDeleted'));
            if (onDeleted) {
                onDeleted();
            }
        } catch (error) {
            console.error('Failed to delete topic', error);
            alert(t('topicDeletionFailed'));
        }
    };

    if (!topics || topics.length === 0) {
        return (
            <Box sx={{textAlign: 'center', mt: 2}}>
                <Typography variant="h6">{t('noTopicsFound')}</Typography>
            </Box>
        );
    }

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
            }}
        >
            <Typography gutterBottom>{t('bankOfQuestionTypes')}</Typography>
            <Table>
                <TableBody>
                    {topics.map(topic => (
                        <TableRow key={topic.id}>
                            <TableCell>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box>
                                        <Typography variant="h6">{t(topic.name)}</Typography>
                                        <Typography variant="body2">
                                            {topic.description} ({t('difficulty')}: {t(topic.difficultyLevel)})
                                        </Typography>
                                        <Typography variant="caption">
                                            {t('subtopics')}: {topic.subtopicCount}
                                        </Typography>
                                    </Box>

                                    {isAdmin && topic.subtopicCount === 0 && (
                                        <IconButton
                                            color="error"
                                            onClick={() => deleteTopic(topic.id)}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    )}
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}

TopicList.propTypes = {
    topics: PropTypes.array.isRequired,
    onDeleted: PropTypes.func,
};

export default TopicList;


