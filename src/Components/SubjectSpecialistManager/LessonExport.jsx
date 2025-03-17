// src/Components/SubjectSpecialistManager/LessonExport.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    List,
    ListItem,
    Button,
    Paper,
    Container,
    Grid,
    Divider,
} from '@mui/material';
import jsPDF from 'jspdf';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import { styled } from '@mui/material/styles';

const StyledListItem = styled(ListItem)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 12px rgba(0,0,0,0.12)',
    },
}));

const ExportButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1.2, 3),
    textTransform: 'none',
    marginRight: theme.spacing(2),
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    minWidth: 120,
    transition: 'all 0.2s ease',
    '&.Mui-selected': {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.main,
        borderRadius: theme.shape.borderRadius,
    },
}));

const LessonExport = ({ sidebarOpen }) => {
    const [lessonsByGrade, setLessonsByGrade] = useState([]); // Danh sách bài học theo khối lớp
    const [selectedGrade, setSelectedGrade] = useState(null); // Khối lớp được chọn

    const sidebarWidth = sidebarOpen ? 240 : 0; // Chiều rộng của Sidebar khi mở/đóng

    // Danh sách các khối lớp (Grade 1 đến Grade 5)
    const grades = [
        { id: 1, label: 'Grade 1' },
        { id: 2, label: 'Grade 2' },
        { id: 3, label: 'Grade 3' },
        { id: 4, label: 'Grade 4' },
        { id: 5, label: 'Grade 5' },
    ];

    // Lấy danh sách bài học đã được approved theo khối lớp
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const fetchedLessons = await Promise.all(
                    grades.map(async (grade) => {
                        // Giả sử API hỗ trợ lấy lessons theo grade
                        const res = await api.getLessons({ grade: grade.id });
                        // Chỉ lấy các bài học có trạng thái approved
                        return { gradeId: grade.id, lessons: res.data.filter((lesson) => lesson.status === 'approved') };
                    })
                );
                setLessonsByGrade(fetchedLessons);
                // Mặc định chọn khối lớp 1
                setSelectedGrade(grades[0].id);
            } catch (error) {
                console.error('Error fetching lessons:', error);
            }
        };
        fetchLessons();
    }, []);

    const handleGradeChange = (event, newValue) => {
        setSelectedGrade(newValue);
    };

    const exportToPDF = (lesson) => {
        const doc = new jsPDF();
        doc.text(`Title: ${lesson.title}`, 10, 10);
        doc.text(`Grade: ${lesson.grade}`, 10, 20);
        doc.text(`Class: ${lesson.className || 'N/A'}`, 10, 30);
        doc.text(`Teacher: ${lesson.teacherName || 'Unknown'}`, 10, 40);
        doc.text(`Content: ${lesson.content}`, 10, 50);
        doc.save(`${lesson.title}_Grade${lesson.grade}_Class${lesson.className || 'NA'}.pdf`);
    };

    const exportToWord = (lesson) => {
        const content = `
      <h1>${lesson.title}</h1>
      <p><strong>Grade:</strong> ${lesson.grade}</p>
      <p><strong>Class:</strong> ${lesson.className || 'N/A'}</p>
      <p><strong>Teacher:</strong> ${lesson.teacherName || 'Unknown'}</p>
      <p><strong>Content:</strong> ${lesson.content}</p>
    `;
        const blob = new Blob([content], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${lesson.title}_Grade${lesson.grade}_Class${lesson.className || 'NA'}.doc`;
        link.click();
    };

    // Lấy danh sách bài học cho khối lớp được chọn
    const selectedGradeLessons = lessonsByGrade.find((g) => g.gradeId === selectedGrade)?.lessons || [];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                py: 4,
                ml: `${sidebarWidth}px`,
                transition: 'margin-left 0.3s ease',
            }}
        >
            <Container maxWidth="lg">
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            mb: 4,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Lesson Export
                    </Typography>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                        <Tabs
                            value={selectedGrade}
                            onChange={handleGradeChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTabs-scrollButtons': {
                                    '&.Mui-disabled': { opacity: 0.3 },
                                },
                            }}
                        >
                            {grades.map((grade) => (
                                <StyledTab key={grade.id} label={grade.label} value={grade.id} />
                            ))}
                        </Tabs>
                    </Box>

                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                p: 2,
                                fontWeight: 700,
                                color: (theme) => theme.palette.primary.main,
                            }}
                        >
                            Approved Lessons - Grade {selectedGrade}
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        {selectedGradeLessons.length === 0 ? (
                            <Box
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    backgroundColor: (theme) => theme.palette.grey[50],
                                    borderRadius: 2,
                                }}
                            >
                                <Typography variant="body1" color="text.secondary">
                                    No approved lessons available for Grade {selectedGrade}.
                                </Typography>
                            </Box>
                        ) : (
                            <List>
                                {selectedGradeLessons.map((lesson) => (
                                    <StyledListItem key={lesson.id}>
                                        <Grid container alignItems="center" spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 600,
                                                        mb: 1
                                                    }}
                                                >
                                                    {lesson.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: (theme) => theme.palette.text.secondary,
                                                        display: 'flex',
                                                        gap: 2,
                                                    }}
                                                >
                                                    <span>👤 Teacher: {lesson.teacherName || 'Unknown'}</span>
                                                    <span>📚 Class: {lesson.className || 'N/A'}</span>
                                                    <span>📝 Grade: {lesson.grade}</span>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    gap: 2
                                                }}>
                                                    <ExportButton
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<PictureAsPdfIcon />}
                                                        onClick={() => exportToPDF(lesson)}
                                                    >
                                                        Export PDF
                                                    </ExportButton>
                                                    <ExportButton
                                                        variant="outlined"
                                                        color="primary"
                                                        startIcon={<DescriptionIcon />}
                                                        onClick={() => exportToWord(lesson)}
                                                    >
                                                        Export Word
                                                    </ExportButton>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </StyledListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Paper>
            </Container>
        </Box>
    );
};

export default LessonExport;