import './App.css'
import Login from './components/Login.jsx'
import TopicList from './components/TopicList.jsx'
import QuestionGenerator from './components/QuestionGenerator.jsx'
import AnswerSubmission from './components/AnswerSubmission.jsx'
import UserDashboardSSE from './components/UserDashboardSSE.jsx'
import AdminDashboard from './components/AdminDashboardSSE.jsx'
import {useState} from "react";
import Register from "./components/Register.jsx";

function App() {
    const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
    const [role, setRole]   = useState(localStorage.getItem('role') || null);

    const handleLoginSuccess = (loggedToken, loggedRole) => {
        setToken(loggedToken);
        setRole(loggedRole);
    };

    const handleLogout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('role');
    };

    if (!token) {
        return (
            <div>
                <h1>Welcome to Our Learning System</h1>
                <Register />
                <Login onLoginSuccess={handleLoginSuccess} />
            </div>
        );
    }

    return (
        <div>
            <h1>Welcome, {role === 'ADMIN' ? 'Admin' : 'User'}!</h1>
            <button onClick={handleLogout}>Logout</button>

            <TopicList />
            <QuestionGenerator />
            <AnswerSubmission />

            <hr />
            <UserDashboardSSE />

            {role === 'ADMIN' && (
                <>
                    <hr />
                    <AdminDashboard />
                </>
            )}
        </div>
    );
}

export default App;


