import React from "react";
import { Box, Typography, Grid, Link } from "@mui/material";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const hideFooterPages = ["/Choice","/CreateLessonByChat","/CreateLesson","/Signup"]; 

  if (hideFooterPages.includes(location.pathname)) {
    return null; // Không hiển thị Footer trên trang này
  }

  return (
    <Box
      sx={{
        backgroundColor: "#06A9AE",
        color: "white",
        padding: "20px 50px",
        marginTop: "50px",
      }}
    >
      <Grid container spacing={3}>
        {/* Cột 1: Giới thiệu */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" fontWeight="bold">
            🎓 AI Learning
          </Typography>
          <Typography variant="body2">
            Nền tảng học toán thông minh giúp học sinh tiểu học tiếp cận kiến thức một cách dễ dàng và thú vị.
          </Typography>
        </Grid>

        {/* Cột 2: Liên kết nhanh */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" fontWeight="bold">
            🔗 Liên kết nhanh
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link href="/" color="inherit" underline="hover">
              Trang chủ
            </Link>
            <Link href="/CreateLesson" color="inherit" underline="hover">
              Tạo bài giảng
            </Link>
            <Link href="/about" color="inherit" underline="hover">
              Giới thiệu
            </Link>
          </Box>
        </Grid>

        {/* Cột 3: Liên hệ */}
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" fontWeight="bold">
            📞 Liên hệ
          </Typography>
          <Typography variant="body2">Email: support@ailearning.com</Typography>
          <Typography variant="body2">Hotline: 1800-123-456</Typography>
        </Grid>
      </Grid>

      {/* Dòng bản quyền */}
      <Box textAlign="center" marginTop="20px">
        <Typography variant="body2">© 2025 AI Learning. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
