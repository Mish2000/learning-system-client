import PropTypes from "prop-types";
import { Box, Typography, Stack, Card } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import QuestionGenerator from "./QuestionGenerator.jsx";
import { GET_DIRECTION } from "../../../utils/Constants.js";

function PracticePage({ onLogout }) {
    const { t, i18n } = useTranslation();

    const dir = useMemo(() => GET_DIRECTION(i18n.language), [i18n.language]);

    return (
        <Box
            component="section"
            lang={i18n.language}
            dir={dir}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 4,
                alignItems: "center",
                px: { xs: 1.5, sm: 2 },
            }}
        >
            <Typography variant="h3" mb={2}>
                {t("timeToPractice")}
            </Typography>

            <Stack spacing={4} sx={{ width: "100%", maxWidth: 900 }}>
                <Card
                    variant="outlined"
                    sx={{
                        p: { xs: 1.5, sm: 2 },
                        // Ensure streamed math/steps render nicely
                        "& .ai-output, & .steps-output": {
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.6,
                        },
                    }}
                >
                    {/* Pass UI language down; remount on language change to keep streams clean */}
                    <QuestionGenerator key={i18n.language} uiLanguage={i18n.language} onLogout={onLogout} />
                </Card>
            </Stack>
        </Box>
    );
}

PracticePage.propTypes = {
    onLogout: PropTypes.func,
};

export default PracticePage;

