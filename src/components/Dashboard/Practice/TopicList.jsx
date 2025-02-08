import {Box, Button, Table, TableBody, TableCell, TableRow, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import {DELETE_TOPIC_URL, SERVER_URL} from "../../../utils/Constants.js";
import {useState} from "react";

function TopicList({topics}) {
    const {t} = useTranslation();
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === "ADMIN");

    const normalizeKey = (str) => {
        if (!str) return "";
        return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
    };

    const deleteTopic = async (str) => {
        try {
            const response = await axios.delete(SERVER_URL + DELETE_TOPIC_URL + str)
            return response.data;
        } catch (error) {
            console.log("no such topic", str, error);
        }
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
            }}>
            <Typography gutterBottom>{t('bankOfQuestionTypes')}</Typography>
            <Table>
                <TableBody>
                    {topics.map(topic => (
                        <TableRow key={topic.id}>
                            <TableCell sx={{
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2
                            }}>
                                <Box sx={{display: "ruby"}}>
                                    <Typography variant="h6">
                                        {t(normalizeKey(topic.name))}
                                    </Typography>- {t(normalizeKey(topic.name) + "Description")}
                                    <Typography variant="body2">
                                        ({t('difficulty')}: {t(topic.difficultyLevel)})
                                    </Typography>
                                </Box>
                                {isAdmin && (
                                    <IconButton sx={{display: "-webkit-box", ml: "auto"}} aria-label="delete"
                                                onClick={() => deleteTopic(topic.name)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                )}
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
};

export default TopicList;

