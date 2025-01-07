
import axios from 'axios';

export async function registerUser(username, email, password) {
    const response = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email,
        password
    });
    return response.data;
}




