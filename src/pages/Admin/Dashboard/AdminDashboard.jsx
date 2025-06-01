import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Tooltip,
  Avatar,
  Chip,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  MenuBook as MenuBookIcon,
  QuizOutlined as QuizIcon,
  ChevronLeft as ChevronLeftIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  NotificationsNone as NotificationIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import TotalAccounts from './TotalAccounts';
import TotalLessons from './TotalLessons';
import TotalExams from './TotalExams';
import DashboardOverview from './DashboardOverview';
import Schools from './Schools';
import CreateAccount from './CreateAccount';
import AdminProfile from './AdminProfile';
import QuizDetail from './QuizDetail';
import { useTheme as useThemeContext } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';

// Animations
const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
`;

// Styled Components
const StyledDrawer = styled(Box)(({ theme, isCollapsed, isDarkMode }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: isDarkMode 
    ? 'linear-gradient(145deg, #1e1e2e 0%, #2d2d3d 50%, #1e1e2e 100%)'
    : 'linear-gradient(145deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
  color: '#fff',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  width: isCollapsed ? 76 : 280,
  overflowX: 'hidden',
  position: 'relative',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDarkMode
      ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const LogoSection = styled(Box)(({ theme, isCollapsed }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: isCollapsed ? 'center' : 'flex-start',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  minHeight: '80px',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '0 0 20px 20px',
  margin: '0 8px 16px 8px',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
  },
}));

const StyledListItem = styled(ListItem)(({ theme, isActive, isCollapsed }) => ({
  borderRadius: '16px',
  margin: '4px 8px',
  padding: '12px 16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  background: isActive 
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
    : 'transparent',
  border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
  backdropFilter: isActive ? 'blur(10px)' : 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: isActive ? 0 : '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
    transform: isCollapsed ? 'scale(1.1)' : 'translateX(8px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

const IconContainer = styled(Box)(({ theme, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '12px',
  background: isActive 
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
    : 'rgba(255, 255, 255, 0.1)',
  marginRight: 16,
  transition: 'all 0.3s ease',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::after': {
    opacity: 1,
  },
}));

const ActionButton = styled(ListItem)(({ theme, isCollapsed }) => ({
  borderRadius: '16px',
  margin: '4px 8px',
  padding: '12px 16px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  color: '#2c3e50',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  boxShadow: '0 4px 15px rgba(255, 154, 158, 0.3)',
  animation: `${glow} 3s ease-in-out infinite`,
  '&:hover': {
    animation: `${pulse} 0.6s ease-in-out`,
    transform: 'scale(1.1)',
  },
}));

const VersionChip = styled(Chip)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  fontSize: '0.75rem',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    animation: `${float} 2s ease-in-out infinite`,
  },
}));

const MainContent = styled(Box)(({ theme, isCollapsed }) => ({
  flexGrow: 1,
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  marginTop: '64px',
  marginLeft: drawerWidth,
  padding: theme.spacing(3),
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'auto',
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at 10% 20%, rgba(14, 165, 233, 0.05) 0%, transparent 50%)'
      : 'radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.03) 0%, transparent 50%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const drawerWidth = 280;
const collapsedDrawerWidth = 76;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const isCollapsed = false; // Always expanded on desktop
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const menuItems = [
    { 
      text: 'Tổng quan', 
      icon: <DashboardIcon />, 
      path: '/admin',
      description: 'Xem tổng quan hệ thống',
    },
    { 
      text: 'Quản lý tài khoản', 
      icon: <GroupIcon />, 
      path: '/admin/quan-ly-tai-khoan',
      description: 'Quản lý người dùng hệ thống',
    },
    { 
      text: 'Quản lý giáo án', 
      icon: <MenuBookIcon />, 
      path: '/admin/quan-ly-giao-an',
      description: 'Quản lý nội dung giáo án',
    },
    { 
      text: 'Quản lý bài tập tạo', 
      icon: <QuizIcon />, 
      path: '/admin/quan-ly-bai-tap',
      description: 'Quản lý ngân hàng đề thi',
    },
    { 
      text: 'Quản lý trường học', 
      icon: <SchoolIcon />, 
      path: '/admin/quan-ly-truong',
      description: 'Quản lý thông tin trường học',  
    },
  ];

  const drawer = (
    <StyledDrawer isCollapsed={isCollapsed} isDarkMode={isDarkMode}>
      <LogoSection isCollapsed={isCollapsed}>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            width: '100%',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            transition: 'justify-content 0.4s',
        }} onClick={() => navigate('/admin')}>
          <StyledAvatar>
            <SchoolIcon />
          </StyledAvatar>
          <Box sx={{ 
            ml: 2, 
            opacity: isCollapsed ? 0 : 1,
            width: isCollapsed ? 0 : 'auto',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#fff',
                whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg, #fff 0%, #f0f8ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              🎓 Admin Panel
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                display: 'block',
                whiteSpace: 'nowrap',
              }}
            >
              Hệ thống quản lý giáo dục
            </Typography>
          </Box>
        </Box>
      </LogoSection>

      <List sx={{ 
        flex: 1, 
        px: 1,
        py: 2,
        animation: `${slideIn} 0.6s ease-out`,
      }}>
        {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
          <Tooltip 
            key={item.text}
            title={isCollapsed ? `${item.emoji} ${item.text}` : ''}
            placement="right"
            arrow
            sx={{
              '& .MuiTooltip-tooltip': {
                background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '0.875rem',
              },
            }}
          >
            <StyledListItem
              button
              component={Link}
              to={item.path}
              isActive={isActive}
              isCollapsed={isCollapsed}
              sx={{
                animation: `${slideIn} ${0.6 + index * 0.1}s ease-out`,
              }}
            >
              <IconContainer isActive={isActive}>
                {item.icon}
              </IconContainer>

              <Box sx={{
                opacity: isCollapsed ? 0 : 1,
                width: isCollapsed ? 0 : 'auto',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                <Typography 
                  variant="body1"
                  sx={{
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 600 : 500,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{item.emoji}</span>
                  {item.text}
                  {isActive && (
                    <Chip 
                      size="small" 
                      label="●" 
                      sx={{ 
                        minWidth: 8,
                        height: 8,
                        background: 'linear-gradient(135deg, #ff6b6b, #ffa500)',
                        color: 'transparent',
                      }} 
                    />
                  )}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    display: isActive ? 'block' : 'none',
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </StyledListItem>
          </Tooltip>
            );
        })}
      </List>

      <Box sx={{ p: 1 }}>
        <Tooltip
          title={isCollapsed ? (isDarkMode ? 'Chế độ sáng' : 'Chế độ tối') : ''}
          placement="right"
          arrow
        >
          <ActionButton
            button
            onClick={toggleTheme}
            isCollapsed={isCollapsed}
          >
            <IconContainer>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconContainer>
            <Box sx={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <Typography 
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
              </Typography>
            </Box>
          </ActionButton>
        </Tooltip>

        <Tooltip
          title={isCollapsed ? 'Thông tin cá nhân' : ''}
          placement="right"
          arrow
        >
          <ActionButton
            button
            onClick={() => navigate('/admin/profile')}
            isCollapsed={isCollapsed}
          >
            <IconContainer>
              <PersonIcon />
            </IconContainer>
            <Box sx={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <Typography 
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Thông tin cá nhân
              </Typography>
            </Box>
          </ActionButton>
        </Tooltip>

        <Tooltip
          title={isCollapsed ? '🚪 Đăng xuất' : ''}
          placement="right"
          arrow
        >
          <ActionButton
            button
            onClick={handleLogout}
            isCollapsed={isCollapsed}
            sx={{
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0.1) 100%)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.3) 0%, rgba(255, 107, 107, 0.2) 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
              },
            }}
          >
            <IconContainer>
              <LogoutIcon />
            </IconContainer>
            <Box sx={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <Typography 
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                🚪 Đăng xuất
              </Typography>
            </Box>
          </ActionButton>
        </Tooltip>
      </Box>

      <Box sx={{
        p: 2,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        gap: 1,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <VersionChip 
          label="v1.0.0" 
          size="small"
          sx={{
            opacity: isCollapsed ? 0 : 1,
            transform: isCollapsed ? 'scale(0)' : 'scale(1)',
            transition: 'all 0.3s ease',
          }}
        />
        <Badge 
          badgeContent={3} 
          color="error"
          sx={{
            opacity: isCollapsed ? 0 : 1,
            transform: isCollapsed ? 'scale(0)' : 'scale(1)',
            transition: 'all 0.3s ease',
          }}
        >
          <NotificationIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 20 }} />
        </Badge>
      </Box>
    </StyledDrawer>
  );

  return (
    <Box sx={{ display: 'flex' }}> 
      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          open={true}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              border: 'none',
              boxShadow: theme.shadows[10],
              mt: '64px',
              bgcolor: 'transparent',
              overflow: 'visible',
              width: drawerWidth,
              transition: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            border: 'none',
            boxShadow: theme.shadows[10],
            bgcolor: 'transparent',
          },
        }}
      >
        {drawer}
      </Drawer>

      <MainContent>
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/quan-ly-tai-khoan" element={<TotalAccounts />} />
          <Route path="/quan-ly-giao-an" element={<TotalLessons />} />
          <Route path="/quan-ly-bai-tap" element={<TotalExams />} />
          <Route path="/quan-ly-truong" element={<Schools />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/admin/exams/:id" element={<QuizDetail />} />
        </Routes>
      </MainContent>
    </Box>
  );
};

export default AdminDashboard; 