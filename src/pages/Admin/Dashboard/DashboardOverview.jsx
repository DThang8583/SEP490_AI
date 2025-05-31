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
    {users.map((user) => (
      <React.Fragment key={user.userId}>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={user.imgURL}>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={user.fullname}
            secondary={user.role}
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>
        <Divider variant="inset" component="li" />
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
    pendingLessons: 0,
    approvedLessons: 0,
    rejectedLessons: 0,
    loading: true,
    error: null,
  });

  const fetchDashboardData = async () => {
    setStats(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Fetch total counts
      const usersTotalResponse = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users?Page=1&PageSize=999');
      const totalUsers = usersTotalResponse.data.code === 0 ? usersTotalResponse.data.data.totalRecords : 0;

      const lessonsResponse = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans?Page=1&PageSize=999');
      let totalLessons = 0;
      let pendingLessons = 0;
      let approvedLessons = 0;
      let rejectedLessons = 0;

      if (lessonsResponse.data?.code === 0 && lessonsResponse.data?.data?.items) {
        const allLessons = lessonsResponse.data.data.items;
        const nonDraftLessons = allLessons.filter(lesson => lesson.status !== 'Draft');
        totalLessons = nonDraftLessons.length;

        pendingLessons = allLessons.filter(lesson => lesson.status === 'Pending').length;
        approvedLessons = allLessons.filter(lesson => lesson.status === 'Approved').length;
        rejectedLessons = allLessons.filter(lesson => lesson.status === 'Rejected').length;
      }

      const examsResponse = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/quizzes?Page=1&PageSize=999');
      const totalExams = examsResponse.data.code === 0 ? examsResponse.data.data.totalRecords : 0;

      // Fetch recent users (first page)
      const recentUsersResponse = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users?Page=1&PageSize=10');
      const recentUsers = recentUsersResponse.data.code === 0 ? recentUsersResponse.data.data.items : [];

      setStats(prev => ({
        ...prev,
        totalUsers: totalUsers,
        totalLessons: totalLessons,
        totalExams: totalExams,
        recentUsers: recentUsers,
        pendingLessons: pendingLessons,
        approvedLessons: approvedLessons,
        rejectedLessons: rejectedLessons,
        loading: false,
      }));
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
            value={stats.totalUsers}
            icon={<GroupIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng số Giáo án"
            value={stats.totalLessons}
            icon={<MenuBookIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng số bài tập"
            value={stats.totalExams}
            icon={<QuizIcon />}
            color="info"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Tài khoản mới tham gia
            </Typography>
            <RecentUsersList users={stats.recentUsers} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Thống kê hoạt động
            </Typography>
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
                    {stats.approvedLessons}
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
                    {stats.pendingLessons}
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
                    {stats.rejectedLessons}
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