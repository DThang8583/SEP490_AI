import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import backgroundImage from "../image/backgroundcreateLesson.jpg";

const API_KEY = "AIzaSyDSf6v2-ynUdw6IS7Ac_2cSOJN7-g12c7k";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const CreateLesson = () => {
  const navigate = useNavigate();
  const [grade, setGrade] = useState("");
  const [semester, setSemester] = useState("");
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState("");
  const [loading, setLoading] = useState(false);

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

    // Prompt đầy đủ cho việc tạo bài giảng
    const prompt = `Hãy tạo một bài giảng toán bằng tiếng Việt cho lớp ${grade}, ${semester} về chủ đề "${topic}" với bài học "${lesson}" theo cấu trúc sau:\n\n1. **Trải nghiệm**:\n- Mục đích của hoạt động này là tạo tâm thế, giúp học sinh ý thức được nhiệm vụ học tập. Giáo viên không nên thông báo ngay các kiến thức có sẵn mà cần tạo ra các tình huống gợi vấn đề để học sinh huy động kiến thức, kinh nghiệm của bản thân và suy nghĩ để tìm hướng giải quyết.\n\n2. **Hình thành kiến thức mới**:\n- Mục đích của hoạt động này nhằm giúp học sinh phát hiện, chiếm lĩnh được kiến thức và kỹ năng mới. Giáo viên sẽ giúp học sinh huy động kiến thức, chia sẻ và hợp tác trong học tập để xây dựng kiến thức mới.\n\n3. **Thực hành, Luyện tập**:\n- Mục đích của hoạt động này nhằm giúp học sinh củng cố và hoàn thiện kiến thức, kỹ năng vừa lĩnh hội và huy động, liên kết với kiến thức đã có để áp dụng vào giải quyết vấn đề.\n\n4. **Vận dụng**:\n- Mục đích của hoạt động này là giúp học sinh vận dụng các kiến thức và kỹ năng đã học vào giải quyết các vấn đề có tính chất thực tiễn. Bạn có thể đưa ra các câu hỏi hoặc dự án học tập nhỏ để học sinh thực hiện theo hoạt động cá nhân hoặc nhóm. Hoạt động này có thể được tổ chức ngoài giờ học chính khóa. Giáo viên cũng nên khuyến khích học sinh tiếp tục tìm tòi và mở rộng kiến thức sau khi kết thúc bài học.`;

    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/[#*]+/g, ""); // Loại bỏ dấu ## và ** để làm sạch nội dung

      navigate("/AIRender", { state: { content: text } });
    } catch (error) {
      console.error("API Error:", error);
      navigate("/AIRender", { state: { content: "Lỗi khi kết nối với AI" } });
    } finally {
      setLoading(false);
    }
  };

  const backgroundCreateLesson = {
    backgroundImage: `url(${backgroundImage})`,
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: 4,
  };

  return (
    <Box sx={backgroundCreateLesson}>
      <Box
        sx={{
          maxWidth: 700,
          width: "100%",
          mt: 4,
          p: 4,
          borderRadius: 3,
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
          border: "2px solid #0288D1",
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#01579B", mb: 3 }}>
          📖 Tạo Bài Giảng Toán
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Chọn lớp</InputLabel>
          <Select value={grade} onChange={(e) => setGrade(e.target.value)}>
            <MenuItem value="1">Lớp 1</MenuItem>
          </Select>
        </FormControl>

        {grade && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Chọn học kỳ</InputLabel>
            <Select value={semester} onChange={(e) => setSemester(e.target.value)}>
              <MenuItem value="Học kỳ 1">Học kỳ 1</MenuItem>
              <MenuItem value="Học kỳ 2">Học kỳ 2</MenuItem>
            </Select>
          </FormControl>
        )}

        {semester && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Chọn chủ đề</InputLabel>
            <Select value={topic} onChange={(e) => setTopic(e.target.value)}>
              {topics[grade]?.[semester]?.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {topic && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Chọn bài học</InputLabel>
            <Select value={lesson} onChange={(e) => setLesson(e.target.value)}>
              {lessons[topic]?.map((l) => (
                <MenuItem key={l} value={l}>
                  {l}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={generateLesson}
          disabled={loading || !lesson}
          sx={{ backgroundColor: "#0288D1", color: "white", fontSize: "16px", fontWeight: "bold", borderRadius: 3 }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "✨ Tạo bài giảng"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateLesson;
