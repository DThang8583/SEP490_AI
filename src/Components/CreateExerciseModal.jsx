import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  CircularProgress,
  Alert,
  TextField,
  Paper,
  Avatar,
  Fade,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Assignment as AssignmentIcon,
  Speed as SpeedIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyDSf6v2-ynUdw6IS7Ac_2cSOJN7-g12c7k";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Animations
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

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(255, 107, 107, 0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const glow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(255, 107, 107, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(255, 107, 107, 0.6));
  }
`;

// Styled Components
const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
}));

const ModalContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '90%',
  maxWidth: '500px',
  maxHeight: '90vh',
  overflow: 'auto',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 107, 107, 0.2)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 25px 50px rgba(0, 0, 0, 0.5)'
    : '0 25px 50px rgba(0, 0, 0, 0.15)',
  outline: 'none',
  animation: `${slideInUp} 0.4s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.1), transparent)',
    animation: `${shimmer} 3s ease-in-out infinite`,
    borderRadius: '24px',
  },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  padding: '32px 32px 0 32px',
  textAlign: 'center',
  position: 'relative',
  zIndex: 2,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '16px',
  right: '16px',
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 107, 107, 0.7)',
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 107, 107, 0.05)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 107, 107, 0.1)',
    transform: 'scale(1.1)',
    color: '#FF6B6B',
  },
}));

const FloatingIcon = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  marginBottom: '16px',
  animation: `${float} 3s ease-in-out infinite`,
  boxShadow: '0 12px 30px rgba(255, 107, 107, 0.4)',
  border: '3px solid rgba(255, 255, 255, 0.2)',
  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
    color: '#fff',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
  },
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'sans-serif',
  fontWeight: 800,
  fontSize: '1.75rem',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
    : 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: '8px',
  letterSpacing: '0.5px',
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'sans-serif',
  fontSize: '0.95rem',
  fontWeight: 500,
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 107, 107, 0.7)',
  marginBottom: '24px',
  letterSpacing: '0.3px',
  lineHeight: 1.4,
}));

const ModalContent = styled(Box)(({ theme }) => ({
  padding: '0 32px 32px 32px',
  position: 'relative',
  zIndex: 2,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 107, 107, 0.8)',
    fontWeight: 600,
  },
  '& .MuiOutlinedInput-root': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(255, 107, 107, 0.2)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(255, 107, 107, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF6B6B',
      boxShadow: '0 0 0 3px rgba(255, 107, 107, 0.1)',
    },
    '& .MuiInputBase-input': {
      color: theme.palette.mode === 'dark' ? '#fff' : '#2C3E50',
      fontWeight: 600,
    },
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 107, 107, 0.8)',
    fontWeight: 600,
  },
  '& .MuiOutlinedInput-root': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(255, 107, 107, 0.2)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(255, 107, 107, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF6B6B',
      boxShadow: '0 0 0 3px rgba(255, 107, 107, 0.1)',
    },
    '& .MuiSelect-select': {
      color: theme.palette.mode === 'dark' ? '#fff' : '#2C3E50',
      fontWeight: 600,
    },
  },
}));

const CreateButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  color: '#fff',
  borderRadius: '16px',
  padding: '16px 32px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1rem',
  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  animation: `${pulse} 3s ease-in-out infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(255, 107, 107, 0.5)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
  '&.Mui-disabled': {
    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.3) 0%, rgba(255, 142, 83, 0.3) 100%)',
    color: 'rgba(255, 255, 255, 0.5)',
    boxShadow: 'none',
    animation: 'none',
  },
}));

const StyledAlert = styled(Alert)(({ theme, severity }) => ({
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
  border: severity === 'error' 
    ? '1px solid rgba(244, 67, 54, 0.2)' 
    : '1px solid rgba(76, 175, 80, 0.2)',
  boxShadow: severity === 'error'
    ? '0 4px 15px rgba(244, 67, 54, 0.1)'
    : '0 4px 15px rgba(76, 175, 80, 0.1)',
  fontWeight: 600,
  animation: `${fadeIn} 0.3s ease-out`,
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  color: '#fff',
  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
}));

const DifficultyChip = styled(Chip)(({ theme, selected }) => ({
  background: selected 
    ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
    : theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 107, 107, 0.05)',
  color: selected ? '#fff' : theme.palette.mode === 'dark' ? '#fff' : '#FF6B6B',
  fontWeight: 600,
  borderRadius: '12px',
  border: selected 
    ? 'none'
    : theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 107, 107, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    background: selected 
      ? 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)'
      : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 107, 107, 0.1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)',
  },
}));

const CreateExerciseModal = ({ open, handleClose, onQuizCreated }) => {
  const navigate = useNavigate();
  const [moduleId, setModuleId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [error, setError] = useState('');
  
  // State for AI generation
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [questionCount, setQuestionCount] = useState('5');

  // Get gradeId from localStorage
  const gradeId = (() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return userInfo?.gradeId || '';
  })();

  // Fetch Modules when modal opens
  useEffect(() => {
    if (open && gradeId) {
      const fetchModules = async () => {
        setLoadingModules(true);
        setError('');
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            throw new Error("Authentication token not found.");
          }
          const response = await axios.get(
            `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades/${gradeId}/modules`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          if (response.data.code === 0) {
            setModules(response.data.data.modules || []);
            setLessonId('');
            setLessons([]);
          } else {
            setError(response.data.message || `Failed to fetch modules for grade ${gradeId}.`);
            setModules([]);
            setLessonId('');
            setLessons([]);
          }
        } catch (err) {
          console.error(`Error fetching modules for grade ${gradeId}:`, err);
          setError(err.message || 'An error occurred while fetching modules.');
          setModules([]);
          setLessonId('');
          setLessons([]);
        } finally {
          setLoadingModules(false);
        }
      };
      fetchModules();
    } else if (open && !gradeId) {
      setError('Không tìm thấy thông tin lớp học.');
    }
  }, [open, gradeId]);

  // Fetch Lessons when module changes
  useEffect(() => {
    if (moduleId) {
      const fetchLessons = async () => {
        setLoadingLessons(true);
        setError('');
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            throw new Error("Authentication token not found.");
          }
          const response = await axios.get(
            `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${moduleId}/lessons`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          if (response.data.code === 0) {
            setLessons(response.data.data.lessons || []);
            setLessonId('');
          } else {
            setError(response.data.message || `Failed to fetch lessons for module ${moduleId}.`);
            setLessons([]);
            setLessonId('');
          }
        } catch (err) {
          console.error(`Error fetching lessons for module ${moduleId}:`, err);
          setError(err.message || 'An error occurred while fetching lessons.');
          setLessons([]);
          setLessonId('');
        } finally {
          setLoadingLessons(false);
        }
      };
      fetchLessons();
    } else {
      setLessons([]);
      setLessonId('');
      setExerciseName('');
    }
  }, [moduleId]);

  const handleModuleChange = (event) => {
    setModuleId(event.target.value);
    setLessonId('');
  };

  const handleLessonChange = (event) => {
    setLessonId(event.target.value);
  };

  const handleCreateExercise = async () => {
    if (!gradeId || !moduleId || !lessonId || !difficulty) {
      setError('Vui lòng chọn đầy đủ thông tin.');
      return;
    }

    console.log('Creating exercise with lessonId:', lessonId);

    setGenerating(true);
    setError('');
    setGenerationError('');

    const selectedModule = modules.find(m => m.moduleId === moduleId);
    const selectedLesson = lessons.find(l => l.lessonId === lessonId);

    if (!selectedModule || !selectedLesson) {
      setError('Không thể tìm thấy thông tin bài học.');
      setGenerating(false);
      return;
    }

    const moduleName = selectedModule.name;
    const lessonName = selectedLesson.name;

    const prompt = `Hãy tạo ${questionCount} câu hỏi trắc nghiệm môn Toán lớp ${gradeId} thuộc ${moduleName}, bài ${lessonName}, dựa theo kỹ thuật KWL. Không phân loại các câu hỏi theo K, W, L mà chỉ hiển thị danh sách câu hỏi trắc nghiệm liền mạch.\n\nMức độ câu hỏi: ${difficulty}.\n\nKhông sử dụng cụm \"chữ số\", chỉ dùng \"số\". Hạn chế các câu hỏi lý thuyết, ưu tiên các bài toán thực tế, gần gũi với học sinh tiểu học.\n\nMỗi câu hỏi bắt đầu bằng từ \"Câu\", ví dụ: \"Câu 1: …\". Mỗi câu có 5 phương án lựa chọn, trong đó chỉ có một đáp án đúng.\n\nViết mỗi phương án lựa chọn trên một dòng riêng biệt, theo định dạng:\n\nA. [phương án A]\n\nB. [phương án B]\n\nC. [phương án C]\n\nD. [phương án D]\n\nSau mỗi câu hỏi, ghi rõ đáp án đúng theo định dạng:\n\"Đáp án đúng: [chữ cái của đáp án]\"`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log('Generated Content:', text);

        navigate('/bai-tap-AI-tao', { state: { content: text, lessonId: lessonId, exerciseName: exerciseName } });

        handleClose();
        if (onQuizCreated) {
          onQuizCreated();
        }

    } catch (err) {
        console.error('Error generating quiz:', err);
        setGenerationError(err.message || 'Có lỗi xảy ra khi tạo bài tập.');
    } finally {
        setGenerating(false);
    }
};

  const difficultyOptions = [
    { value: 'dễ', label: 'Dễ', icon: <SpeedIcon /> },
    { value: 'trung bình', label: 'Trung bình', icon: <SpeedIcon /> },
    { value: 'khó', label: 'Khó', icon: <SpeedIcon /> },
    { value: 'kết hợp tăng dần độ khó', label: 'Kết hợp', icon: <SpeedIcon /> },
  ];

  const questionOptions = [
    { value: '3', label: '3 câu' },
    { value: '5', label: '5 câu' },
    { value: '10', label: '10 câu' },
    { value: '15', label: '15 câu' },
    { value: '20', label: '20 câu' },
  ];

  return (
    <StyledModal
      open={open}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={open}>
        <ModalContainer>
          <CloseButton onClick={handleClose}>
            <CloseIcon />
          </CloseButton>

          <ModalHeader>
            <FloatingIcon>
              <PsychologyIcon />
            </FloatingIcon>
            <GradientTitle>
              Tạo Bài Tập AI
            </GradientTitle>
            <SubTitle>
              Sử dụng trí tuệ nhân tạo để tạo bài tập chuyên nghiệp
            </SubTitle>
          </ModalHeader>

          <ModalContent>
            {error && <StyledAlert severity="error" sx={{ mb: 3 }}>{error}</StyledAlert>}
            {generationError && <StyledAlert severity="error" sx={{ mb: 3 }}>{generationError}</StyledAlert>}

        <Stack spacing={3}>
              <StyledTextField
              label="Tên bài tập"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              fullWidth
              size="small"
              disabled={generating}
                InputProps={{
                  startAdornment: <QuizIcon sx={{ mr: 1, color: '#FF6B6B' }} />,
                }}
            />

              {gradeId && (
                <Box sx={{
                  p: 2,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 142, 83, 0.1) 100%)',
                  border: '1px solid rgba(255, 107, 107, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <SchoolIcon sx={{ color: '#FF6B6B' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FF6B6B' }}>
                    Lớp {gradeId}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    (Đã được chọn tự động)
                  </Typography>
                </Box>
              )}

              <StyledFormControl fullWidth size="small" disabled={!gradeId || loadingModules || generating}>
                <InputLabel>Chọn Chủ đề</InputLabel>
            <Select
              value={moduleId}
              onChange={handleModuleChange}
                  label="Chọn Chủ đề"
                  startAdornment={<MenuBookIcon sx={{ mr: 1, color: '#FF6B6B' }} />}
            >
              {modules.map((module) => (
                    <MenuItem key={module.moduleId} value={module.moduleId}>
                      {module.name}
                    </MenuItem>
              ))}
            </Select>
              </StyledFormControl>

              <StyledFormControl fullWidth size="small" disabled={!moduleId || loadingLessons || generating}>
                <InputLabel>Chọn Bài học</InputLabel>
            <Select
              value={lessonId}
              onChange={handleLessonChange}
                  label="Chọn Bài học"
                  startAdornment={<AssignmentIcon sx={{ mr: 1, color: '#FF6B6B' }} />}
            >
              {lessons.map((lesson) => (
                    <MenuItem key={lesson.lessonId} value={lesson.lessonId}>
                      {lesson.name}
                    </MenuItem>
              ))}
            </Select>
              </StyledFormControl>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#FF6B6B' }}>
                  Độ khó
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {difficultyOptions.map((option) => (
                    <DifficultyChip
                      key={option.value}
                      label={option.label}
                      selected={difficulty === option.value}
                      onClick={() => !generating && setDifficulty(option.value)}
                      disabled={generating}
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#FF6B6B' }}>
                  Số lượng câu hỏi
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {questionOptions.map((option) => (
                    <DifficultyChip
                      key={option.value}
                      label={option.label}
                      selected={questionCount === option.value}
                      onClick={() => !generating && setQuestionCount(option.value)}
                      disabled={generating}
                    />
                  ))}
                </Stack>
              </Box>

              <CreateButton
                fullWidth
            onClick={handleCreateExercise}
            disabled={!lessonId || !difficulty || generating}
                startIcon={generating ? <LoadingSpinner size={20} /> : <AutoAwesomeIcon />}
          >
                {generating ? 'Đang tạo bài tập...' : 'Tạo bài tập với AI'}
              </CreateButton>
        </Stack>
          </ModalContent>
        </ModalContainer>
      </Fade>
    </StyledModal>
  );
};

export default CreateExerciseModal; 