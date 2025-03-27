import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  Chip
} from '@mui/material';
import { School, Timer, Assignment } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';

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

const ExamList = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const examList = [
    {
      id: 1,
      title: "Đề ôn tập Toán 5 - Phân số",
      grade: "Lớp 5",
      duration: "45 phút",
      subject: "Toán",
      topic: "Phân số",
      questionCount: 5
    },
    {
      id: 2,
      title: "Đề ôn tập Toán 5 - Hình học",
      grade: "Lớp 5",
      duration: "45 phút",
      subject: "Toán",
      topic: "Hình học",
      questionCount: 5
    },
    {
      id: 3,
      title: "Đề ôn tập Toán 5 - Số thập phân",
      grade: "Lớp 5",
      duration: "45 phút",
      subject: "Toán",
      topic: "Số thập phân",
      questionCount: 5
    },
    {
      id: 4,
      title: "Đề ôn tập Toán 5 - Đại lượng",
      grade: "Lớp 5",
      duration: "45 phút",
      subject: "Toán",
      topic: "Đại lượng",
      questionCount: 5
    }
  ];

  const handleExamClick = (examId) => {
    navigate(`/de-on-thi/${examId}`);
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
          Danh sách đề ôn thi
        </Typography>

        <Grid container spacing={3}>
          {examList.map((exam, index) => (
            <Grid item xs={12} sm={6} md={4} key={exam.id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  animation: `${fadeIn} 0.8s ease-out`,
                  animationDelay: `${index * 0.1}s`,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: 3,
                  }
                }}
              >
                <CardActionArea onClick={() => handleExamClick(exam.id)}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Assignment sx={{ color: '#FF6B6B' }} />
                      {exam.title}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<School />}
                        label={exam.grade}
                        size="small"
                        sx={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}
                      />
                      <Chip
                        icon={<Timer />}
                        label={exam.duration}
                        size="small"
                        sx={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}
                      />
                      <Chip
                        label={`${exam.questionCount} câu hỏi`}
                        size="small"
                        sx={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      Môn học: {exam.subject}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Chủ đề: {exam.topic}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ExamList; 