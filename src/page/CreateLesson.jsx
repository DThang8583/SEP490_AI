import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
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
  const [semester, setSemester] = useState("");
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState("");

  const topics = {
    "1": {
      "Học kỳ 1": ["Các số từ 0 đến 10", "Làm quen với một số hình phẳng"],
      "Học kỳ 2": ["Phép cộng, phép trừ trong phạm vi 10", "Làm quen với một số hình khối"],
    },
  };

  const lessons = {
    "Các số từ 0 đến 10": [
      "Các số 0, 1, 2, 3, 4, 5",
      "Các số 6, 7, 8, 9, 10",
      "Nhiều hơn, ít hơn, bằng nhau",
      "So sánh số",
      "Mấy và mấy",
      "Luyện tập chung",
    ],
    "Làm quen với một số hình phẳng": [
      "Hình vuông, hình tròn, hình tam giác, hình chữ nhật",
      "Thực hành lắp ghép, xếp hình",
      "Luyện tập chung",
    ],
    "Phép cộng, phép trừ trong phạm vi 10": [
      "Phép cộng trong phạm vi 10",
      "Phép trừ trong phạm vi 10",
      "Bảng cộng, bảng trừ trong phạm vi 10",
      "Luyện tập chung",
    ],
    "Làm quen với một số hình khối": [
      "Khối lập phương, khối hộp chữ nhật",
      "Vị trí, định hướng trong không gian",
      "Luyện tập chung",
    ],
  };

  const generateLesson = async () => {
    if (!grade || !semester || !topic || !lesson) return;
    
    setLoading(true);
    setError("");

    const prompt = `Hãy tạo một bài giảng toán bằng tiếng Việt cho lớp ${grade}, ${semester} về chủ đề "${topic}" với bài học "${lesson}" theo cấu trúc sau:\n\n1. **Trải nghiệm**:\n- Mục đích của hoạt động này là tạo tâm thế, giúp học sinh ý thức được nhiệm vụ học tập. Giáo viên không nên thông báo ngay các kiến thức có sẵn mà cần tạo ra các tình huống gợi vấn đề để học sinh huy động kiến thức, kinh nghiệm của bản thân và suy nghĩ để tìm hướng giải quyết.\n\n2. **Hình thành kiến thức mới**:\n- Mục đích của hoạt động này nhằm giúp học sinh phát hiện, chiếm lĩnh được kiến thức và kỹ năng mới. Giáo viên sẽ giúp học sinh huy động kiến thức, chia sẻ và hợp tác trong học tập để xây dựng kiến thức mới.\n\n3. **Thực hành, Luyện tập**:\n- Mục đích của hoạt động này nhằm giúp học sinh củng cố và hoàn thiện kiến thức, kỹ năng vừa lĩnh hội và huy động, liên kết với kiến thức đã có để áp dụng vào giải quyết vấn đề.\n\n4. **Vận dụng**:\n- Mục đích của hoạt động này là giúp học sinh vận dụng các kiến thức và kỹ năng đã học vào giải quyết các vấn đề có tính chất thực tiễn. Bạn có thể đưa ra các câu hỏi hoặc dự án học tập nhỏ để học sinh thực hiện theo hoạt động cá nhân hoặc nhóm. Hoạt động này có thể được tổ chức ngoài giờ học chính khóa. Giáo viên cũng nên khuyến khích học sinh tiếp tục tìm tòi và mở rộng kiến thức sau khi kết thúc bài học.`;

    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/[#*]+/g, "");

      navigate("/AIRender", { state: { content: text } });
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
                      setSemester("");
                      setTopic("");
                      setLesson("");
                    }}
                    label="Chọn lớp"
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
                    <MenuItem value="1">Lớp 1</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {grade && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Chọn học kỳ</InputLabel>
                    <Select
                      value={semester}
                      onChange={(e) => {
                        setSemester(e.target.value);
                        setTopic("");
                        setLesson("");
                      }}
                      label="Chọn học kỳ"
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
                      {Object.keys(topics[grade]).map((sem) => (
                        <MenuItem key={sem} value={sem}>
                          {sem}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {semester && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Chọn chủ đề</InputLabel>
                    <Select
                      value={topic}
                      onChange={(e) => {
                        setTopic(e.target.value);
                        setLesson("");
                      }}
                      label="Chọn chủ đề"
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
                      {topics[grade][semester].map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {topic && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Chọn bài học</InputLabel>
                    <Select
                      value={lesson}
                      onChange={(e) => setLesson(e.target.value)}
                      label="Chọn bài học"
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
                      {lessons[topic].map((l) => (
                        <MenuItem key={l} value={l}>
                          {l}
                        </MenuItem>
                      ))}
                    </Select>
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
                  disabled={loading || !grade || !semester || !topic || !lesson}
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