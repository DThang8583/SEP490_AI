import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Alert,
  Snackbar,
  Container,
  Fade,
  Zoom,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  AutoAwesome as AutoAwesomeIcon,
  Lightbulb as LightbulbIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Assignment as AssignmentIcon,
  Create as CreateIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(52, 152, 219, 0);
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
    filter: drop-shadow(0 0 5px rgba(52, 152, 219, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(52, 152, 219, 0.6));
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Styled Components
const MainContainer = styled(Box)(({ theme, isDarkMode }) => ({
  minHeight: '100vh',
  background: isDarkMode
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
  position: 'relative',
  overflow: 'hidden',
  paddingTop: '32px',
  paddingBottom: '32px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDarkMode
      ? 'radial-gradient(circle at 20% 80%, rgba(52, 152, 219, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

const BackButton = styled(Button)(({ theme, isDarkMode }) => ({
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(52, 152, 219, 0.2)',
  color: isDarkMode ? '#fff' : '#3498DB',
  fontWeight: 600,
  padding: '12px 24px',
  textTransform: 'none',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  marginBottom: '24px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)'
      : 'linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(52, 152, 219, 0.05) 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(52, 152, 219, 0.2)',
  },
}));

const HeaderCard = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '48px 32px',
  marginBottom: '32px',
  textAlign: 'center',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: isDarkMode
    ? '0 20px 40px rgba(0, 0, 0, 0.3)'
    : '0 20px 40px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeIn} 0.8s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(52, 152, 219, 0.1), transparent)',
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const FloatingIcon = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  background: 'linear-gradient(135deg, #3498DB 0%, #5DADE2 100%)',
  marginBottom: '16px',
  animation: `${float} 3s ease-in-out infinite`,
  boxShadow: '0 12px 30px rgba(52, 152, 219, 0.4)',
  border: '4px solid rgba(255, 255, 255, 0.2)',
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    color: '#fff',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
  },
}));

const GradientTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: 'sans-serif',
  fontWeight: 800,
  fontSize: '2.5rem',
  background: isDarkMode
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
    : 'linear-gradient(135deg, #3498DB 0%, #5DADE2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: '16px',
  letterSpacing: '0.5px',
  textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
}));

const SubTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: 'sans-serif',
  fontSize: '1.25rem',
  fontWeight: 500,
  color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(52, 152, 219, 0.8)',
  marginBottom: '24px',
  letterSpacing: '0.3px',
  lineHeight: 1.6,
}));

const FormCard = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '32px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(52, 152, 219, 0.2)',
  boxShadow: isDarkMode
    ? '0 20px 40px rgba(0, 0, 0, 0.3)'
    : '0 20px 40px rgba(0, 0, 0, 0.1)',
  animation: `${slideInUp} 0.8s ease-out`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: isDarkMode
      ? '0 25px 50px rgba(0, 0, 0, 0.4)'
      : '0 25px 50px rgba(0, 0, 0, 0.15)',
  },
}));

const GradeInfoCard = styled(Card)(({ theme, isDarkMode }) => ({
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(52, 152, 219, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(52, 152, 219, 0.08) 0%, rgba(52, 152, 219, 0.04) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: isDarkMode
    ? '1px solid rgba(52, 152, 219, 0.2)'
    : '1px solid rgba(52, 152, 219, 0.1)',
  boxShadow: '0 8px 25px rgba(52, 152, 219, 0.1)',
  marginBottom: '24px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 35px rgba(52, 152, 219, 0.2)',
  },
}));

const GradeInfoContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '20px',
  '&:last-child': {
    paddingBottom: '20px',
  },
}));

const GradeIcon = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  background: 'linear-gradient(135deg, #3498DB 0%, #5DADE2 100%)',
  boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    color: '#fff',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme, isDarkMode }) => ({
  '& .MuiInputLabel-root': {
    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(52, 152, 219, 0.8)',
    fontWeight: 600,
  },
  '& .MuiOutlinedInput-root': {
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: isDarkMode
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(52, 152, 219, 0.2)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: isDarkMode
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(52, 152, 219, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3498DB',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)',
    },
    '& .MuiSelect-select': {
      color: isDarkMode ? '#fff' : '#2C3E50',
      fontWeight: 600,
    },
  },
}));

const CreateButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #3498DB 0%, #5DADE2 100%)',
  color: '#fff',
  borderRadius: '16px',
  padding: '16px 32px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1.1rem',
  boxShadow: '0 8px 25px rgba(52, 152, 219, 0.4)',
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
    background: 'linear-gradient(135deg, #2980B9 0%, #5DADE2 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(52, 152, 219, 0.5)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
  '&.Mui-disabled': {
    background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.3) 0%, rgba(93, 173, 226, 0.3) 100%)',
    color: 'rgba(255, 255, 255, 0.5)',
    boxShadow: 'none',
    animation: 'none',
  },
}));

const LoadingContainer = styled(Box)(({ theme, isDarkMode }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
    : 'linear-gradient(135deg, rgba(52, 152, 219, 0.05) 0%, rgba(52, 152, 219, 0.02) 100%)',
  borderRadius: '20px',
  backdropFilter: 'blur(20px)',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(52, 152, 219, 0.1)',
  animation: `${fadeIn} 0.8s ease-out`,
  marginTop: '24px',
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  color: '#3498DB',
  marginBottom: '16px',
  filter: 'drop-shadow(0 4px 8px rgba(52, 152, 219, 0.3))',
  animation: `${glow} 2s ease-in-out infinite`,
}));

const LoadingText = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: 'sans-serif',
  fontSize: '1.1rem',
  fontWeight: 600,
  color: isDarkMode ? '#fff' : '#3498DB',
  textAlign: 'center',
}));

const StyledAlert = styled(Alert)(({ theme, severity }) => ({
  borderRadius: '16px',
  backdropFilter: 'blur(20px)',
  border: severity === 'error' 
    ? '1px solid rgba(244, 67, 54, 0.2)' 
    : '1px solid rgba(76, 175, 80, 0.2)',
  boxShadow: severity === 'error'
    ? '0 8px 25px rgba(244, 67, 54, 0.1)'
    : '0 8px 25px rgba(76, 175, 80, 0.1)',
  fontWeight: 600,
}));

const FloatingBubble = styled(Box)(({ theme, size, top, left, delay, isDarkMode }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: isDarkMode
    ? `rgba(52, 152, 219, ${Math.random() * 0.1 + 0.05})`
    : `rgba(52, 152, 219, ${Math.random() * 0.08 + 0.02})`,
  top: top,
  left: left,
  animation: `${float} ${Math.random() * 8 + 8}s ease-in-out infinite`,
  animationDelay: delay,
  zIndex: 1,
  pointerEvents: 'none',
}));

const API_KEY = "AIzaSyDSf6v2-ynUdw6IS7Ac_2cSOJN7-g12c7k";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const CreatLesson = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { userInfo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State cho việc chọn lớp, chủ đề và bài học
  const [grades, setGrades] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [existingLessonPlans, setExistingLessonPlans] = useState([]);
  const [availableLessons, setAvailableLessons] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');

  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [promptData, setPromptData] = useState(null);

  // Fetch existing lesson plans for current user
  useEffect(() => {
    const fetchExistingLessonPlans = async () => {
      if (userInfo?.id && userInfo?.gradeId) {
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) return;

          const response = await axios.get(
            `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans?Page=1&PageSize=999&userId=${userInfo.id}&GradeId=${userInfo.gradeId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );

          if (response.data && response.data.code === 0) {
            const lessonPlans = response.data.data.items || [];
            setExistingLessonPlans(lessonPlans);
            console.log('Existing lesson plans:', lessonPlans);
          }
        } catch (err) {
          console.error('Error fetching existing lesson plans:', err);
        }
      }
    };

    fetchExistingLessonPlans();
  }, [userInfo?.id, userInfo?.gradeId]);

  // Filter available lessons based on existing lesson plans
  useEffect(() => {
    if (lessons.length > 0 && existingLessonPlans.length >= 0) {
      const existingLessonNames = existingLessonPlans.map(plan => plan.lesson);
      const filtered = lessons.filter(lesson => !existingLessonNames.includes(lesson.name));
      setAvailableLessons(filtered);
      console.log('Available lessons after filtering:', filtered);
      console.log('Existing lesson names:', existingLessonNames);
      
      // Reset selected lesson if it's no longer available
      if (selectedLesson && !filtered.find(lesson => lesson.lessonId === selectedLesson)) {
        setSelectedLesson('');
        setPromptData(null);
      }
    } else {
      setAvailableLessons(lessons);
    }
  }, [lessons, existingLessonPlans, selectedLesson]);

  // Fetch danh sách chủ đề khi chọn lớp
  useEffect(() => {
    const fetchModules = async () => {
      const gradeToFetch = userInfo?.gradeId;
      console.log("Fetching modules for gradeId from userInfo:", gradeToFetch);
      if (gradeToFetch) {
        try {
          console.log("API Call: Fetching modules from URL:", `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades/${gradeToFetch}/modules`);
          const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades/${gradeToFetch}/modules`);
          console.log("Fetched modules:", response.data.data.modules);
          setModules(response.data.data.modules || []);
          setSelectedModule('');
          setSelectedLesson('');
        } catch (err) {
          console.error('Error fetching modules:', err);
          setError('Không thể tải danh sách chủ đề. Vui lòng thử lại.');
          setModules([]);
        }
      } else {
        setModules([]);
        setSelectedModule('');
        setSelectedLesson('');
      }
    };

    if (userInfo?.gradeId) {
      fetchModules();
    }
  }, [userInfo?.gradeId]);

  // Fetch danh sách bài học khi chọn chủ đề
  useEffect(() => {
    const fetchLessons = async () => {
      if (selectedModule) {
        try {
          const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${selectedModule}/lessons`);
          setLessons(response.data.data.lessons || []);
          setSelectedLesson('');
        } catch (err) {
          console.error('Error fetching lessons:', err);
          setError('Không thể tải danh sách bài học. Vui lòng thử lại.');
          setLessons([]);
        }
      } else {
        setLessons([]);
        setSelectedLesson('');
      }
    };
    fetchLessons();
  }, [selectedModule]);

  const handleLessonChange = (event) => {
    const value = event.target.value || '';
    setSelectedLesson(value);
    if (value) {
      fetchPromptData(value);
    }
  };

  const fetchPromptData = async (lessonId) => {
    setLoadingPrompt(true);
    try {
      const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lessonId}`);
      if (response.data.code === 0) {
        setPromptData(response.data.data);
        console.log("Prompt data fetched:", response.data.data);
      } else {
        setError("Không thể tải dữ liệu prompt");
      }
    } catch (error) {
      console.error("Error fetching prompt data:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu prompt");
    } finally {
      setLoadingPrompt(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedModule || !selectedLesson || !promptData) {
      setError('Vui lòng chọn đầy đủ lớp, chủ đề và bài học');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${selectedLesson}`);
      const lessonData = response.data.data;

      const prompt = `Hãy tạo giáo án môn Toán lớp ${lessonData.gradeNumber} theo đúng chuẩn Thông tư 27 và Công văn 2345 của Bộ Giáo dục và Đào tạo Việt Nam. Bài học thuộc Chủ đề 1: ${lessonData.module}, có tiêu đề ${lessonData.name}. Giáo án gồm ba phần chính. Phần I – Yêu cầu cần đạt: trình bày rõ 2–3 năng lực đặc thù của môn Toán như ${lessonData.specialAbility}; 2–3 năng lực chung như ${lessonData.generalCapacity}; cùng 1–2 phẩm chất ${lessonData.quality}. Phần II – Đồ dùng dạy học: ${lessonData.schoolSupply}. Phần III – Các hoạt động dạy học chủ yếu: trình bày 4 hoạt động chính với thời lượng không vượt quá ${lessonData.duration} phút, mỗi hoạt động đều phải thể hiện rõ phần "HOẠT ĐỘNG CỦA GIÁO VIÊN" và "HOẠT ĐỘNG CỦA HỌC SINH". Cụ thể, A – Hoạt động MỞ ĐẦU (${lessonData.startUp.duration}): mục tiêu ${lessonData.startUp.goal}, HOẠT ĐỘNG CỦA GIÁO VIÊN: ${lessonData.startUp.teacherActivities}. HOẠT ĐỘNG CỦA HỌC SINH: ${lessonData.startUp.studentActivities}. B – Hoạt động HÌNH THÀNH KIẾN THỨC (${lessonData.knowLedge.duration}): ${lessonData.knowLedge.goal}, HOẠT ĐỘNG CỦA GIÁO VIÊN: ${lessonData.knowLedge.teacherActivities}. HOẠT ĐỘNG CỦA HỌC SINH: ${lessonData.knowLedge.studentActivities}. C – Hoạt động LUYỆN TẬP, THỰC HÀNH (${lessonData.practice.duration}): mục tiêu ${lessonData.practice.goal}, HOẠT ĐỘNG CỦA GIÁO VIÊN: ${lessonData.practice.teacherActivities}. HOẠT ĐỘNG CỦA HỌC SINH: ${lessonData.practice.studentActivities}. D – Hoạt động VẬN DỤNG, TRẢI NGHIỆM (${lessonData.apply.duration}): ${lessonData.apply.goal}, HOẠT ĐỘNG CỦA GIÁO VIÊN: ${lessonData.apply.teacherActivities}. HOẠT ĐỘNG CỦA HỌC SINH: ${lessonData.apply.studentActivities}.`;

      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/[#*]+/g, "");

      setSuccess('Đã tạo giáo án thành công!');
      
      navigate("/giao-an-da-tao", { state: { content: text, lessonId: selectedLesson, promptData: lessonData } });
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo giáo án. Vui lòng thử lại.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleChange = (event) => {
    const value = event.target.value || '';
    console.log("Module selected:", value);
    setSelectedModule(value);
  };

  return (
    <MainContainer isDarkMode={isDarkMode}>
      {/* Floating Bubbles */}
      {[...Array(8)].map((_, index) => (
        <FloatingBubble
          key={index}
          size={Math.random() * 80 + 40}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          delay={`${Math.random() * 5}s`}
          isDarkMode={isDarkMode}
        />
      ))}

      <StyledContainer maxWidth="lg">

        <Fade in timeout={1200}>
          <HeaderCard elevation={0} isDarkMode={isDarkMode}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FloatingIcon>
                <PsychologyIcon />
              </FloatingIcon>
              <GradientTitle isDarkMode={isDarkMode}>
                Tạo Giáo Án AI
              </GradientTitle>
              <SubTitle isDarkMode={isDarkMode}>
                Sử dụng trí tuệ nhân tạo để tạo ra giáo án chuyên nghiệp và hiệu quả
              </SubTitle>
            </Box>
          </HeaderCard>
        </Fade>

        <Zoom in timeout={1400}>
          <FormCard elevation={0} isDarkMode={isDarkMode}>
            {userInfo?.gradeId && (
              <GradeInfoCard isDarkMode={isDarkMode}>
                <GradeInfoContent>
                  <GradeIcon>
                    <SchoolIcon />
                  </GradeIcon>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700,
                      color: isDarkMode ? '#fff' : '#3498DB',
                      mb: 0.5
                    }}>
                      Lớp {userInfo.gradeId}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(52, 152, 219, 0.7)',
                      fontWeight: 500
                    }}>
                      Đã được chọn tự động
                    </Typography>
                  </Box>
                </GradeInfoContent>
              </GradeInfoCard>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StyledFormControl fullWidth isDarkMode={isDarkMode}>
                    <InputLabel>Chủ đề</InputLabel>
                    <Select
                      value={selectedModule || ''}
                      onChange={handleModuleChange}
                      label="Chủ đề"
                      required
                      disabled={!userInfo?.gradeId}
                    >
                      {modules.map((module) => (
                        <MenuItem key={module.moduleId} value={module.moduleId || ''}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MenuBookIcon sx={{ fontSize: '1.2rem', color: '#3498DB' }} />
                            {module.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledFormControl fullWidth isDarkMode={isDarkMode}>
                    <InputLabel>Bài học</InputLabel>
                    <Select
                      value={selectedLesson || ''}
                      onChange={handleLessonChange}
                      label="Bài học"
                      required
                      disabled={!selectedModule || availableLessons.length === 0}
                    >
                      {availableLessons.length === 0 && selectedModule ? (
                        <MenuItem value="" disabled>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                            <AssignmentIcon sx={{ fontSize: '1.2rem', color: '#999' }} />
                            Tất cả bài học đã có giáo án
                          </Box>
                        </MenuItem>
                      ) : (
                        availableLessons.map((lesson) => (
                          <MenuItem key={lesson.lessonId} value={lesson.lessonId || ''}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AssignmentIcon sx={{ fontSize: '1.2rem', color: '#3498DB' }} />
                              {lesson.name}
                            </Box>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </StyledFormControl>
                </Grid>

                {loadingPrompt && (
                  <Grid item xs={12}>
                    <LoadingContainer isDarkMode={isDarkMode}>
                      <LoadingSpinner size={40} />
                      <LoadingText isDarkMode={isDarkMode}>
                        Đang tải thông tin bài học...
                      </LoadingText>
                    </LoadingContainer>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <CreateButton
                    type="submit"
                    fullWidth
                    disabled={loading || !userInfo?.gradeId || !selectedModule || !selectedLesson || !promptData || loadingPrompt || availableLessons.length === 0}
                    startIcon={loading ? <LoadingSpinner size={20} /> : <CreateIcon />}
                  >
                    {availableLessons.length === 0 && selectedModule 
                      ? "Tất cả bài học đã có giáo án" 
                      : loading 
                        ? "Đang tạo giáo án..." 
                        : "Tạo giáo án với AI"
                    }
                  </CreateButton>
                </Grid>
              </Grid>
            </form>
          </FormCard>
        </Zoom>
      </StyledContainer>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <StyledAlert
          onClose={() => setError("")}
          severity="error"
        >
          {error}
        </StyledAlert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <StyledAlert
          onClose={() => setSuccess("")}
          severity="success"
        >
          {success}
        </StyledAlert>
      </Snackbar>
    </MainContainer>
  );
};

export default CreatLesson;
