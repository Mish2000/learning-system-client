import PropTypes from 'prop-types';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserDashboardSSE from './UserDashboardSSE';
import AdminDashboardSSE from './AdminDashboardSSE';

function CombinedDashboard({ role, onLogout }) {
    const navigate = useNavigate();

    return (
        <Box sx={{ marginTop: 0, width: '100%', textAlign: 'center' }}>

            {role === 'USER' && (
                    <UserDashboardSSE />

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

        </Box>
    );
}

CombinedDashboard.propTypes = {
    role: PropTypes.string,
    onLogout: PropTypes.func
};

export default CombinedDashboard;
