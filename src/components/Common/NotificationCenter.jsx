import {useState, useEffect} from 'react';
import {IconButton, Badge, Menu, MenuItem, ListItemText, Chip, Divider, Box, Snackbar, Alert} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import {SERVER_URL} from '../../utils/Constants';

function NotificationCenter() {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        function handleNewNotification(e) {
            const newNotif = e.detail;
            setNotifications((prev) => [newNotif, ...prev]);
            setSnackbarMessage("New Notification: " + newNotif.message);
            setSnackbarOpen(true);
            console.log("Got SSE custom event in NotificationCenter:", e.detail);
        }
        window.addEventListener('server-notification', handleNewNotification);
        return () => {
            window.removeEventListener('server-notification', handleNewNotification);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) return;
            const res = await axios.get(`${SERVER_URL}/notifications`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setNotifications(res.data.slice(0, 15));
        } catch (error) {
            console.error('Error fetching notifications', error);
        }
    };

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleMarkAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.post(
                `${SERVER_URL}/notifications/markRead/${notificationId}`,
                null,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === notificationId ? {...notif, isRead: true} : notif
                )
            );
        } catch (error) {
            console.error('Error marking notification as read', error);
        }
    };

    const markAllAsRead = async () => {
        for (let n of notifications) {
            if (!n.isRead) {
                await handleMarkAsRead(n.id);
            }
        }
    };

    const clearAllNotifications = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) return;

            await axios.delete(`${SERVER_URL}/notifications/clearAll`, {
                headers: {Authorization: `Bearer ${token}`}
            });

            setNotifications([]);
        } catch (error) {
            console.error('Error clearing notifications', error);
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="secondary">
                    <NotificationsIcon/>
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {notifications.length > 0 ? (
                    <>
                        <MenuItem onClick={async () => {
                            await markAllAsRead();
                            handleClose();
                        }}>
                            <ListItemText primary="Mark All as Read"/>
                        </MenuItem>

                        <MenuItem onClick={async () => {
                            await clearAllNotifications();
                            handleClose();
                        }}>
                            <ListItemText primary="Clear Notifications"/>
                        </MenuItem>

                        <Divider/>

                        <Box sx={{maxHeight: 300, overflowY: 'auto'}}>
                            {notifications.map((notification) => (
                                <MenuItem
                                    key={notification.id}
                                    onClick={() => handleMarkAsRead(notification.id)}
                                >
                                    <ListItemText primary={notification.message}/>
                                    {!notification.isRead && (
                                        <Chip
                                            label="Unread"
                                            color="warning"
                                            size="small"
                                            sx={{ml: 1}}
                                        />
                                    )}
                                </MenuItem>
                            ))}
                        </Box>
                    </>
                ) : (
                    <MenuItem>
                        <ListItemText primary="No notifications"/>
                    </MenuItem>
                )}
            </Menu>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default NotificationCenter;

