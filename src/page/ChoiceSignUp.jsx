import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ChoiceSignUp = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "teacher") {
      navigate("/teacher-dashboard");
    } else if (role === "coordinator") {
      navigate("/coordinator-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    }
  };

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
        Chọn vai trò của bạn để đăng nhập
      </Typography>

      <Box sx={{ display: "flex", gap: 3 }}>
        {/* Vai trò Giáo viên */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4caf50", // Màu cho Giáo viên
            fontSize: "18px",
            fontWeight: "bold",
            padding: "15px 30px",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#45a049" },
          }}
          onClick={() => handleRoleSelection("teacher")}
        >
          Giáo viên
        </Button>

        {/* Vai trò Người quản lý chuyên môn */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2196f3", // Màu cho Người quản lý chuyên môn
            fontSize: "18px",
            fontWeight: "bold",
            padding: "15px 30px",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#1e88e5" },
          }}
          onClick={() => handleRoleSelection("coordinator")}
        >
          Người quản lý chuyên môn
        </Button>

        {/* Vai trò Admin */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#f44336", // Màu cho Admin
            fontSize: "18px",
            fontWeight: "bold",
            padding: "15px 30px",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#e53935" },
          }}
          onClick={() => handleRoleSelection("admin")}
        >
          Admin
        </Button>
      </Box>
    </Box>
  );
};

export default ChoiceSignUp;
