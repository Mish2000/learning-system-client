
export const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
};