import {Box, Table, TableBody, TableCell, TableRow, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";

function TopicList({ topics }) {
    const { t } = useTranslation();

    const normalizeKey = (str) => {
        if (!str) return "";
        return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
    };

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
            }}>
            <Typography gutterBottom>{t('bankOfQuestionTypes')}</Typography>
            <Table>
                <TableBody>
                    {topics.map(topic => (
                        <TableRow key={topic.id}>
                            <TableCell>
                                <Typography variant="h6">{t(normalizeKey(topic.name))}</Typography> - {t(normalizeKey(topic.name) + "Description")}
                                <Typography variant="body2">({t('difficulty')}: {t(topic.difficultyLevel)})</Typography>
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

