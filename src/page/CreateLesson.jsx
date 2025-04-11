import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Container,
  Fade,
  Zoom,
} from "@mui/material";
import {
  ArrowBack,
  School,
  AutoAwesome,
  Lightbulb,
  Book,
  EmojiEvents,
} from "@mui/icons-material";
import { useTheme } from '../context/ThemeContext';
import { keyframes } from '@mui/system';

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

const CreateLesson = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [grade, setGrade] = useState("");
  const [module, setModule] = useState("");
  const [lesson, setLesson] = useState("");
  
  // New state for API data
  const [grades, setGrades] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [loadingModules, setLoadingModules] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [promptData, setPromptData] = useState(null);

  // Fetch grades on component mount
  useEffect(() => {
    const fetchGrades = async () => {
      setLoadingGrades(true);
      try {
        const response = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades');
        if (response.data.code === 0) {
          setGrades(response.data.data);
        } else {
          setError("Không thể tải danh sách lớp học");
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
        setError("Có lỗi xảy ra khi tải danh sách lớp học");
      } finally {
        setLoadingGrades(false);
      }
    };

    fetchGrades();
  }, []);

  // Fetch modules when grade changes
  useEffect(() => {
    const fetchModules = async () => {
      if (!grade) {
        setModules([]);
        return;
      }

      setLoadingModules(true);
      try {
        const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades/${grade}/modules`);
        if (response.data.code === 0) {
          setModules(response.data.data.modules);
        } else {
          setError("Không thể tải danh sách chủ đề");
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
        setError("Có lỗi xảy ra khi tải danh sách chủ đề");
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, [grade]);

  // New useEffect for fetching lessons
  useEffect(() => {
    const fetchLessons = async () => {
      if (!module) {
        setLessons([]);
        return;
      }

      setLoadingLessons(true);
      try {
        const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${module}/lessons`);
        if (response.data.code === 0) {
          setLessons(response.data.data.lessons);
        } else {
          setError("Không thể tải danh sách bài học");
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setError("Có lỗi xảy ra khi tải danh sách bài học");
      } finally {
        setLoadingLessons(false);
      }
    };

    fetchLessons();
  }, [module]);

  const handleLessonChange = (e) => {
    const selectedLesson = lessons.find(l => l.lessonId === e.target.value);
    if (selectedLesson) {
      setLesson(e.target.value);
      // Store lessonId in localStorage
      localStorage.setItem('selectedLessonId', selectedLesson.lessonId);
      
      // Fetch prompt data when lesson is selected
      fetchPromptData(selectedLesson.lessonId);
    }
  };

  // New function to fetch prompt data
  const fetchPromptData = async (lessonId) => {
    setLoadingPrompt(true);
    try {
      const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lessonId}/prompt`);
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

  const generateLesson = async () => {
    if (!grade || !module || !lesson || !promptData) return;
    
    setLoading(true);
    setError("");

    const selectedGrade = grades.find(g => g.gradeId === grade);
    const selectedModule = modules.find(m => m.moduleId === module);
    const selectedLesson = lessons.find(l => l.lessonId === lesson);

    // Combine API description with fixed prompt structure
    const prompt = `${promptData.description}

Hãy tạo bài giảng theo đúng cấu trúc sau:

1. Mục tiêu:
   a) Năng lực đặc thù:
   - Năng lực tư duy và lập luận toán học
   - Năng lực mô hình hóa toán học
   - Năng lực giải quyết vấn đề toán học

   b) Năng lực chung:
   - Năng lực tự chủ và tự học
   - Năng lực giao tiếp và hợp tác
   - Năng lực giải quyết vấn đề và sáng tạo

   c) Phẩm chất:
    -học sinh chăm chỉ, trung thực, trách nhiệm trong học tập
2.Giáo viên chuẩn bị
   - Đồ dùng dạy học
   - Học liệu
  - Phương tiện dạy học
   - Công cụ đánh giá

3. Tiến trình bài giảng:
   a) Hoạt động 1: Hoạt động khởi động (5 phút)
   - Mục tiêu:
   - Cách tiến hành: (Hoạt động của giáo viên và học sinh)

   b) Hoạt động 2: Hoạt động hình thành kiến thức mới (12 phút)
   - Mục tiêu:
   - Cách tiến hành: (Hoạt động của giáo viên và học sinh. Nếu bài học này chủ yếu về tính toán, hãy đưa ra 1 ví dụ bài toán kèm giải thích từng bước.)

   c) Hoạt động 3: Hoạt động luyện tập thực hành (15 phút)
   - Mục tiêu:
   - Cách tiến hành: (Hoạt động của giáo viên và học sinh. Nếu bài học này chủ yếu về tính toán, hãy đưa ra 1-2 bài toán luyện tập kèm đáp án.)

   d) Hoạt động 4: Hoạt động vận dụng (3 phút)
   - Mục tiêu:
   - Cách tiến hành: (Hoạt động của giáo viên và học sinh. Nếu bài học này chủ yếu về tính toán, hãy đưa ra 1 bài toán vận dụng thực tế kèm đáp án.)

Lưu ý: Bạn PHẢI tuân thủ tuyệt đối cấu trúc trên. Không được thay đổi hoặc bỏ qua bất kỳ phần nào.`;

    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/[#*]+/g, "");

      // Pass promptId along with content in navigation state
      navigate("/AIRender", { state: { content: text, promptId: promptData.promptId } });
    } catch (error) {
      console.error("API Error:", error);
      setError("Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại.");
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
              onClick={() => navigate("/ChoiceChatorClick")}
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
              <School 
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
                  Tạo bài giảng nhanh
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? "rgb(176, 176, 176)" : "rgb(102, 102, 102)",
                    maxWidth: "600px",
                  }}
                >
                  Chọn các thông tin cần thiết để tạo bài giảng
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
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Chọn lớp</InputLabel>
                  <Select
                    value={grade}
                    onChange={(e) => {
                      setGrade(e.target.value);
                      setModule("");
                      setLesson("");
                    }}
                    label="Chọn lớp"
                    disabled={loadingGrades}
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
                    {grades.map((g) => (
                      <MenuItem key={g.gradeId} value={g.gradeId}>
                        Lớp {g.gradeNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {grade && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Chọn chủ đề</InputLabel>
                    <Select
                      value={module}
                      onChange={(e) => {
                        setModule(e.target.value);
                        setLesson("");
                      }}
                      label="Chọn chủ đề"
                      disabled={loadingModules}
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
                      {modules.map((m) => (
                        <MenuItem key={m.moduleId} value={m.moduleId}>
                          {m.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {module && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Chọn bài học</InputLabel>
                    <Select
                      value={lesson}
                      onChange={handleLessonChange}
                      label="Chọn bài học"
                      disabled={loadingLessons}
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
                      {lessons.map((l) => (
                        <MenuItem key={l.lessonId} value={l.lessonId}>
                          {l.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {loadingLessons && (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          right: 16,
                          marginTop: "-12px",
                          color: isDarkMode ? "#ffffff" : "#2D3436",
                        }}
                      />
                    )}
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Lightbulb sx={{ color: "#3498DB", mr: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDarkMode ? "rgb(176, 176, 176)" : "rgb(102, 102, 102)",
                    }}
                  >
                    AI sẽ tạo bài giảng theo cấu trúc chuẩn cho bạn
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={generateLesson}
                  disabled={loading || !grade || !module || !lesson || !promptData || loadingPrompt}
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
                  {loading ? "Đang tạo bài giảng..." : "Tạo bài giảng"}
                </Button>
              </Grid>
            </Grid>
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
    </Box>
  );
};

export default CreateLesson;