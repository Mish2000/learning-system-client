import { Box, Stack, Table, TableBody, TableCell, TableRow, Typography, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import { SERVER_URL } from "../../../utils/Constants.js";
import { useEffect, useState } from "react";

function TopicList({ topics, onDeleted }) {
    const { t } = useTranslation();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // derive role from the server (cookie-based session)
        axios.get(`${SERVER_URL}/profile`)
            .then(r => setIsAdmin((r.data.role || '').includes('ADMIN')))
            .catch(() => setIsAdmin(false));
    }, []);

    const deleteTopic = async (topicId) => {
        try {
            await axios.delete(`${SERVER_URL}/topics/${topicId}`);
            alert(t('topicDeleted'));
            onDeleted && onDeleted();
        } catch (error) {
            console.error('Failed to delete topic', error);
            alert(t('topicDeletionFailed'));
        }
    };

    if (!topics || topics.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
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
                padding: { xs: 0, sm: 4, md: 4, lg: 4 },
                width: '100%',
                maxWidth: { xs: '90%', sm: '800px' },
                mx: 'auto',
            }}
        >
            <Typography gutterBottom>
                {t('bankOfQuestionTypes')}
            </Typography>

            <Table>
                <TableBody>
                    {topics.map((topic) => {
                        const translatedName = t(topic.name) || topic.name;

                        // Try a "{name}Description" key first; if not found, fall back to the raw description (and run through t() just in case).
                        const descKey = topic.name + 'Description';
                        let finalDescription = t(descKey);
                        if (finalDescription === descKey) {
                            finalDescription = t(topic.description) || topic.description;
                        }

                        const translatedDiff = t(topic.difficultyLevel) || topic.difficultyLevel;

                        return (
                            <TableRow key={topic.id}>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box>
                                            <Typography variant="h6">{translatedName}</Typography>
                                            <Typography variant="body2">
                                                {finalDescription} ({t('difficulty')}: {translatedDiff})
                                            </Typography>
                                        </Box>

                                        {isAdmin && topic.subtopicCount === 0 && (
                                            <IconButton
                                                color="error"
                                                onClick={() => deleteTopic(topic.id)}
                                                aria-label={t('deleteTopic')}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        );
                    })}
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
