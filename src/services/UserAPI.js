import axios from "axios";
import Cookies from "js-cookie";
import { SERVER_URL } from "../utils/Constants";

export async function registerUser({ username, email, password }) {
    const interfaceLanguage = Cookies.get("language") || "en";

    const payload = {
        username,
        email,
        password,
        interfaceLanguage,
    };

    const res = await axios.post(`${SERVER_URL}/auth/register`, payload, {
        withCredentials: true,
    });

    return res.status === 200;
}
