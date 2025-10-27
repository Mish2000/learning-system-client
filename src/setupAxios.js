import axios from "axios";
import { SERVER_URL, LOGIN_URL } from "./utils/Constants.js";

axios.defaults.withCredentials = true;

// --- 401 refresh logic without baseURL duplication ---
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

const isAuthPath = (url = "") => {
    try {
        const p = new URL(url, window.location.origin).pathname;
        return p.includes("/auth/");
    } catch {
        return String(url || "").includes("/auth/");
    }
};

axios.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error?.config || {};
        const status = error?.response?.status || 0;
        const url = original?.url || "";
        const alreadyRetried = Boolean(original._retry);

        // don’t try to refresh for auth endpoints or already retried/non-401
        if (status !== 401 || alreadyRetried || isAuthPath(url)) {
            return Promise.reject(error);
        }

        original._retry = true;

        if (isRefreshing) {
            try {
                await waitForRefresh();
                return axios(original);
            } catch (e) {
                if (window.location.pathname !== LOGIN_URL) {
                    window.location.replace(LOGIN_URL);
                }
                return Promise.reject(e);
            }
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
            if (window.location.pathname !== LOGIN_URL) {
                window.location.replace(LOGIN_URL);
            }
            return Promise.reject(e);
        }
    }
);
