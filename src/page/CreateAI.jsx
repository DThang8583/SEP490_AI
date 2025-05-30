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
} from '@mui/material';
import {
  ArrowBack,
  AutoAwesome,
  Lightbulb,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { keyframes } from '@mui/system';
import axios from 'axios';

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const bubbleFloat = keyframes`
  0% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
`;

const gradientAnimation = keyframes`
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

const API_KEY = "AIzaSyDSf6v2-ynUdw6IS7Ac_2cSOJN7-g12c7k";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const CreateAI = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State cho việc chọn lớp, chủ đề và bài học
  const [grades, setGrades] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');

  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [promptData, setPromptData] = useState(null);

  // Fetch danh sách lớp khi component mount
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades');
        setGrades(response.data.data || []);
      } catch (err) {
        console.error('Error fetching grades:', err);
        setError('Không thể tải danh sách lớp. Vui lòng thử lại.');
        setGrades([]);
      }
    };
    fetchGrades();
  }, []);

  // Fetch danh sách chủ đề khi chọn lớp
  useEffect(() => {
    const fetchModules = async () => {
      if (selectedGrade) {
        try {
          const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades/${selectedGrade}/modules`);
          setModules(response.data.data.modules || []);
          setSelectedModule(''); // Reset module selection
          setSelectedLesson(''); // Reset lesson selection
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
    fetchModules();
  }, [selectedGrade]);

  // Fetch danh sách bài học khi chọn chủ đề
  useEffect(() => {
    const fetchLessons = async () => {
      if (selectedModule) {
        try {
          const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${selectedModule}/lessons`);
          setLessons(response.data.data.lessons || []);
          setSelectedLesson(''); // Reset lesson selection
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

  const handleGradeChange = (event) => {
    const value = event.target.value || '';
    setSelectedGrade(value);
  };

  const handleModuleChange = (event) => {
    const value = event.target.value || '';
    setSelectedModule(value);
  };

  const handleLessonChange = (event) => {
    const value = event.target.value || '';
    setSelectedLesson(value);
    if (value) {
      fetchPromptData(value);
    }
  };

  // New function to fetch prompt data
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
    if (!selectedGrade || !selectedModule || !selectedLesson || !promptData) {
      setError('Vui lòng chọn đầy đủ lớp, chủ đề và bài học');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Gọi API để lấy dữ liệu bài học
      const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${selectedLesson}`);
      const lessonData = response.data.data;

      // Tạo prompt với dữ liệu từ API
      const prompt = `Hãy tạo giáo án môn Toán lớp ${lessonData.gradeNumber} theo đúng chuẩn Thông tư 27 và Công văn 2345 của Bộ Giáo dục và Đào tạo Việt Nam. Bài học thuộc Chủ đề 1: ${lessonData.module}, có tiêu đề ${lessonData.name}. Giáo án gồm ba phần chính. Phần I – Yêu cầu cần đạt: trình bày rõ 2–3 năng lực đặc thù của môn Toán như ${lessonData.specialAbility}; 2–3 năng lực chung như ${lessonData.generalCapacity}; cùng 1–2 phẩm chất ${lessonData.quality}. Phần II – Đồ dùng dạy học: ${lessonData.schoolSupply}. Phần III – Các hoạt động dạy học chủ yếu: trình bày 4 hoạt động chính với thời lượng không vượt quá ${lessonData.duration} phút, mỗi hoạt động đều phải thể hiện rõ phần "HOẠT ĐỘNG CỦA GIÁO VIÊN" và "HOẠT ĐỘNG CỦA HỌC SINH". Cụ thể, A – Hoạt động MỞ ĐẦU (${lessonData.startUp.duration}): mục tiêu ${lessonData.startUp.goal}, HOẠT ĐỘNG CỦA GIÁO VIÊN: ${lessonData.startUp.teacherActivities}. HOẠT ĐỘNG CỦA HỌC SINH: ${lessonData.startUp.studentActivities}. B – Hoạt động HÌNH THÀNH KIẾN THỨC (${lessonData.knowLedge.duration}): ${lessonData.knowLedge.goal}, HOẠT ĐỘNG CỦA GIÁO VIÊN: ${lessonData.knowLedge.teacherActivities}. HOẠT ĐỘNG CỦA HỌC SINH: ${lessonData.knowLedge.studentActivities}. C – Hoạt động LUYỆN TẬP, THỰC HÀNH (${lessonData.practice.duration}): mục tiêu ${lessonData.practice.goal}, HOẠT ĐỘNG CỦA GIÁO VIÊN: ${lessonData.practice.teacherActivities}. HOẠT ĐỘNG CỦA HỌC SINH: ${lessonData.practice.studentActivities}. D – Hoạt động VẬN DỤNG, TRẢI NGHIỆM (${lessonData.apply.duration}): ${lessonData.apply.goal}, HOẠT ĐỘNG CỦA GIÁO VIÊN: ${lessonData.apply.teacherActivities}. HOẠT ĐỘNG CỦA HỌC SINH: ${lessonData.apply.studentActivities}.`;

      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/[#*]+/g, "");

      setSuccess('Đã tạo giáo án thành công!');
      
      // Chuyển hướng đến trang hiển thị kết quả
      navigate("/AIRender", { state: { content: text, lessonData: lessonData, promptId: promptData.promptId } });
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo giáo án. Vui lòng thử lại.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        py: 4,
      }}
    >
      {/* Animated Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? "linear-gradient(-45deg, #2C3E50, #3498DB, #2980B9, #1ABC9C)"
            : "linear-gradient(-45deg, #E0EAFC, #CFDEF3, #E0EAFC, #CFDEF3)",
          backgroundSize: "400% 400%",
          animation: `${gradientAnimation} 15s ease infinite`,
          zIndex: 0,
        }}
      />
      
      {/* Floating Bubbles */}
      {[...Array(5)].map((_, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            borderRadius: "50%",
            background: isDarkMode
              ? `rgba(52, 152, 219, ${Math.random() * 0.1})`
              : `rgba(44, 62, 80, ${Math.random() * 0.05})`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `${bubbleFloat} ${Math.random() * 10 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 0,
          }}
        />
      ))}

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={1000}>
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                color: isDarkMode ? "rgb(176, 176, 176)" : "rgb(102, 102, 102)",
                mb: 2,
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
                },
              }}
            >
              Quay lại
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AutoAwesome 
                sx={{ 
                  color: "#FF6B6B", 
                  mr: 2, 
                  fontSize: '2.5rem',
                  animation: `${float} 3s ease-in-out infinite`
                }} 
              />
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: isDarkMode ? "#ffffff" : "#2D3436",
                    mb: 1,
                  }}
                >
                  Tạo Giáo Án
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? "rgb(176, 176, 176)" : "rgb(102, 102, 102)",
                    maxWidth: "600px",
                  }}
                >
                  Chọn lớp, chủ đề và bài học để tạo giáo án
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

        <Zoom in timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: isDarkMode
                ? "rgba(30, 30, 30, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
              borderRadius: "24px",
              boxShadow: isDarkMode
                ? "0 8px 32px rgba(0, 0, 0, 0.2)"
                : "0 8px 32px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: isDarkMode
                  ? "0 12px 48px rgba(0, 0, 0, 0.3)"
                  : "0 12px 48px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Dropdown chọn lớp */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Lớp</InputLabel>
                    <Select
                      value={selectedGrade || ''}
                      onChange={handleGradeChange}
                      label="Lớp"
                      required
                      sx={{
                        backgroundColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.02)",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isDarkMode
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: isDarkMode
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(0, 0, 0, 0.2)",
                        },
                      }}
                    >
                      {grades.map((grade) => (
                        <MenuItem key={grade.gradeId} value={grade.gradeId || ''}>
                          Lớp {grade.gradeNumber}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Dropdown chọn chủ đề */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Chủ đề</InputLabel>
                    <Select
                      value={selectedModule || ''}
                      onChange={handleModuleChange}
                      label="Chủ đề"
                      required
                      disabled={!selectedGrade}
                      sx={{
                        backgroundColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.02)",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isDarkMode
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: isDarkMode
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(0, 0, 0, 0.2)",
                        },
                      }}
                    >
                      {modules.map((module) => (
                        <MenuItem key={module.moduleId} value={module.moduleId || ''}>
                          {module.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Dropdown chọn bài học */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Bài học</InputLabel>
                    <Select
                      value={selectedLesson || ''}
                      onChange={handleLessonChange}
                      label="Bài học"
                      required
                      disabled={!selectedModule}
                      sx={{
                        backgroundColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.02)",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isDarkMode
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: isDarkMode
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(0, 0, 0, 0.2)",
                        },
                      }}
                    >
                      {lessons.map((lesson) => (
                        <MenuItem key={lesson.lessonId} value={lesson.lessonId || ''}>
                          {lesson.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading || !selectedGrade || !selectedModule || !selectedLesson || !promptData || loadingPrompt}
                    startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
                    sx={{
                      backgroundColor: "#3498DB",
                      color: "#ffffff",
                      py: 1.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#2980B9",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(52, 152, 219, 0.3)",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.05)",
                        color: isDarkMode ? "rgb(176, 176, 176)" : "rgb(102, 102, 102)",
                      },
                    }}
                  >
                    {loading ? "Đang tạo giáo án..." : "Tạo giáo án"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Zoom>
      </Container>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess("")}
      >
        <Alert
          onClose={() => setSuccess("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateAI;
