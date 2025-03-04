import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Typography, TextField } from "@mui/material";

const AIRender = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialContent = location.state?.content || "";

  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initialContent);

  if (!initialContent) {
    navigate("/CreateLesson");
    return null;
  }

  const handleSaveDraft = () => {
    setDraft(content);
    alert("Đã lưu bản nháp thành công! 📝");
  };

  const handleSendToManager = () => {
    alert("Bài giảng đã được gửi cho người quản lý chuyên môn! 📩");
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        overflowY: "auto",
        p: 4,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#01579B", mb: 3, mt: 8 }}>
        📖 Bài Giảng Được Tạo
      </Typography>

      <Box
        sx={{
          width: "80%",
          maxWidth: "1200px",
          textAlign: "left",
        }}
      >
        {isEditing ? (
          <TextField
            multiline
            fullWidth
            rows={15}
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ fontSize: "1.2rem", lineHeight: "1.8", mb: 2 }}
          />
        ) : (
          <Typography variant="body1" sx={{ whiteSpace: "pre-line", fontSize: "1.2rem", lineHeight: "1.8" }}>
            {content}
          </Typography>
        )}
      </Box>

      {/* Bố cục nút: Quay lại bên trái - Các nút khác bên phải */}
      <Box sx={{ mt: 4, width: "80%", maxWidth: "1200px", display: "flex", justifyContent: "space-between" }}>
        {/* Nút Quay lại (bên trái) */}
        <Button
          variant="contained"
          sx={{ backgroundColor: "black", color: "white", fontSize: "1rem", padding: "10px 20px" }}
          onClick={() => navigate("/CreateLesson")}
        >
          Quay Lại
        </Button>

        {/* Các nút còn lại (bên phải) */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {isEditing ? (
            <Button
              variant="contained"
              sx={{ backgroundColor: "green", color: "white", fontSize: "1rem", padding: "10px 20px" }}
              onClick={() => setIsEditing(false)}
            >
              Lưu
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ backgroundColor: "#0288D1", color: "white", fontSize: "1rem", padding: "10px 20px" }}
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </Button>
          )}
          <Button
            variant="contained"
            sx={{ backgroundColor: "#FF8C00", color: "white", fontSize: "1rem", padding: "10px 20px" }}
            onClick={handleSaveDraft}
          >
            Lưu bản nháp
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#D32F2F", color: "white", fontSize: "1rem", padding: "10px 20px" }}
            onClick={handleSendToManager}
          >
            Gửi cho Quản lý chuyên môn
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AIRender;
