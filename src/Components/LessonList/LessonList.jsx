import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Grid, 
  TextField,
  Container,
  InputAdornment,
  useTheme,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import LessonDetail from './LessonDetail';

// Animation keyframes
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

const LessonList = () => {
  const [lessons, setLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState('all');
  const theme = useTheme();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get('https://67c0f8e861d8935867e1970b.mockapi.io/AITools');
        setLessons(response.data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, []);

  const handleGradeChange = (event, newGrade) => {
    setSelectedGrade(newGrade || 'all');
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || lesson.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          padding: { xs: 2, md: 4 },
          mt: 4,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
            animation: `${fadeIn} 0.8s ease-out`,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Khám phá bài học
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
          >
            Tìm hiểu và học tập với các bài giảng được thiết kế bởi AI
          </Typography>

          {/* Search and Filter Section */}
          <Box sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}>
            {/* Grade Filter */}
            <Box sx={{ mb: 3 }}>
              <ToggleButtonGroup
                value={selectedGrade}
                exclusive
                onChange={handleGradeChange}
                aria-label="grade filter"
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 1,
                  '& .MuiToggleButton-root': {
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    border: `1px solid ${theme.palette.divider}`,
                    '&.Mui-selected': {
                      backgroundColor: '#FF6B6B',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#FF5252',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    },
                  },
                }}
              >
                <ToggleButton value="all">
                  Tất cả
                </ToggleButton>
                {[1, 2, 3, 4, 5].map((grade) => (
                  <ToggleButton key={grade} value={`grade${grade}`}>
                    Lớp {grade}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            {/* Search Bar */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm bài giảng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Lessons Grid */}
        <Grid container spacing={4}>
          {filteredLessons.map((lesson, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={lesson.id}
              sx={{
                animation: `${fadeIn} 0.8s ease-out forwards`,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <Link to={`/LessonDetail/${lesson.id}`} style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    backgroundColor: theme.palette.background.paper,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', paddingTop: '60%' }}>
                    <CardMedia
                      component="img"
                      image={lesson.image}
                      alt={lesson.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  </Box>
                  <CardContent 
                    sx={{ 
                      flexGrow: 1,
                      textAlign: 'left',
                      p: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: theme.palette.text.primary,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {lesson.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {lesson.description || 'Khám phá bài học thú vị này ngay hôm nay!'}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              animation: `${fadeIn} 0.8s ease-out`,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Không tìm thấy bài học nào phù hợp
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default LessonList;
