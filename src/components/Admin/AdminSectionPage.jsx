import { useState } from "react";
import { Box, Tabs, Tab, Typography, Container, Fade, Card } from "@mui/material";
import TopicManagementPage from "./TopicManagementPage.jsx";
import { useTranslation } from "react-i18next";
import AdminDashboardSSE from "./AdminDashboardSSE.jsx";
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';

export default function AdminSectionPage() {
    const { t } = useTranslation();
    const [tab, setTab] = useState(0);

    return (
        <Fade in={true} timeout={600}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        {t("adminSection")}
                    </Typography>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        aria-label="admin tabs"
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab icon={<DashboardIcon />} iconPosition="start" label={t("adminDashboard")} />
                        <Tab icon={<CategoryIcon />} iconPosition="start" label={t("adminTopicManagement")} />
                    </Tabs>
                </Box>

                <Box sx={{ minHeight: '60vh' }}>
                    {tab === 0 && <AdminDashboardSSE />}
                    {tab === 1 && <TopicManagementPage />}
                </Box>
            </Container>
        </Fade>
    );
}