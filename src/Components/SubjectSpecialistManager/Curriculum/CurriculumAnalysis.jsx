// src/Components/SubjectSpecialistManager/CurriculumAnalysis.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../../api';
import { Box, Typography, TextField, Button, CircularProgress, Tabs, Tab } from '@mui/material';

const CurriculumAnalysis = ({ sidebarOpen }) => {
    const [reportsByGrade, setReportsByGrade] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [proposal, setProposal] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    const sidebarWidth = sidebarOpen ? 60 : 240; // sidebarOpen = true: thu nhỏ, false: mở rộng

    const grades = [
        { id: 1, label: 'Grade 1' },
        { id: 2, label: 'Grade 2' },
        { id: 3, label: 'Grade 3' },
        { id: 4, label: 'Grade 4' },
        { id: 5, label: 'Grade 5' },
    ];

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const fetchedReports = await Promise.all(
                    grades.map(async (grade) => {
                        const res = await api.getReports({ grade: grade.id });
                        return { gradeId: grade.id, data: res.data };
                    })
                );
                setReportsByGrade(fetchedReports);
                setSelectedGrade(grades[0].id);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleGradeChange = (event, newValue) => {
        setSelectedGrade(newValue);
        setProposal('');
    };

    const handleSubmitProposal = async () => {
        if (!proposal.trim()) return;

        try {
            setSubmitLoading(true);
            await api.submitProposal({ grade: selectedGrade, proposal });
            setProposal('');
            alert('Proposal submitted successfully!');
        } catch (error) {
            console.error('Error submitting proposal:', error);
        } finally {
            setSubmitLoading(false);
        }
    };

    const selectedReport = reportsByGrade.find((r) => r.gradeId === selectedGrade);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1100,
            }}
        >
            <Box
                sx={{
                    py: 6,
                    px: 4,
                    ml: `${sidebarWidth}px`,
                    transition: 'margin-left 0.3s ease',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        mb: 5,
                        fontWeight: 700,
                        color: '#1a237e',
                        textAlign: 'center',
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 60,
                            height: 4,
                            backgroundColor: '#1a237e',
                            borderRadius: 2,
                        },
                    }}
                >
                    Curriculum Analysis
                </Typography>

                <Tabs
                    value={selectedGrade}
                    onChange={handleGradeChange}
                    sx={{
                        mb: 5,
                        '& .MuiTabs-indicator': {
                            height: 3,
                            borderRadius: 1.5,
                        },
                        '& .MuiTab-root': {
                            minWidth: 120,
                            fontSize: '1rem',
                            fontWeight: 600,
                            transition: 'all 0.2s',
                            '&:hover': {
                                color: '#1a237e',
                                transform: 'translateY(-2px)',
                            },
                        },
                    }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {grades.map((grade) => (
                        <Tab key={grade.id} label={grade.label} value={grade.id} />
                    ))}
                </Tabs>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                        <CircularProgress size={40} thickness={4} />
                    </Box>
                ) : selectedReport && selectedReport.data ? (
                    <Box
                        sx={{
                            mb: 5,
                            p: 4,
                            backgroundColor: 'white',
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                            },
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 4, fontWeight: 600 }}>
                            Analytics Overview - Grade {selectedGrade}
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            gap: 6,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}>
                            <Box sx={{
                                flex: 1,
                                minWidth: 240,
                                p: 3,
                                borderRadius: 2,
                                backgroundColor: '#f8f9fa',
                                textAlign: 'center',
                            }}>
                                <Typography color="text.secondary" sx={{ mb: 1, fontSize: '1.1rem' }}>
                                    Student Progress
                                </Typography>
                                <Typography
                                    variant="h3"
                                    color="primary"
                                    sx={{
                                        fontWeight: 700,
                                        background: 'linear-gradient(45deg, #1a237e, #3949ab)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {selectedReport.data.progress}%
                                </Typography>
                            </Box>
                            <Box sx={{
                                flex: 1,
                                minWidth: 240,
                                p: 3,
                                borderRadius: 2,
                                backgroundColor: '#f8f9fa',
                                textAlign: 'center',
                            }}>
                                <Typography color="text.secondary" sx={{ mb: 1, fontSize: '1.1rem' }}>
                                    Lesson Effectiveness
                                </Typography>
                                <Typography
                                    variant="h3"
                                    color="success.main"
                                    sx={{
                                        fontWeight: 700,
                                        background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {selectedReport.data.effectiveness}%
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ mx: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            No analytics available for Grade {selectedGrade}.
                        </Typography>
                    </Box>
                )}

                <Box
                    sx={{
                        p: 4,
                        backgroundColor: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        Improvement Proposal - Grade {selectedGrade}
                    </Typography>
                    <TextField
                        label="Propose Improvement"
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: '#1a237e',
                                },
                            },
                        }}
                        variant="outlined"
                    />
                    <Button
                        onClick={handleSubmitProposal}
                        variant="contained"
                        disabled={submitLoading || !proposal.trim() || !selectedGrade}
                        sx={{
                            px: 6,
                            py: 1.5,
                            textTransform: 'none',
                            borderRadius: 2,
                            background: 'linear-gradient(45deg, #1a237e, #3949ab)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 16px rgba(26,35,126,0.2)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #151b60, #2c3a8c)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.2s',
                        }}
                    >
                        {submitLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit Proposal'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default CurriculumAnalysis;