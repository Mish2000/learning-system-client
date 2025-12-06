import { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Typography,
    Link,
    Paper,
    useTheme,
    Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TerminalIcon from '@mui/icons-material/Terminal';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// --- Imports for Screenshots ---
import step1Img from '../../assets/ai-guide/step1.png';
import step2Img from '../../assets/ai-guide/step2.png';
import step3Img from '../../assets/ai-guide/step3.png';
import step4Img from '../../assets/ai-guide/step4.png';
import step5Img from '../../assets/ai-guide/step5.png';
import step6Img from '../../assets/ai-guide/step6.png';
import step7Img from '../../assets/ai-guide/step7.png';
import step7bImg from '../../assets/ai-guide/step7b.png'; // <--- New Import

function AiInstallationGuide({ open, onClose }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);

    // Map images to steps
    const steps = [
        {
            label: t('step1Label'),
            image: step1Img,
            description: (
                <>
                    <Typography variant="body2" gutterBottom>
                        {t('step1Desc')}
                    </Typography>
                    <Link
                        href="https://ollama.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
                    >
                        {t('step1LinkText')}
                    </Link>
                </>
            ),
        },
        {
            label: t('step2Label'),
            image: step2Img,
            description: t('step2Desc'),
        },
        {
            label: t('step3Label'),
            image: step3Img,
            description: t('step3Desc'),
        },
        {
            label: t('step4Label'),
            image: step4Img,
            description: t('step4Desc'),
        },
        {
            label: t('step5Label'),
            image: step5Img,
            description: (
                <Box>
                    <Typography variant="body2" component="span">
                        {t('step5Desc')}
                    </Typography>
                    <Paper
                        variant="outlined"
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 1,
                            py: 0.5,
                            mx: 0.5,
                            bgcolor: 'grey.100',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            border: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <TerminalIcon fontSize="small" color="primary" />
                        {t('step5Command')}
                    </Paper>
                    <Typography variant="body2" component="span">
                        {t('step5DescSuffix')}
                    </Typography>
                </Box>
            ),
        },
        {
            label: t('step6Label'),
            image: step6Img,
            description: t('step6Desc'),
        },
        {
            label: t('step7Label'),
            image: step7Img,
            description: t('step7Desc'),
        },
    ];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    // eslint-disable-next-line react/prop-types
    const StepImageRenderer = ({ image, stepIndex, placeholderLabel }) => {
        if (image) {
            return (
                <Box
                    component="img"
                    src={image}
                    alt={`Step ${stepIndex + 1}`}
                    sx={{
                        mt: 2,
                        mb: 2,
                        width: '100%',
                        maxHeight: 300,
                        objectFit: 'contain', // ensures image isn't distorted
                        bgcolor: 'background.paper',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        boxShadow: 1
                    }}
                />
            );
        }

        // Fallback Placeholder if image file is missing
        return (
            <Box
                sx={{
                    mt: 2,
                    mb: 2,
                    height: 150,
                    width: '100%',
                    bgcolor: 'action.hover',
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary',
                    flexDirection: 'column'
                }}
            >
                <Typography variant="caption" fontWeight="bold">
                    {placeholderLabel || `Screenshot Step ${stepIndex + 1}`}
                </Typography>
                <Typography variant="caption" fontSize="0.7rem">
                    (Image not found)
                </Typography>
            </Box>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            scroll="paper"
            maxWidth="md"
            fullWidth
            aria-labelledby="ai-setup-title"
        >
            <DialogTitle id="ai-setup-title" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                {t('aiSetupGuide')}
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                        {t('aiSetupTitle')}
                    </Typography>
                </Box>

                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {step.label}
                                </Typography>
                            </StepLabel>

                            <StepContent>
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ mb: 2 }}>{step.description}</Box>

                                    {/* Primary Image Rendering */}
                                    <StepImageRenderer image={step.image} stepIndex={index} />

                                    {index === 6 && (
                                        <StepImageRenderer
                                            image={step7bImg}
                                            stepIndex={index}
                                            placeholderLabel="Additional Screenshot"
                                        />
                                    )}

                                    <Box sx={{ mb: 2 }}>
                                        <Button
                                            variant="contained"
                                            onClick={index === steps.length - 1 ? onClose : handleNext}
                                            sx={{ mt: 1, mr: 1 }}
                                            size="small"
                                        >
                                            {index === steps.length - 1 ? t('aiSetupClose') : t('nextQuestion') || 'Next'}
                                        </Button>
                                        <Button
                                            disabled={index === 0}
                                            onClick={handleBack}
                                            sx={{ mt: 1, mr: 1 }}
                                            size="small"
                                        >
                                            {t('goBack') || 'Back'}
                                        </Button>
                                    </Box>
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>

                {activeStep === steps.length && (
                    <Paper square elevation={0} sx={{ p: 3 }}>
                        <Typography>{t('step7Desc')}</Typography>
                        <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                            {t('restore') || 'Reset'}
                        </Button>
                    </Paper>
                )}

                <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mt: 4 }}>
                    {t('aiModelNote')}
                </Alert>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {t('aiSetupClose')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

AiInstallationGuide.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default AiInstallationGuide;