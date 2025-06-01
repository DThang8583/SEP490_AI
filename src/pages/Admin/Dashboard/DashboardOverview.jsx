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
  Chip,
  Badge,
} from '@mui/material';
import {
  Group as GroupIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Quiz as QuizIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';

// Animations
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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
`;

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100vh',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1e1e2e 0%, #2d2d3d 50%, #1e1e2e 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(160, 82, 45, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 183, 77, 0.1) 0%, rgba(255, 167, 38, 0.05) 100%)',
  borderRadius: '20px',
  backdropFilter: 'blur(10px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(139, 69, 19, 0.2)'
    : '1px solid rgba(255, 183, 77, 0.2)',
  animation: `${fadeIn} 0.6s ease-out`,
}));

const StyledStatCard = styled(Card)(({ theme, color }) => ({
  height: '100%',
  background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
  border: `1px solid ${color}25`,
  borderRadius: '20px',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',
}));

const StyledAvatar = styled(Avatar)(({ color }) => ({
  width: 60,
  height: 60,
  background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
  fontSize: '1.5rem',
  marginRight: 16,
  boxShadow: `0 8px 25px ${color}40`,
}));

const ValueText = styled(Typography)(({ color }) => ({
  fontWeight: 700,
  fontSize: '2.5rem',
  background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: 4,
}));

const ModernPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  borderRadius: '20px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(42, 42, 55, 0.8) 0%, rgba(42, 42, 55, 0.4) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
  backdropFilter: 'blur(15px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s ease',
  animation: `${fadeIn} 1s ease-out`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  },
}));

const StatusCard = styled(Paper)(({ theme, statusColor }) => ({
  flex: 1,
  padding: theme.spacing(2),
  textAlign: 'center',
  borderRadius: '16px',
  background: `linear-gradient(135deg, ${statusColor}15 0%, ${statusColor}08 100%)`,
  border: `2px solid ${statusColor}30`,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: `linear-gradient(90deg, ${statusColor}, ${statusColor}80)`,
  },
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 10px 30px ${statusColor}25`,
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '12px',
  margin: '4px 0',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(102, 126, 234, 0.08)',
    transform: 'translateX(8px)',
  },
}));

const RefreshButton = styled(IconButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  padding: '12px',
  '&:hover': {
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    transform: 'scale(1.1)',
  },
  animation: `${pulse} 2s ease-in-out infinite`,
}));

const StatCard = ({ title, value, icon, color, subtitle, emoji }) => (
  <StyledStatCard color={color}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <StyledAvatar color={color}>
          {emoji || icon}
        </StyledAvatar>
        <Box sx={{ flex: 1 }}>
          <ValueText color={color}>
            {value}
          </ValueText>
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            opacity: 0.8,
          }}>
            {title}
          </Typography>
        </Box>
      </Box>
      {subtitle && (
        <Chip
          icon={<TrendingUpIcon />}
          label={subtitle}
          size="small"
          sx={{
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
            color: color,
            border: `1px solid ${color}30`,
            fontWeight: 600,
          }}
        />
      )}
    </CardContent>
  </StyledStatCard>
);

const RecentUsersList = ({ users }) => (
  <List sx={{ maxHeight: 400, overflow: 'auto' }}>
    {users.length === 0 ? (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" sx={{ mb: 1, opacity: 0.6 }}>
          👥 Chưa có người dùng mới
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Danh sách trống
        </Typography>
      </Box>
    ) : (
      users.map((user, index) => (
        <React.Fragment key={user.userId}>
          <StyledListItem sx={{
            animation: `${fadeIn} ${0.6 + index * 0.1}s ease-out`,
          }}>
            <ListItemAvatar>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Avatar sx={{ 
                    width: 20, 
                    height: 20, 
                    fontSize: '0.75rem',
                    background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
                  }}>
                    ✓
                  </Avatar>
                }
              >
                <Avatar 
                  src={user.imgURL}
                  sx={{
                    width: 50,
                    height: 50,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  <PersonIcon />
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user.fullname}
                </Typography>
              }
              secondary={
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    mt: 0.5,
                    background: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
                    color: '#fff',
                    fontWeight: 500,
                  }}
                />
              }
            />
          </StyledListItem>
          {index < users.length - 1 && (
            <Divider variant="inset" component="li" sx={{ opacity: 0.3 }} />
          )}
        </React.Fragment>
      ))
    )}
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
    <PageContainer>
      <HeaderSection>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            📊 Tổng quan hệ thống
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            color: 'text.secondary',
            fontWeight: 500,
          }}>
            🎓 Hệ thống quản lý giáo dục hiện đại
          </Typography>
        </Box>
        <Tooltip title="🔄 Làm mới dữ liệu" placement="left">
          <RefreshButton onClick={fetchDashboardData} disabled={stats.loading}>
            <RefreshIcon />
          </RefreshButton>
        </Tooltip>
      </HeaderSection>

      {stats.loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              background: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              },
            }} 
          />
        </Box>
      )}

      {stats.error && (
        <ModernPaper sx={{ mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            ⚠️ {stats.error}
          </Typography>
        </ModernPaper>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng số tài khoản"
            value={stats.totalUsers}
            icon={<GroupIcon />}
            color="#667eea"
            emoji="👥"
            subtitle="Người dùng hệ thống"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng số Giáo án"
            value={stats.totalLessons}
            icon={<MenuBookIcon />}
            color="#FF9800"
            emoji="📖"
            subtitle="Đã được tạo"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng số bài tập"
            value={stats.totalExams}
            icon={<QuizIcon />}
            color="#2196F3"
            emoji="📝"
            subtitle="Đã được tạo"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ModernPaper>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              🆕 Tài khoản mới tham gia
            </Typography>
            <RecentUsersList users={stats.recentUsers} />
          </ModernPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <ModernPaper>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              📈 Thống kê hoạt động
            </Typography>
            <Box>
              <Typography variant="subtitle1" sx={{ 
                mb: 2,
                fontWeight: 600,
                color: 'text.secondary',
              }}>
                📋 Trạng thái phê duyệt giáo án
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <StatusCard statusColor="#4CAF50">
                  <CheckCircleIcon sx={{ fontSize: 28, color: '#4CAF50', mb: 1 }} />
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700,
                    color: '#4CAF50',
                    mb: 0.5,
                  }}>
                    {stats.approvedLessons}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    ✅ Đã duyệt
                  </Typography>
                </StatusCard>
                <StatusCard statusColor="#FF9800">
                  <ScheduleIcon sx={{ fontSize: 28, color: '#FF9800', mb: 1 }} />
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700,
                    color: '#FF9800',
                    mb: 0.5,
                  }}>
                    {stats.pendingLessons}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    ⏳ Chờ duyệt
                  </Typography>
                </StatusCard>
                <StatusCard statusColor="#f44336">
                  <CancelIcon sx={{ fontSize: 28, color: '#f44336', mb: 1 }} />
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700,
                    color: '#f44336',
                    mb: 0.5,
                  }}>
                    {stats.rejectedLessons}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    ❌ Từ chối
                  </Typography>
                </StatusCard>
              </Box>
            </Box>
          </ModernPaper>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default DashboardOverview; 