import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
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

const drawerWidth = 280;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
      bgcolor: theme.palette.background.default,
    }}>
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ADMIN PANEL
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Quản trị hệ thống
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <List sx={{ 
        flex: 1, 
        px: 2, 
        py: 3,
        '& .MuiListItem-root': {
          mb: 1,
        }
      }}>
        {menuItems.map((item) => (
          <Tooltip 
            key={item.text}
            title={item.description}
            placement="right"
          >
            <ListItem
              button
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                height: 48,
                '&.Mui-selected': {
                  bgcolor: `${theme.palette.primary.main}15`,
                  '&:hover': {
                    bgcolor: `${theme.palette.primary.main}25`,
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiListItemText-primary': {
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                  '& .MuiListItemIcon-root': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.2s',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                minWidth: 40,
                transition: 'all 0.2s',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: location.pathname === item.path ? 600 : 500,
                }}
              />
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <Box sx={{ 
        p: 2, 
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}>
        <Typography variant="caption" color="text.secondary">
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
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                border: 'none',
                boxShadow: theme.shadows[2],
                mt: '64px', // Height of AppBar
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          mt: '64px', // Height of AppBar
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