import PropTypes from 'prop-types';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserDashboardSSE from './UserDashboardSSE';
import AdminDashboardSSE from './AdminDashboardSSE';

function CombinedDashboard({ role, onLogout }) {
    const navigate = useNavigate();

    return (
        <Box sx={{ marginTop: 4, width: '100%', textAlign: 'center' }}>
            <Typography variant="h3" mb={2}>
                Welcome to the Dashboard!
            </Typography>

            {role === 'USER' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <UserDashboardSSE />
                </Box>
            )}

            {role === 'ADMIN' && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 4,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                }}>
                    <Box sx={{ flex: 1 }}>
                        <UserDashboardSSE />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <AdminDashboardSSE />
                    </Box>
                </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, marginTop: 3, justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/practice')}
                >
                    Practice Section
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        onLogout();
                        navigate('/login');
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );
}

CombinedDashboard.propTypes = {
    role: PropTypes.string,
    onLogout: PropTypes.func
};

export default CombinedDashboard;
