import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ReasonPic1 from '../../image/Reason1.png';
import ReasonPic2 from '../../image/Reason2.jpg';

const Reason = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 100px',
        gap: '50px',
      }}
    >
      {/* Bên trái: Hình ảnh minh họa */}
      <Box sx={{ flex: 1, position: 'relative', width: '100%', maxWidth: '500px' }}>
        <Paper
          elevation={4}
          sx={{
            width: '100%',
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <img src={ReasonPic1} alt="reason" style={{ width: '100%', height: 'auto' }} />
        </Paper>

        <Paper
          elevation={6}
          sx={{
            width: '50%',
            borderRadius: '15px',
            overflow: 'hidden',
            position: 'absolute',
            bottom: '-40px',
            right: '-40px',
            zIndex: 2,
          }}
        >
          <img src={ReasonPic2} alt="reason" style={{ width: '100%', height: 'auto' }} />
        </Paper>
      </Box>

      {/* Bên phải: Nội dung mô tả */}
      <Box sx={{ flex: 1, paddingLeft: '50px' }}>
        <Typography variant="h6" color="#00cec9" fontWeight="bold">
          GIẢNG DẠY THÔNG MINH HƠN
        </Typography>
        <Typography variant="h3" fontWeight="bold" sx={{ margin: '10px 0' }}>
          Đơn giản hóa việc tạo bài giảng với AI
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '20px' }}>
          Tiết kiệm thời gian và nâng cao chất lượng bài giảng với công nghệ AI.  
          Chỉ cần nhập nội dung, hệ thống sẽ tự động tạo bài giảng hoàn chỉnh,  
          giúp bạn tập trung hơn vào việc giảng dạy và kết nối với học viên.  
        </Typography>

        {/* Danh sách lợi ích */}
        <Grid container spacing={2} sx={{ marginBottom: '30px' }}>
          {[
            { text: 'Tự động tạo bài giảng', color: '#FF6B6B' },
            { text: 'Chỉnh sửa dễ dàng', color: '#6A4C93' },
            { text: 'Hỗ trợ nhiều định dạng', color: '#FFA502' },
            { text: 'Tiết kiệm thời gian', color: '#1ABC9C' },
          ].map((item, index) => (
            <Grid item xs={6} key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ color: item.color, marginRight: '10px' }} />
              <Typography variant="body1" fontWeight="bold">{item.text}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Reason;
