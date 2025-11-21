import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Divider,
    Snackbar,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { SERVER_URL } from '../../utils/Constants';

function TopicManagementPage() {
    const { t } = useTranslation();

    const [topics, setTopics] = useState([]);
    const [deletedTopics, setDeletedTopics] = useState([]);
    const [loadingDeleted, setLoadingDeleted] = useState(false);

    // Modern snackbar (replaces alert())
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
            const msg =
                error?.response?.data?.message ||
                error?.response?.data ||
                t('topicRestoreFailed');
            showSnackbar(msg, 'error');
        }
    };

    // ---------- Translation helpers (fix Hebrew UI) ----------

    const translateName = (rawName = '') => {
        if (!rawName) return '';

        const direct = t(rawName);
        if (direct !== rawName) return direct;

        const cap = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        const capVal = t(cap);
        if (capVal !== cap) return capVal;

        const low = rawName.charAt(0).toLowerCase() + rawName.slice(1);
        const lowVal = t(low);
        if (lowVal !== low) return lowVal;

        return rawName;
    };

    const translateDescription = (topic) => {
        const name = topic?.name || '';
        const fallbackDesc = topic?.description || '';

        if (!name) return fallbackDesc;

        const capName = name.charAt(0).toUpperCase() + name.slice(1);
        const lowName = name.charAt(0).toLowerCase() + name.slice(1);

        const candidates = [
            `${name}Description`,
            `${capName}Description`,
            `${lowName}Description`
        ];

        for (const key of candidates) {
            const val = t(key);
            if (val !== key) return val;
        }

        return fallbackDesc;
    };

    // -------- Restore view logic --------

    const deletedParents = useMemo(
        () => deletedTopics.filter(dt => dt.parentId == null),
        [deletedTopics]
    );

    const deletedSubs = useMemo(
        () => deletedTopics.filter(dt => dt.parentId != null),
        [deletedTopics]
    );

    const deletedParentIds = useMemo(() => {
        return new Set(deletedParents.map(p => p.id));
    }, [deletedParents]);

    const deletedSubsByParent = useMemo(() => {
        const map = {};
        for (const sub of deletedSubs) {
            if (!map[sub.parentId]) map[sub.parentId] = [];
            map[sub.parentId].push(sub);
        }
        return map;
    }, [deletedSubs]);

    const standaloneDeletedSubs = useMemo(
        () => deletedSubs.filter(s => !deletedParentIds.has(s.parentId)),
        [deletedSubs, deletedParentIds]
    );

    const parentNameById = useMemo(() => {
        const m = new Map();
        for (const p of topics) {
            m.set(p.id, p.name);
        }
        return m;
    }, [topics]);

    const hasDeletedAnything = deletedTopics.length > 0;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                {t('adminTopicManagement')}
            </Typography>

            {/* ---- Restore section: appears only if there are deleted items ---- */}
            {hasDeletedAnything && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        {t('restoreDeletedTopics')}
                    </Typography>

                    {loadingDeleted && (
                        <Typography sx={{ mt: 1 }}>
                            {t('loadingDeletedTopics')}
                        </Typography>
                    )}

                    {!loadingDeleted && deletedTopics.length === 0 && (
                        <Typography sx={{ mt: 1 }}>
                            {t('noDeletedTopicsFound')}
                        </Typography>
                    )}

                    {!loadingDeleted && deletedParents.map((parent) => {
                        const childDeletedSubs = deletedSubsByParent[parent.id] || [];
                        const parentName = translateName(parent.name);
                        const parentDesc = translateDescription(parent);

                        return (
                            <Box key={parent.id} sx={{ mt: 2 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography>
                                        <strong>{parentName}</strong> — {parentDesc}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        onClick={() => handleRestoreTopic(parent.id)}
                                    >
                                        {t('restore')}
                                    </Button>
                                </Stack>

                                {childDeletedSubs.length > 0 && (
                                    <Box sx={{ ml: 4, mt: 1 }}>
                                        {childDeletedSubs.map((sub) => {
                                            const subName = translateName(sub.name);
                                            const subDesc = translateDescription(sub);

                                            return (
                                                <Stack
                                                    key={sub.id}
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                    sx={{ mb: 1 }}
                                                >
                                                    <Typography>
                                                        • <strong>{subName}</strong> — {subDesc}
                                                    </Typography>

                                                    {/* Edge case: must restore parent first */}
                                                    <Tooltip title={t('restoreParentFirst')}>
                                                        <span>
                                                            <Button variant="outlined" disabled>
                                                                {t('restore')}
                                                            </Button>
                                                        </span>
                                                    </Tooltip>
                                                </Stack>
                                            );
                                        })}
                                    </Box>
                                )}

                                <Divider sx={{ mt: 2 }} />
                            </Box>
                        );
                    })}

                    {!loadingDeleted && standaloneDeletedSubs.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                {t('deletedSubtopics')}
                            </Typography>

                            {standaloneDeletedSubs.map((sub) => {
                                const parentNameRaw =
                                    parentNameById.get(sub.parentId) || t('unknownParent');

                                const parentName = translateName(parentNameRaw);
                                const subName = translateName(sub.name);
                                const subDesc = translateDescription(sub);

                                return (
                                    <Stack
                                        key={sub.id}
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                        sx={{ mb: 1, ml: 2 }}
                                    >
                                        <Typography>
                                            • <strong>{subName}</strong> — {subDesc}{' '}
                                            ({t('parentTopic')}: {parentName})
                                        </Typography>

                                        <Button
                                            variant="outlined"
                                            onClick={() => handleRestoreTopic(sub.id)}
                                        >
                                            {t('restore')}
                                        </Button>
                                    </Stack>
                                );
                            })}
                        </Box>
                    )}
                </Box>
            )}

            {/* ---- Create section is hidden until deletion (per requirement) ---- */}
            {!hasDeletedAnything && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="body1">
                        {t('createHiddenUntilDeletion')}
                    </Typography>
                </Box>
            )}

            {/* ---- Existing active topics list (no difficulty text) ---- */}
            <Box>
                <Typography variant="h6">{t('existingTopics')}</Typography>

                {topics.length === 0 && (
                    <Typography>{t('noTopicsFound')}</Typography>
                )}

                {topics.map((topic) => {
                    const topicName = translateName(topic.name);
                    const topicDesc = translateDescription(topic);

                    const hasChildren =
                        topic.subtopicCount > 0 ||
                        (topic.subtopics && topic.subtopics.length > 0);

                    return (
                        <Box key={topic.id} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>
                                    <strong>{topicName}</strong> — {topicDesc}
                                </Typography>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    disabled={hasChildren}
                                    onClick={() => handleDeleteTopic(topic.id)}
                                >
                                    {t('deleteTopic')}
                                </Button>
                            </Box>

                            {topic.subtopics && topic.subtopics.length > 0 && (
                                <Box sx={{ ml: 4, mt: 1 }}>
                                    {topic.subtopics.map((sub) => {
                                        const subName = translateName(sub.name);
                                        const subDesc = translateDescription(sub);

                                        return (
                                            <Box
                                                key={sub.id}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    mb: 1
                                                }}
                                            >
                                                <Typography>
                                                    • <strong>{subName}</strong> — {subDesc}
                                                </Typography>

                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    disabled={sub.subtopicCount > 0}
                                                    onClick={() => handleDeleteTopic(sub.id)}
                                                >
                                                    {t('deleteTopic')}
                                                </Button>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={closeSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default TopicManagementPage;


