import axios from "axios";
import {SERVER_URL} from "../Utils/Constants.jsx";
import PropTypes from "prop-types";

export async function login({onLoginSuccess}, email, password) {
    const params = {
        email: email,
        password: password,
    }
        try {
            const response = await axios.post(SERVER_URL+'/auth/login', {params});
            console.log(response.data);
            const { token, role } = response;
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('role', role);
            onLoginSuccess(token, role);
        } catch (error) {
            console.error("Error: " + error);
        }
login.propTypes = {
        onLoginSuccess: PropTypes.func.isRequired,
    };
}