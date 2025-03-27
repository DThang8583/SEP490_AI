import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Divider
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ExamPrep = () => {
  const theme = useTheme();

  const examData = {
    title: "Đề ôn tập Toán 5 - Phân số",
    questions: [
      {
        id: 1,
        question: "Một hình chữ nhật có chiều dài 8cm và chiều rộng bằng 3/4 chiều dài. Tính diện tích hình chữ nhật đó.",
        options: [
          "48 cm²",
          "24 cm²",
          "32 cm²",
          "64 cm²"
        ],
        correctAnswer: "48 cm²",
        explanation: "Chiều rộng = 8 × 3/4 = 6cm. Diện tích = 8 × 6 = 48 cm²"
      },
      {
        id: 2,
        question: "Một cửa hàng có 120kg gạo, đã bán 2/3 số gạo đó. Hỏi cửa hàng còn lại bao nhiêu kg gạo?",
        options: [
          "80kg",
          "40kg",
          "30kg",
          "60kg"
        ],
        correctAnswer: "40kg",
        explanation: "Số gạo đã bán = 120 × 2/3 = 80kg. Số gạo còn lại = 120 - 80 = 40kg"
      },
      {
        id: 3,
        question: "Một học sinh làm bài tập trong 45 phút. Thời gian học sinh đó làm đúng bài chiếm 4/5 thời gian. Hỏi học sinh đó làm đúng bài trong bao nhiêu phút?",
        options: [
          "36 phút",
          "9 phút",
          "30 phút",
          "15 phút"
        ],
        correctAnswer: "36 phút",
        explanation: "Thời gian làm đúng = 45 × 4/5 = 36 phút"
      },
      {
        id: 4,
        question: "Một miếng vải dài 24m, đã cắt đi 1/3 số vải. Hỏi còn lại bao nhiêu mét vải?",
        options: [
          "8m",
          "16m",
          "12m",
          "20m"
        ],
        correctAnswer: "16m",
        explanation: "Số vải đã cắt = 24 × 1/3 = 8m. Số vải còn lại = 24 - 8 = 16m"
      },
      {
        id: 5,
        question: "Một thùng chứa 60 lít dầu, đã dùng 3/5 số dầu đó. Hỏi còn lại bao nhiêu lít dầu?",
        options: [
          "24 lít",
          "36 lít",
          "40 lít",
          "20 lít"
        ],
        correctAnswer: "24 lít",
        explanation: "Số dầu đã dùng = 60 × 3/5 = 36 lít. Số dầu còn lại = 60 - 36 = 24 lít"
      }
    ]
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 12, pb: 8 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {examData.title}
        </Typography>

        {examData.questions.map((question, index) => (
          <Card
            key={question.id}
            sx={{
              mb: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              animation: `${fadeIn} 0.8s ease-out`,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  display: 'flex',
                  gap: 2,
                }}
              >
                <span style={{ color: '#FF6B6B' }}>Câu {question.id}:</span>
                {question.question}
              </Typography>

              <Box sx={{ mb: 3 }}>
                {question.options.map((option, optionIndex) => (
                  <Typography
                    key={optionIndex}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      borderRadius: 2,
                      backgroundColor: option === question.correctAnswer 
                        ? 'rgba(76, 175, 80, 0.1)'
                        : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {option === question.correctAnswer && (
                      <CheckCircle sx={{ color: 'success.main' }} />
                    )}
                    {option}
                  </Typography>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'success.main',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <CheckCircle />
                  Đáp án đúng: {question.correctAnswer}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: 'text.secondary' }}
                >
                  Giải thích: {question.explanation}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default ExamPrep;