import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    Stack,
    Divider,
    useTheme,
    Alert,
    CircularProgress
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import axios from 'axios';

const GeneratedQuiz = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isDarkMode } = useCustomTheme();
    const theme = useTheme();

    // Get the generated content from location state
    const generatedContent = location.state?.content;
    const exerciseName = location.state?.exerciseName;
    const lessonId = location.state?.lessonId;

    console.log('GeneratedQuiz loaded.');
    console.log('generatedContent:', generatedContent);
    console.log('exerciseName:', exerciseName);
    console.log('lessonId:', lessonId);

    const [generatingSave, setGeneratingSave] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState('');
    const [saveError, setSaveError] = useState('');

    if (!generatedContent) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">Không tìm thấy nội dung bài tập</Alert>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mt: 2 }}
                >
                    Quay lại
                </Button>
            </Container>
        );
    }

    // Split content into questions
    const questions = generatedContent.split(/\d+\./).filter(q => q.trim());

    // Helper function to format the question text
    const formatQuestion = (text) => {
        return text
            // Đảm bảo A./B./C./D. xuống dòng mới
            .replace(/(?<!\n)([A-D]\.\s)/g, '\n$1')
            // Đảm bảo "Đáp án đúng:" xuống dòng mới
            .replace(/(?<!\n)(Đáp án đúng:)/g, '\n$1')
            // Xóa dòng trống dư
            .replace(/\n{2,}/g, '\n')
            .trim();
    };

    const parseQuizContent = (content) => {
        const questions = [];
        const questionBlocks = content.split(/\d+\./).filter(block => block.trim());

        questionBlocks.forEach(block => {
            const lines = block.trim().split('\n');
            let questionName = '';
            const quizAnswers = [];
            let correctAnswerText = '';

            lines.forEach(line => {
                const trimmedLine = line.trim();

                if (trimmedLine.match(/^[A-D]\.\s/)) {
                    // This is an answer option
                    const answerText = trimmedLine.substring(3).trim();
                    quizAnswers.push({ answer: answerText, isCorrect: false });
                } else if (trimmedLine.startsWith('Đáp án đúng:')) {
                    // This is the correct answer line
                    correctAnswerText = trimmedLine.substring('Đáp án đúng:'.length).trim();
                } else if (trimmedLine) {
                    // This is part of the question name
                    questionName += (questionName ? '\n' : '') + trimmedLine;
                }
            });

            // Mark the correct answer based on correctAnswerText
            const correctAnswerLetter = correctAnswerText.replace('Đáp án:', '').trim(); // Handle potential variations

            // Find the index of the correct answer option based on the letter (A, B, C, D)
            const correctAnswerIndex = quizAnswers.findIndex(answer => answer.answer.startsWith(correctAnswerLetter + '.'));

            if (correctAnswerIndex !== -1) {
                quizAnswers[correctAnswerIndex].isCorrect = true;
            }

            if (questionName || quizAnswers.length > 0) {
                 questions.push({
                    questionName: questionName.trim(),
                    quizAnswers: quizAnswers
                });
            }
        });

        return questions;
    };

    const handleSaveQuiz = async () => {
        setGeneratingSave(true);
        setSaveSuccess('');
        setSaveError('');
        const quizData = {
            quizName: exerciseName || 'Bài tập mới', // Use exerciseName if available, otherwise a default name
            lessonId: parseInt(lessonId), // Ensure lessonId is an integer
            quizQuestions: parseQuizContent(generatedContent),
        };

        console.log('Saving Quiz Data:', quizData);

        // Perform API call here
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error("Authentication token not found.");
            setSaveError('Authentication token not found. Please login again.');
            setGeneratingSave(false);
            return;
        }

        try {
            const response = await axios.post(
                'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/quizzes',
                quizData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.data.code === 0) {
                console.log('Quiz saved successfully:', response.data);
                setSaveSuccess('Bài tập đã được lưu thành công!');
                // Optionally navigate away or reset state after success
            } else {
                console.error('Failed to save quiz:', response.data.message);
                setSaveError(response.data.message || 'Đã xảy ra lỗi khi lưu bài tập.');
            }
        } catch (error) {
            console.error('Error saving quiz:', error);
            setSaveError('Đã xảy ra lỗi kết nối hoặc máy chủ.');
        } finally {
            setGeneratingSave(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                py: 4,
                background: isDarkMode
                    ? 'linear-gradient(135deg, rgb(18, 18, 18) 0%, rgb(30, 30, 30) 100%)'
                    : 'linear-gradient(135deg, rgb(245, 247, 250) 0%, rgb(255, 255, 255) 100%)',
            }}
        >
            <Container maxWidth="md">
                <Stack spacing={3}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => navigate(-1)}
                            sx={{
                                color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                                '&:hover': {
                                    backgroundColor: isDarkMode
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : 'rgba(0, 0, 0, 0.02)',
                                },
                            }}
                        >
                            Quay lại
                        </Button>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Bài tập trắc nghiệm
                        </Typography>
                        {generatedContent && lessonId && (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSaveQuiz}
                                disabled={generatingSave}
                                startIcon={generatingSave ? <CircularProgress size={20} color="inherit" /> : null}
                            >
                                {generatingSave ? 'Đang lưu...' : 'Lưu bài tập'}
                            </Button>
                        )}
                    </Box>

                    {/* Quiz Content */}
                    {saveSuccess && <Alert severity="success" sx={{ mb: 2 }}>{saveSuccess}</Alert>}
                    {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            backgroundColor: isDarkMode
                                ? 'rgba(30, 30, 30, 0.8)'
                                : 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                            borderRadius: '24px',
                            boxShadow: isDarkMode
                                ? '0 8px 32px rgba(0, 0, 0, 0.2)'
                                : '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Stack spacing={4}>
                            {/* Display Exercise Name */}
                            {exerciseName && (
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{
                                        mb: 3,
                                        color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(33, 33, 33)',
                                        fontWeight: 600,
                                        textAlign: 'center',
                                    }}
                                >
                                    {exerciseName}
                                </Typography>
                            )}

                            {questions.map((question, index) => (
                                <Box key={index}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 2,
                                            color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(33, 33, 33)',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Câu {index + 1}:
                                    </Typography>
                                    <Box
                                        sx={{
                                            pl: 2,
                                            color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                                            whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        {formatQuestion(question).split('\n').map((line, lineIndex) => {
                                            // Style the answer options differently
                                            if (line.match(/^[A-D]\./)) {
                                                return (
                                                    <Typography
                                                        key={lineIndex}
                                                        sx={{
                                                            pl: 2,
                                                            mb: 1,
                                                            color: isDarkMode ? 'rgb(200, 200, 200)' : 'rgb(80, 80, 80)',
                                                        }}
                                                    >
                                                        {line}
                                                    </Typography>
                                                );
                                            }
                                            // Style the "Đáp án:" line differently
                                            if (line.startsWith('Đáp án:')) {
                                                return (
                                                    <Typography
                                                        key={lineIndex}
                                                        sx={{
                                                            mt: 2,
                                                            mb: 1,
                                                            fontWeight: 600,
                                                            color: isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(33, 33, 33)',
                                                        }}
                                                    >
                                                        {line}
                                                    </Typography>
                                                );
                                            }
                                            // Regular question text
                                            return (
                                                <Typography key={lineIndex} sx={{ mb: 1 }}>
                                                    {line}
                                                </Typography>
                                            );
                                        })}
                                    </Box>
                                    {index < questions.length - 1 && (
                                        <Divider sx={{ mt: 3, opacity: 0.5 }} />
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Stack>
            </Container>
        </Box>
    );
};

export default GeneratedQuiz; 