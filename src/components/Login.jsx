import {useState} from 'react';
import PropTypes from "prop-types";
import axios from 'axios';

function Login({ onLoginSuccess }) {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password
            });
            console.log(response.data);

            const { token, role } = response.data;

            localStorage.setItem('jwtToken', token);
            localStorage.setItem('role', role);

            alert('Login success! Role: ' + role);

            onLoginSuccess(token, role);
        } catch (err) {
            console.error(err);
            alert('Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button>Login</button>
            </form>
        </div>
    );
}

Login.propTypes = {
    onLoginSuccess: PropTypes.func.isRequired,
};

export default Login;
