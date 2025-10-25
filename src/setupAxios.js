import axios from "axios";
import { SERVER_URL, LOGIN_URL } from "./utils/Constants.js";

axios.defaults.withCredentials = true;

let isRefreshing = false;
const queue = [];

function waitForRefresh() {
    return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
    });
}

function flushQueue(error = null) {
    while (queue.length) {
        const { resolve, reject } = queue.shift();
        if (error) reject(error);
        else resolve();
    }
}

axios.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config || {};
        const status = error?.response?.status || 0;
        const url = (original.url || "").toString();
        const isAuthEndpoint = url.includes("/api/auth/");

        if (status === 401 && !original._retry && !isAuthEndpoint) {
            original._retry = true;

            if (isRefreshing) {
                await waitForRefresh();
                return axios(original);
            }

            isRefreshing = true;
            try {
                await axios.post(`${SERVER_URL}/auth/refresh`, null, { withCredentials: true });
                isRefreshing = false;
                flushQueue();
                return axios(original);
            } catch (e) {
                isRefreshing = false;
                flushQueue(e);

                // Only navigate if we're not already on the login route
                if (window.location.pathname !== LOGIN_URL) {
                    window.location.replace(LOGIN_URL);
                }
                return Promise.reject(e);
            }
        }

        return Promise.reject(error);
    }
);
