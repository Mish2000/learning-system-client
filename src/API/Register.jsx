import axios from "axios";
import {SERVER_URL} from "../Utils/Constants.jsx";

export async  function register(userName, email, password) {
    const params = {
        username: userName,
        email: email,
        password: password,
    }
    try {
        const response = await axios.post(SERVER_URL+'/auth/register', {params})
        return await response?.data;
    } catch (error) {
        console.error('Error:', error);
    }
};