import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ChoiceChatorClick = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#06A9AE",
        color: "white",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" fontWeight="bold" marginBottom={3}>
        Bạn muốn tạo bài giảng như thế nào? 🎓
      </Typography>

      <Box sx={{ display: "flex", gap: 3 }}>
        {/* Tạo bài giảng nhanh */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FFB400",
            fontSize: "18px",
            fontWeight: "bold",
            padding: "15px 30px",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#E09E00" },
          }}
          onClick={() => navigate("/CreateLesson")}
        >
          🚀 Tạo bài giảng nhanh
        </Button>

        {/* Tạo bài giảng theo ý muốn */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FF5733",
            fontSize: "18px",
            fontWeight: "bold",
            padding: "15px 30px",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#D94D2A" },
          }}
          onClick={() => navigate("/CreateLessonByChat")}
        >
          Tạo bài giảng theo ý muốn
        </Button>
      </Box>
    </Box>
  );
};

export default ChoiceChatorClick;
