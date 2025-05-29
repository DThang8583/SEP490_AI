import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from 'axios';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/quizzes/${id}`
        );
        
        if (response.data.code === 0) {
          setQuiz(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching quiz detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetail();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!quiz) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Không tìm thấy thông tin bài kiểm tra
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin/exams')}
        sx={{ mb: 3 }}
      >
        Quay lại
      </Button>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {quiz.quizName}
      </Typography>

      <List>
        {quiz.quizQuestions.map((question, index) => (
          <Card key={question.questionId} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Câu {index + 1}: {question.questionName}
              </Typography>
              
              <List>
                {question.quizAnswers.map((answer) => (
                  <React.Fragment key={answer.answerId}>
                    <ListItem>
                      <ListItemText
                        primary={answer.answer}
                        sx={{
                          color: answer.isCorrect ? 'success.main' : 'inherit',
                          fontWeight: answer.isCorrect ? 'bold' : 'normal'
                        }}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
      </List>
    </Box>
  );
};

export default QuizDetail; 