import {useState, useEffect, useCallback} from 'react';
import {
    IconButton,
    Badge,
    Menu,
    Typography,
    Divider,
    Box,
    Snackbar,
    Alert,
    Stack,
    Button,
    Tooltip,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { SERVER_URL } from '../../utils/Constants.js';
import { alpha } from '@mui/material/styles';

export default function NotificationCenter() {
    const { t, i18n } = useTranslation();
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const open = Boolean(anchorEl);

    useEffect(() => {
        fetchNotifications();
    }, []);
     
    const translateMessage = useCallback((msg) => {
        if (!msg) return "";

        const difficultyRegex = /^Your difficulty for (.+) (increased|decreased) from (.+) to (.+?)\.?$/i;
        const match = msg.match(difficultyRegex);

        if (match) {
            const [, topicRaw, directionRaw, fromRaw, toRaw] = match;
            const topic = t(topicRaw.trim()) !== topicRaw.trim() ? t(topicRaw.trim()) : topicRaw.trim();
            const direction = t(`diff_${directionRaw.toLowerCase()}`);
            const fromLevel = t(fromRaw.trim());
            const toLevel = t(toRaw.trim().replace('.', '')); // Remove dot if caught

            return t('difficultyChangeMsg', { topic, direction, from: fromLevel, to: toLevel });
        }

        // Fallback: return original message if it doesn't match known patterns
        return msg;
    }, [t]);
    useEffect(() => {
        function handleNewNotification(e) {
            const newNotif = e.detail;
            setNotifications(prev => [newNotif, ...prev]);
            // Translate the snackbar message immediately
            setSnackbarMessage(`${t('newNotification')}: ${translateMessage(newNotif?.message)}`);
            setSnackbarOpen(true);
        }

        window.addEventListener('server-notification', handleNewNotification);
        return () => {
            window.removeEventListener('server-notification', handleNewNotification);
        };
    }, [t, translateMessage]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${SERVER_URL}/notifications`, { withCredentials: true });
            setNotifications((res.data || []).slice(0, 15));
        } catch (error) {
            console.error('Error fetching notifications', error);
        }
    };

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await axios.post(`${SERVER_URL}/notifications/markRead/${notificationId}`, null, { withCredentials: true });
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId ? { ...notif, isRead: true } : notif
                )
            );
        } catch (error) {
            console.error('Error marking notification as read', error);
        }
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        for (const n of notifications) {
            if (!n.isRead) await handleMarkAsRead(n.id);
        }
    };

    const clearAllNotifications = async () => {
        try {
            await axios.delete(`${SERVER_URL}/notifications/clearAll`, { withCredentials: true });
            setNotifications([]);
            handleClose();
        } catch (error) {
            console.error('Error clearing notifications', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString(i18n.language, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <>
            <IconButton
                color={open ? 'primary' : 'inherit'}
                onClick={handleClick}
                sx={{
                    width: 40,
                    height: 40,
                    bgcolor: open ? (theme) => alpha(theme.palette.primary.main, 0.1) : 'transparent'
                }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 380,
                        maxHeight: 500,
                        borderRadius: 3,
                        mt: 1.5,
                        boxShadow: (theme) => theme.shadows[4],
                        overflow: 'hidden'
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="700">
                        {t('notifications')}
                    </Typography>
                    {notifications.length > 0 && (
                        <Stack direction="row" spacing={1}>
                            <Tooltip title={t('markAllRead')}>
                                <IconButton size="small" color="primary" onClick={markAllAsRead}>
                                    <DoneAllIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={t('clearAll')}>
                                <IconButton size="small" color="error" onClick={clearAllNotifications}>
                                    <DeleteSweepIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    )}
                </Box>

                <Divider />

                <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <ListItem key={notification.id} disablePadding>
                                <ListItemButton
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    sx={{
                                        alignItems: 'flex-start',
                                        bgcolor: notification.isRead ? 'transparent' : (theme) => alpha(theme.palette.primary.main, 0.04),
                                        borderLeft: notification.isRead ? '4px solid transparent' : (theme) => `4px solid ${theme.palette.primary.main}`,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: (theme) => alpha(theme.palette.action.hover, 0.8)
                                        }
                                    }}
                                >
                                    <ListItemAvatar sx={{ mt: 0.5 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: notification.isRead ? 'action.disabledBackground' : 'primary.lighter',
                                                color: notification.isRead ? 'text.disabled' : 'primary.main',
                                                width: 36,
                                                height: 36
                                            }}
                                        >
                                            <InfoIcon fontSize="small" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: notification.isRead ? 400 : 700,
                                                    color: notification.isRead ? 'text.secondary' : 'text.primary',
                                                    lineHeight: 1.4,
                                                    mb: 0.5
                                                }}
                                            >
                                                {/* Use the translator function here */}
                                                {translateMessage(notification.message)}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.disabled">
                                                {formatDate(notification.createdAt)}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    ) : (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                {t('noNotifications')}
                            </Typography>
                        </Box>
                    )}
                </List>

                {notifications.length > 0 && (
                    <>
                        <Divider />
                        <Box sx={{ p: 1, textAlign: 'center' }}>
                            <Button size="small" color="inherit" onClick={handleClose}>
                                {t('close')}
                            </Button>
                        </Box>
                    </>
                )}
            </Menu>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="info" variant="filled" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}