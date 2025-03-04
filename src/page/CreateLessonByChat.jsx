import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Box, TextField, IconButton, Typography, CircularProgress } from "@mui/material";
import { Send } from "@mui/icons-material"; // Import Icon Send
import backgroundImage from '../image/backgroundcreateLesson.jpg'; // Thêm đường dẫn ảnh nền

const API_KEY = "AIzaSyDSf6v2-ynUdw6IS7Ac_2cSOJN7-g12c7k"; // Sẽ thay sau
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const CreateLessonByChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const result = await model.generateContent(input);
      let text = result.response.text();
      // Loại bỏ các ký tự ## và **
      text = text.replace(/##/g, "").replace(/\**\*/g, "");
      const aiMessage = { sender: "ai", text };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [...prev, { sender: "ai", text: "Lỗi khi kết nối với AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${backgroundImage})`,  // Thêm backgroundImage
        minHeight: "100vh",
        p: 4,
        backgroundAttachment: "fixed", // Làm cho ảnh nền cố định khi cuộn trang
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", fontSize: "36px" }}>🎓 Chat AI Tạo Bài Giảng</Typography>
      
      {/* Tăng kích thước khung chat */}
      <Box sx={{ width: "90%", maxWidth: 800, height: 500, overflowY: "auto", backgroundColor: "white", p: 3, borderRadius: 2, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
        {messages.map((msg, index) => (
          <Typography
            key={index}
            sx={{
              textAlign: msg.sender === "user" ? "right" : "left",
              mb: 2,
              fontSize: "18px",
              color: msg.sender === "user" ? "black" : "black",
              whiteSpace: "pre-wrap", // Đảm bảo xuống dòng đúng
            }}
          >
            {msg.sender === "user" ? "Bạn: " : "AI: "}{msg.text}
          </Typography>
        ))}
      </Box>

      {/* Khung input và nút gửi */}
      <Box sx={{ display: "flex", flexDirection: "row", width: "90%", maxWidth: 860, mt: 3, alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Nhập câu hỏi về bài giảng..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{
            fontSize: "18px",
            padding: "12px", // Tăng kích thước chữ trong ô nhập liệu
            borderRadius: 1,
            marginRight: 2, // Khoảng cách giữa ô nhập liệu và nút gửi
            backgroundColor:'white'
          }}
        />
        <IconButton
          onClick={sendMessage}
          disabled={loading}
          sx={{
            fontSize: "24px", // Kích thước icon
            padding: "8px", // Khoảng cách xung quanh icon
            height: "100%",
            width: "auto",
            marginTop: "8px", // Đưa icon xuống dưới một chút
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : <Send sx={{ color: "black" }} />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default CreateLessonByChat;
