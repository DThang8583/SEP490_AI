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
} from '@mui/icons-material';
import TotalAccounts from './TotalAccounts';
import TotalLessons from './TotalLessons';
import TotalExams from './TotalExams';
import DashboardOverview from './DashboardOverview';
import AdminNavbar from '../../../Components/Admin/AdminNavbar';
import Schools from './Schools';
import CreateAccount from './CreateAccount';
import AdminProfile from './AdminProfile';
import QuizDetail from './QuizDetail';
import { useTheme as useThemeContext } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';

const drawerWidth = 280;
const collapsedDrawerWidth = 76;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMouseEnter = () => {!isMobile && setIsCollapsed(false)};
  const handleMouseLeave = () => {!isMobile && setIsCollapsed(true)};

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const menuItems = [
    {
      text: 'Tổng quan',
      icon: <DashboardIcon />,
      path: '/admin',
      description: 'Xem tổng quan hệ thống'
    },
    {
      text: 'Quản lý tài khoản',
      icon: <GroupIcon />,
      path: '/admin/quan-ly-tai-khoan',
      description: 'Quản lý người dùng hệ thống'
    },
    {
      text: 'Quản lý Giáo án',
      icon: <MenuBookIcon />,
      path: '/admin/quan-ly-giao-an',
      description: 'Quản lý nội dung Giáo án'
    },
    {
      text: 'Quản lý bài tập tạo',
      icon: <QuizIcon />,
      path: '/admin/quan-ly-bai-tap',
      description: 'Quản lý ngân hàng đề thi'
    },
    {
      text: 'Quản lý trường học',
      icon: <SchoolIcon />,
      path: '/admin/quan-ly-truong',
      description: 'Quản lý thông tin trường học'
    },
  ];

  const drawer = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: isDarkMode ? '#1E1E1E' : theme.palette.primary.main,
      color: '#fff',
      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      width: isMobile ? drawerWidth : (isCollapsed ? collapsedDrawerWidth : drawerWidth),
      overflowX: 'hidden',
    }}>
      <Box sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        borderBottom: `1px solid ${theme.palette.divider}`,
        minHeight: '64px',
        transition: 'justify-content 0.4s',
      }}>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            width: '100%',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            transition: 'justify-content 0.4s',
        }} onClick={() => navigate('/admin')}>
             <Avatar
                sx={{
                    bgcolor: isDarkMode ? theme.palette.background.default : theme.palette.background.paper,
                    color: isDarkMode ? theme.palette.primary.main : theme.palette.primary.main,
                    width: 40,
                    height: 40,
                    mr: isCollapsed ? 0 : 2,
                    transition: 'margin 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                }}
            >
                <SchoolIcon />
            </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#fff',
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.3s, width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Admin Panel
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)', my: 2 }} />

      <List sx={{
        flex: 1,
        px: isCollapsed ? 1 : 2,
        py: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCollapsed ? 'center' : 'flex-start',
        transition: 'padding 0.4s, alignItems 0.4s',
        overflowY: 'auto',
        '& .MuiListItem-root': {
          mb: 1,
          borderRadius: 2,
          transition: 'background 0.3s, transform 0.3s',
          width: isCollapsed ? 50 : '100%',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          '&.Mui-selected': {
            background: isDarkMode
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.1)',
            '&:hover': {
               background: isDarkMode
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(0,0,0,0.15)',
            },
            '& .MuiListItemIcon-root': {
              color: '#fff',
            },
            '& .MuiListItemText-primary': {
              color: '#fff',
              fontWeight: 600,
            },
          },
          '&:hover': {
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            transform: isCollapsed ? 'scale(1.1)' : 'none',
            '& .MuiListItemIcon-root': {
              transition: 'color 0.3s',
            },
          },
        }
      }}>
        {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
                <Tooltip
                    key={item.text}
                    title={isCollapsed ? item.text : ''}
                    placement="right"
                    arrow
                >
                    <ListItem
                        button
                        component={Link}
                        to={item.path}
                        selected={isActive}
                        sx={{
                            borderRadius: '12px',
                            mb: 1,
                            px: isCollapsed ? 1 : 1.5,
                            py: 1.5,
                            width: isCollapsed ? 50 : '100%',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                        }}
                    >
                        <ListItemIcon sx={{
                            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                            minWidth: isCollapsed ? 'auto' : 35,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: isCollapsed ? 0 : 1.5,
                            transition: 'margin 0.4s, color 0.3s',
                        }}>
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                fontSize: '0.95rem',
                                fontWeight: isActive ? 600 : 400,
                                opacity: isCollapsed ? 0 : 1,
                                maxWidth: isCollapsed ? 0 : '200px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                color: isActive ? '#fff' : 'rgba(255,255,255,0.85)',
                                transition: 'opacity 0.4s, max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s',
                                pl: isCollapsed ? 0 : '4px',
                            }}
                        />
                    </ListItem>
                </Tooltip>
            );
        })}
      </List>

      <Box sx={{
          p: isCollapsed ? 1 : 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isCollapsed ? 'center' : 'flex-start',
          gap: isCollapsed ? 1 : 2,
          transition: 'padding 0.4s, alignItems 0.4s, gap 0.4s',
      }}>
           <Tooltip
                title={isCollapsed ? (isDarkMode ? 'Chế độ sáng' : 'Chế độ tối') : ''}
                placement="right"
                arrow
            >
                <ListItem
                    button
                    onClick={toggleTheme}
                    sx={{
                        borderRadius: '12px',
                        px: isCollapsed ? 1 : 2,
                        py: 1.5,
                         width: isCollapsed ? 50 : '100%',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        background: isDarkMode
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.05)',
                        backdropFilter: 'blur(10px)',
                        transition: 'background 0.3s, transform 0.3s',
                        '&:hover': {
                            background: isDarkMode
                                ? 'rgba(255, 255, 255, 0.15)'
                                : 'rgba(0, 0, 0, 0.15)',
                             transform: 'translateY(-2px)',
                        }
                    }}
                >
                    <ListItemIcon sx={{
                        color: '#fff',
                        minWidth: isCollapsed ? 'auto' : 35,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: isCollapsed ? 0 : 2.5,
                         transition: 'margin 0.4s, color 0.3s',
                    }}>
                        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </ListItemIcon>

                    <ListItemText
                        primary={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
                        primaryTypographyProps={{
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            opacity: isCollapsed ? 0 : 1,
                             maxWidth: isCollapsed ? 0 : '200px',
                             overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            color: '#FFFFFF',
                            transition: 'opacity 0.4s, max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s',
                             pl: isCollapsed ? 0 : '4px',
                        }}
                    />
                </ListItem>
            </Tooltip>

             <Tooltip
                title={isCollapsed ? 'Thông tin cá nhân' : ''}
                placement="right"
                arrow
            >
                <ListItem
                    button
                    onClick={() => navigate('/admin/profile')}
                    sx={{
                        borderRadius: '12px',
                        px: isCollapsed ? 1 : 2,
                        py: 1.5,
                         width: isCollapsed ? 50 : '100%',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        background: isDarkMode
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.05)',
                        backdropFilter: 'blur(10px)',
                         transition: 'background 0.3s, transform 0.3s',
                        '&:hover': {
                            background: isDarkMode
                                ? 'rgba(255, 255, 255, 0.15)'
                                : 'rgba(0, 0, 0, 0.15)',
                             transform: 'translateY(-2px)',
                        }
                    }}
                >
                     <ListItemIcon sx={{
                        color: '#fff',
                         minWidth: isCollapsed ? 'auto' : 35,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: isCollapsed ? 0 : 2.5,
                         transition: 'margin 0.4s, color 0.3s',
                    }}>
                        <PersonIcon />
                    </ListItemIcon>

                    <ListItemText
                        primary="Thông tin cá nhân"
                        primaryTypographyProps={{
                            fontSize: '0.95rem',
                             fontWeight: 600,
                            opacity: isCollapsed ? 0 : 1,
                            maxWidth: isCollapsed ? 0 : '200px',
                             overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            color: '#FFFFFF',
                            transition: 'opacity 0.4s, max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s',
                             pl: isCollapsed ? 0 : '4px',
                        }}
                    />
                </ListItem>
            </Tooltip>

             <Tooltip
                title={isCollapsed ? 'Đăng xuất' : ''}
                placement="right"
                arrow
            >
                <ListItem
                    button
                    onClick={handleLogout}
                    sx={{
                        borderRadius: '12px',
                        px: isCollapsed ? 1 : 2,
                        py: 1.5,
                         width: isCollapsed ? 50 : '100%',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        background: isDarkMode
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.05)',
                        backdropFilter: 'blur(10px)',
                         transition: 'background 0.3s, transform 0.3s',
                        '&:hover': {
                            background: isDarkMode
                                ? 'rgba(255, 255, 255, 0.15)'
                                : 'rgba(0, 0, 0, 0.15)',
                             transform: 'translateY(-2px)',
                        }
                    }}
                >
                     <ListItemIcon sx={{
                        color: '#fff',
                         minWidth: isCollapsed ? 'auto' : 35,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: isCollapsed ? 0 : 2.5,
                         transition: 'margin 0.4s, color 0.3s',
                    }}>
                        <LogoutIcon />
                    </ListItemIcon>

                    <ListItemText
                        primary="Đăng xuất"
                        primaryTypographyProps={{
                            fontSize: '0.95rem',
                             fontWeight: 600,
                            opacity: isCollapsed ? 0 : 1,
                            maxWidth: isCollapsed ? 0 : '200px',
                             overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            color: '#FFFFFF',
                            transition: 'opacity 0.4s, max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s',
                             pl: isCollapsed ? 0 : '4px',
                        }}
                    />
                </ListItem>
            </Tooltip>
      </Box>

      <Box sx={{
        p: isCollapsed ? 1 : 2,
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: isCollapsed ? 'center' : 'flex-start',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: 1,
        transition: 'padding 0.4s, alignItems 0.4s, justify-content 0.4s',
      }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.3s' }}>
          v1.0.0
        </Typography>
      </Box>

    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminNavbar onMenuClick={handleDrawerToggle} isMobile={isMobile} />
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          width: isMobile ? drawerWidth : (isCollapsed ? collapsedDrawerWidth : drawerWidth),
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {isMobile ? (
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
                boxShadow: theme.shadows[2],
                bgcolor: theme.palette.background.paper,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            open={!isCollapsed}
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                border: 'none',
                boxShadow: theme.shadows[2],
                mt: '64px',
                bgcolor: theme.palette.background.paper,
              },
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          mt: '64px',
          p: 3,
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
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
      </Box>
    </Box>
  );
};

export default AdminDashboard; 