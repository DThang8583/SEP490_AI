import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Container,
  Paper,
  useTheme,
  IconButton,
  Skeleton
} from '@mui/material';
import { 
  PlayCircleOutline, 
  BookOutlined,
  CreateOutlined,
  StarOutline,
  ArrowBack
} from '@mui/icons-material';
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

const LessonDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(1);
  const [otherLessons, setOtherLessons] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        const response = await axios.get(`https://67c0f8e861d8935867e1970b.mockapi.io/AITools/${id}`);
        setLesson(response.data);
      } catch (error) {
        console.error('Error fetching lesson detail:', error);
      }
    };

    const fetchOtherLessons = async () => {
      try {
        const response = await axios.get('https://67c0f8e861d8935867e1970b.mockapi.io/AITools');
        setOtherLessons(response.data.filter(lesson => lesson.id !== id).slice(0, 3));
      } catch (error) {
        console.error('Error fetching other lessons:', error);
      }
    };

    fetchLessonDetail();
    fetchOtherLessons();
  }, [id]);

  const handleSelectDescription = (descNumber) => {
    setSelectedDescription(descNumber);
  };

  if (!lesson) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 4, borderRadius: 2 }} />
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={30} sx={{ mb: 4 }} />
        <Grid container spacing={4}>
          <Grid item xs={3}>
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} variant="rectangular" height={50} sx={{ mb: 2, borderRadius: 1 }} />
            ))}
          </Grid>
          <Grid item xs={9}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  const steps = [
    { number: 1, title: 'Trải nghiệm', icon: <PlayCircleOutline /> },
    { number: 2, title: 'Hình thành kiến thức mới', icon: <BookOutlined /> },
    { number: 3, title: 'Thực hành, Luyện tập', icon: <CreateOutlined /> },
    { number: 4, title: 'Vận dụng', icon: <StarOutline /> },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 12, pb: 8 }}>
        {/* Back button */}
        <Link to="/toan-so" style={{ textDecoration: 'none' }}>
          <Button
            startIcon={<ArrowBack />}
            sx={{
              mb: 4,
              color: theme.palette.text.primary,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
            }}
          >
            Quay lại danh sách
          </Button>
        </Link>

        {/* Lesson Title */}
        <Typography
          variant="h3"
          sx={{
            mb: 3,
            fontWeight: 800,
            background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            animation: `${fadeIn} 0.8s ease-out`,
          }}
        >
          {lesson.name}
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {/* Left Sidebar */}
          <Grid item xs={12} md={3}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              {/* Step Buttons */}
              <Paper elevation={0} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                {steps.map((step) => (
                  <Button
                    key={step.number}
                    fullWidth
                    startIcon={step.icon}
                    sx={{
                      py: 2,
                      px: 3,
                      justifyContent: 'flex-start',
                      borderRadius: 0,
                      borderLeft: selectedDescription === step.number ? '4px solid #FF6B6B' : 'none',
                      backgroundColor: selectedDescription === step.number 
                        ? 'rgba(255, 107, 107, 0.1)' 
                        : 'transparent',
                      color: selectedDescription === step.number ? '#FF6B6B' : theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 107, 0.05)',
                      },
                    }}
                    onClick={() => handleSelectDescription(step.number)}
                  >
                    {step.title}
                  </Button>
                ))}
              </Paper>

              {/* Other Lessons */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: theme.palette.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                      content: '""',
                      width: 4,
                      height: 24,
                      backgroundColor: '#FF6B6B',
                      marginRight: 2,
                      borderRadius: 2,
                    },
                  }}
                >
                  Bài học liên quan
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {otherLessons.map((otherLesson, index) => (
                    <Card
                      key={otherLesson.id}
                      component={Link}
                      to={`/LessonDetail/${otherLesson.id}`}
                      sx={{
                        display: 'flex',
                        borderRadius: 2,
                        overflow: 'hidden',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: 'none',
                        animation: `${fadeIn} 0.5s ease-out forwards`,
                        animationDelay: `${index * 0.1}s`,
                        opacity: 0,
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                          borderColor: '#FF6B6B',
                          '& .lesson-image': {
                            transform: 'scale(1.1)',
                          },
                          '& .lesson-title': {
                            color: '#FF6B6B',
                          },
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative', width: 100, height: 100, overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                          }}
                          className="lesson-image"
                          image={otherLesson.image}
                          alt={otherLesson.name}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                          }}
                        />
                      </Box>
                      <CardContent 
                        sx={{ 
                          flex: 1,
                          p: 2,
                          '&:last-child': { pb: 2 },
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          className="lesson-title"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            transition: 'color 0.3s ease',
                            mb: 1,
                          }}
                        >
                          {otherLesson.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                minHeight: 500,
                animation: `${fadeIn} 0.5s ease-out`,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: theme.palette.text.primary,
                }}
              >
                {lesson[`description${selectedDescription}`]}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LessonDetail;
