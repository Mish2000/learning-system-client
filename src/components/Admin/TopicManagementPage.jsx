import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Divider,
    Snackbar,
    Stack,
    Tooltip,
    Typography,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Chip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { SERVER_URL } from '../../utils/Constants';
import Loading from '../Common/Loading.jsx';

function TopicManagementPage() {
    const { t } = useTranslation();

    const [topics, setTopics] = useState([]);
    const [deletedTopics, setDeletedTopics] = useState([]);
    const [loadingDeleted, setLoadingDeleted] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const closeSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    useEffect(() => {
        refreshAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshAll = async () => {
        await Promise.all([fetchAllParentTopics(), fetchDeletedTopics()]);
    };

    const fetchAllParentTopics = async () => {
        try {
            const res = await axios.get(`${SERVER_URL}/topics`, { withCredentials: true });
            const parentTopics = res.data || [];

            for (const parent of parentTopics) {
                const subRes = await axios.get(
                    `${SERVER_URL}/topics?parentId=${parent.id}`,
                    { withCredentials: true }
                );
                parent.subtopics = subRes.data || [];
                parent.subtopicCount = parent.subtopics.length;
            }

            setTopics(parentTopics);
        } catch (error) {
            console.error('Failed to fetch topics', error);
            setTopics([]);
        }
    };

    const fetchDeletedTopics = async () => {
        setLoadingDeleted(true);
        try {
            const res = await axios.get(`${SERVER_URL}/topics/deleted`, { withCredentials: true });
            setDeletedTopics(res.data || []);
        } catch (error) {
            console.error('Failed to fetch deleted topics', error);
            setDeletedTopics([]);
        } finally {
            setLoadingDeleted(false);
        }
    };

    const handleDeleteTopic = async (id) => {
        try {
            await axios.delete(`${SERVER_URL}/topics/${id}`, { withCredentials: true });
            showSnackbar(t('topicDeleted'), 'success');
            await refreshAll();
        } catch (error) {
            console.error('Failed to delete topic', error);
            showSnackbar(t('topicDeletionFailed'), 'error');
        }
    };

    const handleRestoreTopic = async (id) => {
        try {
            await axios.put(`${SERVER_URL}/topics/${id}/restore`, null, { withCredentials: true });
            showSnackbar(t('topicRestored'), 'success');
            await refreshAll();
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data || t('topicRestoreFailed');
            showSnackbar(msg, 'error');
        }
    };

    // ---------- Translation helpers ----------
    const translateName = (rawName = '') => {
        if (!rawName) return '';
        const direct = t(rawName);
        if (direct !== rawName) return direct;
        const cap = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        const capVal = t(cap);
        if (capVal !== cap) return capVal;
        return rawName;
    };

    const translateDescription = (topic) => {
        const name = topic?.name || '';
        const fallbackDesc = topic?.description || '';
        if (!name) return fallbackDesc;
        const capName = name.charAt(0).toUpperCase() + name.slice(1);
        const lowName = name.charAt(0).toLowerCase() + name.slice(1);
        const candidates = [`${name}Description`, `${capName}Description`, `${lowName}Description`];
        for (const key of candidates) {
            const val = t(key);
            if (val !== key) return val;
        }
        return fallbackDesc;
    };

    // -------- Restore view logic --------
    const deletedParents = useMemo(() => deletedTopics.filter(dt => dt.parentId == null), [deletedTopics]);
    const deletedSubs = useMemo(() => deletedTopics.filter(dt => dt.parentId != null), [deletedTopics]);
    const deletedParentIds = useMemo(() => new Set(deletedParents.map(p => p.id)), [deletedParents]);
    const deletedSubsByParent = useMemo(() => {
        const map = {};
        for (const sub of deletedSubs) {
            if (!map[sub.parentId]) map[sub.parentId] = [];
            map[sub.parentId].push(sub);
        }
        return map;
    }, [deletedSubs]);
    const standaloneDeletedSubs = useMemo(() => deletedSubs.filter(s => !deletedParentIds.has(s.parentId)), [deletedSubs, deletedParentIds]);
    const parentNameById = useMemo(() => {
        const m = new Map();
        for (const p of topics) {
            m.set(p.id, p.name);
        }
        return m;
    }, [topics]);
    const hasDeletedAnything = deletedTopics.length > 0;

    return (
        <Stack spacing={4}>
            {/* ---- Restore section ---- */}
            {hasDeletedAnything && (
                <Card variant="outlined" sx={{ borderColor: 'warning.main' }}>
                    <CardHeader
                        title={
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <RestoreFromTrashIcon color="warning" />
                                <Typography variant="h6">{t('restoreDeletedTopics')}</Typography>
                            </Stack>
                        }
                        sx={{ bgcolor: 'warning.lighter' }}
                    />
                    <Divider />
                    <CardContent>
                        {loadingDeleted && <Loading />}

                        {!loadingDeleted && deletedParents.map((parent) => {
                            const childDeletedSubs = deletedSubsByParent[parent.id] || [];
                            return (
                                <Box key={parent.id} sx={{ mb: 2, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {translateName(parent.name)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {translateDescription(parent)}
                                            </Typography>
                                        </Box>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="warning"
                                            onClick={() => handleRestoreTopic(parent.id)}
                                            startIcon={<RestoreFromTrashIcon />}
                                        >
                                            {t('restore')}
                                        </Button>
                                    </Stack>

                                    {childDeletedSubs.length > 0 && (
                                        <Box sx={{ ml: 4, mt: 2 }}>
                                            {childDeletedSubs.map((sub) => (
                                                <Stack key={sub.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                    <Typography variant="body2">
                                                        • {translateName(sub.name)}
                                                    </Typography>
                                                    <Tooltip title={t('restoreParentFirst')}>
                                                        <span>
                                                            <Button size="small" disabled variant="outlined">
                                                                {t('restore')}
                                                            </Button>
                                                        </span>
                                                    </Tooltip>
                                                </Stack>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            );
                        })}

                        {!loadingDeleted && standaloneDeletedSubs.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: 'warning.dark' }}>
                                    {t('deletedSubtopics')}
                                </Typography>
                                {standaloneDeletedSubs.map((sub) => {
                                    const parentName = translateName(parentNameById.get(sub.parentId) || t('unknownParent'));
                                    return (
                                        <Stack key={sub.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {translateName(sub.name)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {t('parentTopic')}: {parentName}
                                                </Typography>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="warning"
                                                onClick={() => handleRestoreTopic(sub.id)}
                                            >
                                                {t('restore')}
                                            </Button>
                                        </Stack>
                                    );
                                })}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            {!hasDeletedAnything && (
                <Alert severity="info" icon={<InfoOutlinedIcon />}>
                    {t('createHiddenUntilDeletion')}
                </Alert>
            )}

            {/* ---- Existing active topics list ---- */}
            <Card>
                <CardHeader title={t('existingTopics')} />
                <Divider />
                <CardContent>
                    {topics.length === 0 && (
                        <Typography align="center" sx={{ py: 2 }}>{t('noTopicsFound')}</Typography>
                    )}

                    {topics.map((topic) => {
                        const hasChildren = topic.subtopicCount > 0 || (topic.subtopics && topic.subtopics.length > 0);
                        return (
                            <Box key={topic.id} sx={{ mb: 3 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Box>
                                        <Typography variant="h6" color="primary">
                                            {translateName(topic.name)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {translateDescription(topic)}
                                        </Typography>
                                    </Box>
                                    <Tooltip title={hasChildren ? t('deleteTopicDisabled') : t('deleteTopic')}>
                                        <span>
                                            <IconButton
                                                color="error"
                                                disabled={hasChildren}
                                                onClick={() => handleDeleteTopic(topic.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Stack>

                                {/* Subtopics Grid */}
                                {topic.subtopics && topic.subtopics.length > 0 && (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 2, pl: 2, borderLeft: '2px solid #eee' }}>
                                        {topic.subtopics.map((sub) => (
                                            <Chip
                                                key={sub.id}
                                                label={translateName(sub.name)}
                                                onDelete={() => handleDeleteTopic(sub.id)}
                                                deleteIcon={<DeleteIcon />}
                                                color="default"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                )}
                                <Divider sx={{ mt: 2 }} />
                            </Box>
                        );
                    })}
                </CardContent>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}

export default TopicManagementPage;