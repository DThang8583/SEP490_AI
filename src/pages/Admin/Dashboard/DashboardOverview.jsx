import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Group as GroupIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Quiz as QuizIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from 'axios';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, mr: 2 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Box>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
          <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const RecentUsersList = ({ users }) => (
  <List>
    {users.map((user, index) => (
      <React.Fragment key={user.id}>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={user.avatar}>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={user.fullName}
            secondary={user.role}
            primaryTypographyProps={{ fontWeight: 500 }}
          />
          <Typography variant="caption" color="text.secondary">
            {user.joinDate}
          </Typography>
        </ListItem>
        {index < users.length - 1 && <Divider variant="inset" component="li" />}
      </React.Fragment>
    ))}
  </List>
);

const DashboardOverview = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSchools: 0,
    totalLessons: 0,
    totalExams: 0,
    recentUsers: [],
    loading: true,
    error: null,
  });

  const fetchDashboardData = async () => {
    setStats(prev => ({ ...prev, loading: true, error: null }));
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/dashboard/overview',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStats({
        ...response.data,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
      }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Mock data - thay thế bằng dữ liệu thực từ API
  const mockStats = {
    totalUsers: 1234,
    totalSchools: 56,
    totalLessons: 789,
    totalExams: 234,
    recentUsers: [
      { id: 1, fullName: 'Nguyễn Văn A', role: 'Giáo viên', joinDate: '2 giờ trước', avatar: '' },
      { id: 2, fullName: 'Trần Thị B', role: 'Học sinh', joinDate: '3 giờ trước', avatar: '' },
      { id: 3, fullName: 'Lê Văn C', role: 'Giáo viên', joinDate: '5 giờ trước', avatar: '' },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Tổng quan hệ thống
        </Typography>
        <Tooltip title="Làm mới dữ liệu">
          <IconButton onClick={fetchDashboardData}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {stats.loading && <LinearProgress sx={{ mb: 2 }} />}

      {stats.error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {stats.error}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng số tài khoản"
            value={mockStats.totalUsers}
            icon={<GroupIcon />}
            color="primary"
            subtitle="Tăng 12% so với tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng số trường học"
            value={mockStats.totalSchools}
            icon={<SchoolIcon />}
            color="success"
            subtitle="Tăng 5% so với tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng số Giáo án"
            value={mockStats.totalLessons}
            icon={<MenuBookIcon />}
            color="warning"
            subtitle="Tăng 8% so với tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng số đề thi"
            value={mockStats.totalExams}
            icon={<QuizIcon />}
            color="info"
            subtitle="Tăng 15% so với tháng trước"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Tài khoản mới tham gia
            </Typography>
            <RecentUsersList users={mockStats.recentUsers} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Thống kê hoạt động
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  Giáo án đã tạo trong tuần
                </Typography>
                <Typography variant="body2" color="primary.main" fontWeight={600}>
                  45 bài
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={75} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  mb: 1,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: theme.palette.primary.main,
                  }
                }} 
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Tăng 15% so với tuần trước
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="caption" color="success.main">
                    +15%
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Phân bố Giáo án Toán học
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Toán học</Typography>
                    <Typography variant="caption" fontWeight={600}>45 bài</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={100} 
                    sx={{ height: 6, borderRadius: 3, bgcolor: 'primary.light' }} 
                  />
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Trạng thái phê duyệt
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    flex: 1, 
                    p: 1.5, 
                    textAlign: 'center',
                    borderColor: 'success.light',
                    bgcolor: 'success.lighter'
                  }}
                >
                  <Typography variant="h6" color="success.main" sx={{ mb: 0.5 }}>
                    32
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Đã duyệt
                  </Typography>
                </Paper>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    flex: 1, 
                    p: 1.5, 
                    textAlign: 'center',
                    borderColor: 'warning.light',
                    bgcolor: 'warning.lighter'
                  }}
                >
                  <Typography variant="h6" color="warning.main" sx={{ mb: 0.5 }}>
                    8
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Chờ duyệt
                  </Typography>
                </Paper>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    flex: 1, 
                    p: 1.5, 
                    textAlign: 'center',
                    borderColor: 'error.light',
                    bgcolor: 'error.lighter'
                  }}
                >
                  <Typography variant="h6" color="error.main" sx={{ mb: 0.5 }}>
                    5
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Từ chối
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview; 