import { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import TopicManagementPage from "./TopicManagementPage.jsx";
import { useTranslation } from "react-i18next";
import AdminDashboardSSE from "./AdminDashboardSSE.jsx";

export default function AdminSectionPage() {
    const { t } = useTranslation();
    const [tab, setTab] = useState(0);

    return (
        <Box
            sx={{
                p: 4,
                minHeight: "100vh",
                overflowY: "scroll",
                scrollbarGutter: "stable",
            }}
        >
            <Typography variant="h4" mb={2}>
                {t("adminSection")}
            </Typography>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label={t("adminDashboard")} />
                <Tab label={t("adminTopicManagement")} />
            </Tabs>

            {tab === 0 && <AdminDashboardSSE />}
            {tab === 1 && <TopicManagementPage />}
        </Box>
    );
}
