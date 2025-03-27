import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  Avatar,
  Divider
} from '@mui/material';
import {
  School,
  AutoAwesome,
  EmojiEvents,
  Support as SupportIcon,
  Lightbulb,
  Group
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Support = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <School sx={{ fontSize: 40, color: '#FF6B6B' }} />,
      title: "Học tập thông minh",
      description: "Tích hợp công nghệ AI để tạo ra trải nghiệm học tập cá nhân hóa cho mỗi học sinh."
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 40, color: '#FF6B6B' }} />,
      title: "Bài giảng AI",
      description: "Tự động tạo bài giảng phù hợp với trình độ và nhu cầu của học sinh."
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40, color: '#FF6B6B' }} />,
      title: "Đề ôn thi",
      description: "Cung cấp các đề ôn thi chất lượng với đáp án chi tiết và giải thích rõ ràng."
    },
    {
      icon: <Lightbulb sx={{ fontSize: 40, color: '#FF6B6B' }} />,
      title: "Phương pháp học tập",
      description: "Áp dụng các phương pháp học tập hiện đại, giúp học sinh tiếp thu kiến thức hiệu quả."
    }
  ];

  const team = [
    {
      name: "Nguyễn Văn A",
      role: "Giám đốc Sản phẩm",
      avatar: "NVA"
    },
    {
      name: "Trần Thị B",
      role: "Trưởng nhóm Phát triển",
      avatar: "TTB"
    },
    {
      name: "Lê Văn C",
      role: "Chuyên gia Giáo dục",
      avatar: "LVC"
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 12, pb: 8 }}>
        {/* Header Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 8,
            animation: `${fadeIn} 0.8s ease-out`,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Về Chúng Tôi
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            AI Math Tool là nền tảng học tập thông minh, kết hợp công nghệ AI với phương pháp giáo dục hiện đại,
            giúp học sinh phát triển tư duy toán học một cách hiệu quả và thú vị.
          </Typography>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  animation: `${fadeIn} 0.8s ease-out`,
                  animationDelay: `${index * 0.1}s`,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: 3,
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  {feature.icon}
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 2,
                      mb: 2,
                      fontWeight: 600,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Team Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
              color: theme.palette.text.primary,
            }}
          >
            Đội Ngũ Của Chúng Tôi
          </Typography>
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    animation: `${fadeIn} 0.8s ease-out`,
                    animationDelay: `${index * 0.1}s`,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      transition: 'transform 0.3s ease-in-out',
                      boxShadow: 3,
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        backgroundColor: '#FF6B6B',
                        fontSize: '1.5rem',
                      }}
                    >
                      {member.avatar}
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Section */}
        <Card
          sx={{
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            animation: `${fadeIn} 0.8s ease-out`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SupportIcon sx={{ fontSize: 40, color: '#FF6B6B', mr: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Liên Hệ Hỗ Trợ
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Thông Tin Liên Hệ
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Email: support@aimathtool.com
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Điện thoại: (84) 123-456-789
                </Typography>
                <Typography variant="body1">
                  Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Giờ Làm Việc
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Thứ 2 - Thứ 6: 8:00 - 17:00
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Thứ 7: 8:00 - 12:00
                </Typography>
                <Typography variant="body1">
                  Chủ nhật: Nghỉ
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Support; 