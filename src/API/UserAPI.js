import axios from 'axios';

export async function registerUser(username, email, password) {
    try {
        const response = await axios.post('http://localhost:8080/api/auth/register', {
            username,
            email,
            password
        });

        return response;
    } catch (error) {
return error;
    }
}

export async function getUsername(token) {
    const response = await axios.get('http://localhost:8080/api/sse/user-dashboard', {token});
    return response.data;

}





