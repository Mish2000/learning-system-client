import PropTypes from "prop-types";
import { Box, Container, Typography, Card, Fade } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import QuestionGenerator from "./QuestionGenerator.jsx";
import { GET_DIRECTION } from "../../../utils/Constants.js";


function PracticePage() {
    const { t, i18n } = useTranslation();
    const dir = useMemo(() => GET_DIRECTION(i18n.language), [i18n.language]);

    return (
        <Fade in={true} timeout={600}>
            <Box
                component="section"
                lang={i18n.language}
                dir={dir}
                sx={{
                    minHeight: "calc(100vh - 80px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pt: { xs: 4, md: 8 },
                    pb: 4,
                    px: 2,
                }}
            >
                <Container maxWidth="md">
                    {/* Header Section */}
                    <Box sx={{ textAlign: "center", mb: 5 }}>
                        <Typography
                            variant="h3"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {t("timeToPractice")}
                        </Typography>
                    </Box>

                    {/* Generator Card */}
                    <Card
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 5 },
                            borderRadius: 4,
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: "background.paper",
                            // Ensure streamed math/steps render nicely inside if needed
                            "& .ai-output, & .steps-output": {
                                whiteSpace: "pre-wrap",
                                lineHeight: 1.6,
                            },
                        }}
                    >
                        {/* Pass UI language down; remount on language change to keep streams clean */}
                        <QuestionGenerator key={i18n.language} uiLanguage={i18n.language} onQuestionGenerated={null} />
                    </Card>
                </Container>
            </Box>
        </Fade>
    );
}

PracticePage.propTypes = {
    onLogout: PropTypes.func,
};

export default PracticePage;