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
            // Thêm dòng trống sau câu hỏi
            .replace(/([^A-D]\.\s*$)/g, '$1\n\n    ')
            // Đảm bảo A./B./C./D. xuống dòng mới và có khoảng trắng phù hợp
            .replace(/(?<!\n)([A-D]\.\s)/g, '\n\n    $1')
            // Đảm bảo "Đáp án đúng:" xuống dòng mới
            .replace(/(?<!\n)(Đáp án đúng:)/g, '\n$1')
            // Xóa dòng trống dư
            .replace(/\n{4,}/g, '\n\n')
            .trim();
    };

    const parseQuizContent = (content) => {
        const questions = [];
        // Tách các câu hỏi bằng số thứ tự câu
        const questionBlocks = content.split(/\d+\./).filter(block => block.trim());

        questionBlocks.forEach(block => {
            const lines = block.trim().split('\n');
            let questionName = '';
            const quizAnswers = [];
            let correctAnswerText = '';

            // Tìm dòng chứa đáp án đúng trong khối câu hỏi hiện tại
            const correctAnswerLines = lines.filter(line => {
                const trimmedLine = line.trim();
                return trimmedLine.startsWith('Đáp án đúng:');
            });

            // Lấy đáp án đúng cuối cùng trong khối câu hỏi
            if (correctAnswerLines.length > 0) {
                correctAnswerText = correctAnswerLines[correctAnswerLines.length - 1].trim();
            }

            // Lấy nội dung câu hỏi (bỏ qua các dòng chứa đáp án và đáp án đúng)
            questionName = lines
                .filter(line => {
                    const trimmedLine = line.trim();
                    return !trimmedLine.match(/^[A-D]\.\s/) && 
                           !trimmedLine.startsWith('Đáp án đúng:') &&
                           !trimmedLine.match(/^Đáp án đúng$/);
                })
                .join('\n')
                .trim();

            // Thu thập tất cả các lựa chọn trả lời (A, B, C, D)
            const answerOptions = lines
                .filter(line => {
                    const trimmedLine = line.trim();
                    return (trimmedLine.match(/^[A-D]\.\s/) || 
                           trimmedLine.match(/^[A-D]\./)) && 
                           !trimmedLine.startsWith('Đáp án đúng:');
                })
                .map(line => {
                    // Giữ nguyên công thức LaTeX trong đáp án
                    return line.trim();
                });

            // Kết hợp tất cả các lựa chọn thành một chuỗi
            const combinedAnswers = answerOptions.join('          ');

            // Thêm đáp án đúng ngay sau câu hỏi
            if (correctAnswerText) {
                quizAnswers.push({
                    answer: correctAnswerText,
                    isCorrect: true
                });
            }

            // Thêm các lựa chọn trả lời
            if (combinedAnswers) {
                quizAnswers.push({
                    answer: combinedAnswers,
                    isCorrect: false
                });
            }

            if (questionName || quizAnswers.length > 0) {
                questions.push({
                    questionName: questionName,
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

            if (response.data.code === 0 || response.data.code === 22) {
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