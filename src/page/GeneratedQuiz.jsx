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

    const generatedContent = location.state?.content;
    const exerciseName = location.state?.exerciseName;
    const lessonId = location.state?.lessonId;

    console.log('Raw generatedContent:', JSON.stringify(generatedContent));
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

    const questions = generatedContent.split(/(?=Câu \d+:)/).filter(q => q.trim());

    const formatQuestion = (text) => {
        const lines = text.trim().split('\n').map(line => line.trim()).filter(line => line);
        const questionText = lines[0].trim();
        const answerLines = [];
        let correctAnswerLine = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.match(/^[A-D]\.\s*.+/)) {
                answerLines.push(line);
            } else if (line.startsWith('Đáp án đúng:') || line === 'Đáp án đúng') {
                if (line === 'Đáp án đúng' && i + 1 < lines.length && lines[i + 1].match(/^[A-D]\.\s*.+/)) {
                    correctAnswerLine = `Đáp án đúng: ${lines[i + 1].charAt(0)}`;
                } else {
                    correctAnswerLine = line;
                }
            }
        }

        const formatted = [
            questionText,
            ...answerLines.map(line => `    ${line}`),
            correctAnswerLine || '(Chưa có đáp án đúng)'
        ].filter(line => line).join('\n');

        return formatted;
    };

    const parseQuizContent = (content) => {
        const questions = [];
        const questionBlocks = content.split(/(?=Câu \d+:)/).filter(block => block.trim());
    
        questionBlocks.forEach(block => {
            const lines = block.trim().split('\n').map(line => line.trim()).filter(line => line);
            if (lines.length < 5) {
                console.warn(`Câu hỏi "${lines[0]}" không hợp lệ: thiếu đủ dòng (cần ít nhất 5).`);
                return;
            }
    
            const questionName = lines[0].replace(/^Câu \d+:/, '').trim();
            const quizAnswers = [];
            let correctAnswer = '';
            let correctAnswerText = '';
    
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];
                if (line.match(/^[A-D]\.\s*.+/)) {
                    quizAnswers.push({
                        answer: line.trim(),
                        isCorrect: false,
                    });
                } else if (line.startsWith('Đáp án đúng:') || line === 'Đáp án đúng') {
                    if (line === 'Đáp án đúng' && i + 1 < lines.length && lines[i + 1].match(/^[A-D]\.\s*.+/)) {
                        correctAnswer = lines[i + 1].charAt(0);
                        correctAnswerText = lines[i + 1].trim();
                    } else {
                        correctAnswer = line.replace('Đáp án đúng:', '').trim();
                        const matchingAnswer = quizAnswers.find(ans => ans.answer.charAt(0) === correctAnswer);
                        correctAnswerText = matchingAnswer ? matchingAnswer.answer : '';
                    }
                }
            }
    
            // Thêm dòng phân cách vào cuối quizAnswers
            quizAnswers.push({
                answer: '-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------',
                isCorrect: false,
            });
    
            if (quizAnswers.length !== 5) {  // Bây giờ phải có 5, vì thêm dòng phân cách
                console.warn(`Câu hỏi "${questionName}": Yêu cầu đúng 4 đáp án + 1 phân cách, hiện có ${quizAnswers.length}.`);
                // bạn có thể bỏ qua cảnh báo này nếu không muốn
            }
    
            if (correctAnswer) {
                const correctIndex = quizAnswers.findIndex(ans => ans.answer.startsWith(`${correctAnswer}.`));
                if (correctIndex !== -1) {
                    quizAnswers[correctIndex].isCorrect = true;
                } else {
                    console.warn(`Câu hỏi "${questionName}": Không tìm thấy đáp án đúng "${correctAnswer}".`);
                    return;
                }
            } else {
                console.warn(`Câu hỏi "${questionName}": Thiếu đáp án đúng hợp lệ.`);
                return;
            }
    
            questions.push({
                questionName,
                quizAnswers,
            });
        });
    
        return questions;
    };
    

    const handleSaveQuiz = async () => {
        setGeneratingSave(true);
        setSaveSuccess('');
        setSaveError('');

        const quizData = {
            quizName: exerciseName || 'Bài tập mới',
            lessonId: parseInt(lessonId) || 1,
            quizQuestions: parseQuizContent(generatedContent),
        };

        if (!quizData.lessonId || isNaN(quizData.lessonId)) {
            setSaveError('Mã bài học không hợp lệ.');
            setGeneratingSave(false);
            return;
        }
        if (quizData.quizQuestions.length === 0) {
            setSaveError('Không có câu hỏi nào được tạo.');
            setGeneratingSave(false);
            return;
        }
        const hasInvalidQuestions = quizData.quizQuestions.some(
            question => !question.quizAnswers.some(answer => answer.isCorrect)
        );
        if (hasInvalidQuestions) {
            setSaveError('Một số câu hỏi thiếu đáp án đúng hợp lệ.');
            setGeneratingSave(false);
            return;
        } 

        console.log('Quiz data trước khi gửi API:', JSON.stringify(quizData, null, 2));

        const token = localStorage.getItem('accessToken');
        if (!token) {
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

            if (response.data.code === 0 || response.data.code === 21) {
                setSaveSuccess('Bài tập đã được lưu thành công!');
            } else {
                setSaveError(response.data.message || 'Đã xảy ra lỗi khi lưu bài tập.');
            }
        } catch (error) {
            console.error('Lỗi API:', error.response?.data || error.message);
            setSaveError(error.response?.data?.message || 'Đã xảy ra lỗi kết nối hoặc máy chủ.');
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
                                    <Box
                                        sx={{
                                            pl: 2,
                                            color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                                            whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        {formatQuestion(question).split('\n').map((line, lineIndex) => {
                                            if (line.match(/^[A-D]\.\s*.+/)) {
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
                                            if (line.match(/Đáp án đúng:\s*[A-D]/) || line === '(Chưa có đáp án đúng)') {
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