export const HOME_URL = "/home";
export const LOGIN_URL  = "/login";
export const REGISTER_URL = "/register";
export const PRACTICE_URL = "/practice";
export const PROFILE_URL = "/profile";

export const SERVER_URL = "/api";

export const DELETE_TOPIC_URL = "/admin_delete_topic";
export const GET_DIRECTION = (language) => (language === "he" ? "rtl" : "ltr");

// New post-login landing route
export const DASHBOARD_URL = "/dashboard";

// Back-compat alias: several components (e.g., NavBar) still import STATISTICS_URL
export const STATISTICS_URL = DASHBOARD_URL;

// Dedicated route for system administrator statistics
export const ADMIN_DASHBOARD_URL = "/admin-dashboard"