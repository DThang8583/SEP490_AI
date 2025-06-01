import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  School,
  EmojiEvents,
  Support,
  Person,
  Logout,
  Settings,
  LightMode,
  DarkMode,
  AutoAwesome,
  Calculate,
  Timeline,
  KeyboardArrowDown,
  ExitToApp,
  Cancel,
  CheckCircleOutline,
  EditNote,
  HourglassTop,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";
import { styled, keyframes } from '@mui/material/styles';
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

// Animations
const float = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-8px) rotate(2deg); 
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 8px rgba(255, 107, 107, 0);
  }
`;

const glow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(255, 107, 107, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(255, 107, 107, 0.6));
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
const StyledAppBar = styled(AppBar)(({ theme, isDarkMode }) => ({
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(45, 45, 61, 0.9) 50%, rgba(30, 30, 46, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 50%, rgba(255, 255, 255, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  borderBottom: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 107, 107, 0.1)',
  boxShadow: isDarkMode
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(255, 107, 107, 0.1)',
  position: 'sticky',
  zIndex: 1100,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDarkMode
      ? 'radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.05) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(255, 107, 107, 0.08) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '8px 16px',
  borderRadius: '16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.1), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    background: 'rgba(255, 107, 107, 0.08)',
    transform: 'translateY(-2px)',
    '&::before': {
      left: '100%',
    },
  },
}));

const LogoIcon = styled(School)(({ theme }) => ({
  fontSize: '2.5rem',
  color: '#FF6B6B',
  marginRight: '12px',
  animation: `${float} 4s ease-in-out infinite`,
  filter: 'drop-shadow(0 4px 8px rgba(255, 107, 107, 0.3))',
  transition: 'all 0.3s ease',
  '&:hover': {
    animation: `${glow} 2s ease-in-out infinite`,
  },
}));

const BrandText = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: 'sans-serif',
  fontWeight: 800,
  fontSize: '1.5rem',
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 50%, #FF6B6B 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '0.5px',
  textShadow: '0 2px 4px rgba(255, 107, 107, 0.2)',
  animation: `${fadeIn} 0.8s ease-out`,
}));

const NavButton = styled(Button)(({ theme, isActive, isDarkMode }) => ({
  margin: '0 8px',
  padding: '12px 20px',
  borderRadius: '16px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: isActive
    ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 107, 107, 0.08) 100%)'
    : 'transparent',
  color: isActive ? '#FF6B6B' : theme.palette.text.primary,
  border: isActive
    ? '1px solid rgba(255, 107, 107, 0.3)'
    : '1px solid transparent',
  backdropFilter: isActive ? 'blur(10px)' : 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: isActive ? '100%' : '0%',
    height: '2px',
    background: 'linear-gradient(90deg, #FF6B6B, #FF8E8E)',
    transform: 'translateX(-50%)',
    transition: 'width 0.3s ease',
    borderRadius: '1px',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.1), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.12) 0%, rgba(255, 107, 107, 0.06) 100%)',
    color: '#FF6B6B',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.2)',
    '&::before': {
      width: '100%',
    },
    '&::after': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
}));

const CreateButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
  color: '#fff',
  borderRadius: '20px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.95rem',
  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #FF8E8E 0%, #FF6B6B 100%)',
    transform: 'translateY(-3px) scale(1.02)',
    boxShadow: '0 12px 35px rgba(255, 107, 107, 0.5)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(-1px) scale(0.98)',
  },
  animation: `${pulse} 3s ease-in-out infinite`,
}));

const ThemeToggle = styled(IconButton)(({ theme, isDarkMode }) => ({
  padding: '12px',
  borderRadius: '16px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(45, 45, 61, 0.1) 0%, rgba(45, 45, 61, 0.05) 100%)',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.2)'
    : '1px solid rgba(45, 45, 61, 0.2)',
  color: theme.palette.text.primary,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)'
      : 'linear-gradient(135deg, rgba(45, 45, 61, 0.15) 0%, rgba(45, 45, 61, 0.08) 100%)',
    transform: 'scale(1.1) rotate(180deg)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  },
}));

const LoginButton = styled(Button)(({ theme, isDarkMode }) => ({
  borderRadius: '16px',
  padding: '10px 24px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  border: isDarkMode
    ? '2px solid rgba(255, 255, 255, 0.2)'
    : '2px solid rgba(255, 107, 107, 0.3)',
  color: isDarkMode ? '#fff' : '#FF6B6B',
  background: 'transparent',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: isDarkMode
      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.1), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    background: isDarkMode
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 107, 107, 0.08)',
    borderColor: isDarkMode ? '#fff' : '#FF6B6B',
    transform: 'translateY(-2px)',
    boxShadow: isDarkMode
      ? '0 8px 25px rgba(255, 255, 255, 0.1)'
      : '0 8px 25px rgba(255, 107, 107, 0.2)',
    '&::before': {
      left: '100%',
    },
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  border: '2px solid rgba(255, 107, 107, 0.3)',
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.1)',
    border: '2px solid rgba(255, 107, 107, 0.6)',
    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
  },
}));

const ModernDrawer = styled(Drawer)(({ theme, isDarkMode }) => ({
  '& .MuiDrawer-paper': {
    width: '320px',
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(45, 45, 61, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
    backdropFilter: 'blur(20px)',
    border: isDarkMode
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 107, 107, 0.1)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
}));

const DrawerHeader = styled(Box)(({ theme, isDarkMode }) => ({
  padding: '24px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, rgba(255, 107, 107, 0.04) 100%)',
  borderBottom: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 107, 107, 0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const DrawerListItem = styled(ListItem)(({ theme, isActive, isDarkMode }) => ({
  margin: '4px 16px',
  borderRadius: '12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: isActive
    ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 107, 107, 0.08) 100%)'
    : 'transparent',
  border: isActive
    ? '1px solid rgba(255, 107, 107, 0.3)'
    : '1px solid transparent',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.12) 0%, rgba(255, 107, 107, 0.06) 100%)',
    transform: 'translateX(8px)',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.2)',
  },
}));

const ModernMenu = styled(Menu)(({ theme, isDarkMode }) => ({
  '& .MuiPaper-root': {
    borderRadius: '16px',
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(45, 45, 61, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
    backdropFilter: 'blur(20px)',
    border: isDarkMode
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 107, 107, 0.1)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    marginTop: '8px',
    minWidth: '240px',
  },
}));

const MenuItemStyled = styled(MenuItem)(({ theme, isDarkMode }) => ({
  padding: '12px 20px',
  borderRadius: '8px',
  margin: '4px 8px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.12) 0%, rgba(255, 107, 107, 0.06) 100%)',
    transform: 'translateX(4px)',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const colors = {
    pending: { bg: '#FF9800', text: '#fff' },
    approved: { bg: '#4CAF50', text: '#fff' },
    rejected: { bg: '#f44336', text: '#fff' },
    draft: { bg: '#9E9E9E', text: '#fff' }
  };
  
  return {
    background: `linear-gradient(135deg, ${colors[status]?.bg || '#FF9800'} 0%, ${colors[status]?.bg || '#FF9800'}CC 100%)`,
    color: colors[status]?.text || '#fff',
    fontWeight: 600,
    fontSize: '0.75rem',
    height: '24px',
    '& .MuiChip-label': {
      padding: '0 8px',
    },
  };
});

const lessonCategories = [
  { 
    text: "Giáo án đang chờ duyệt", 
    path: "/giao-an-cho-duyet",
    icon: <HourglassTop />, 
    requiresTeacher: true,
    status: 'pending'
  },
  { 
    text: "Giáo án đã chấp nhận", 
    path: "/giao-an-da-duyet",
    icon: <CheckCircleOutline />, 
    requiresTeacher: true,
    status: 'approved'
  },
  { 
    text: "Giáo án bị từ chối", 
    path: "/giao-an-bi-tu-choi",
    icon: <Cancel />,
    requiresTeacher: true,
    status: 'rejected'
  },
  { 
    text: "Giáo án Nháp", 
    path: "/giao-an-nhap",
    icon: <EditNote />, 
    requiresTeacher: true,
    status: 'draft'
  }
];

const menuItems = [
  { text: "Bài đăng", path: "/danh-sach-bai-dang", icon: <Calculate />, requiresLogin: true },
  { text: "Bài học", path: "/lessons", requiresLogin: true },
  { text: "Bài tập", path: "/bai-tap", requiresLogin: true },
  { text: "Khung chương trình cho giáo viên", path: "/khung-chuong-trinh", requiresLogin: true },
];

const settings = [
  { name: "Hồ sơ", icon: <Person />, path: "/ho-so" },
  { name: "Quản lý câu lệnh", icon: <Settings />, path: "/command-management" },
  { name: "Đăng xuất", icon: <Logout />, path: "/logout" },
];

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { isLoggedIn, userInfo, logout } = useAuth();
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [profileAlertOpen, setProfileAlertOpen] = useState(false);
  
  useEffect(() => {
  }, [userInfo, isLoggedIn]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();
 
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget.parentElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = async (path) => {
    handleClose();
    handleCloseUserMenu();
    setMobileMenuOpen(false);

    if (path === '/logout') {
      logout();
      navigate('/login');
    } else if (path === '/tao-giao-an') {
      if (!isLoggedIn || !userInfo?.id) {
        navigate('/login'); 
        return;
      }

      try {
        const userId = userInfo.id;
        const apiUrl = `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userId}`;
        const response = await axios.get(apiUrl);
        const userData = response.data.data;

        if (
          userData.fullname &&
          userData.email &&
          userData.phoneNumber &&
          userData.address
        ) {
          navigate(path);
        } else {
          setProfileAlertOpen(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setNotification({
          open: true,
          message: "Có lỗi xảy ra khi kiểm tra hồ sơ của bạn.",
          severity: "error"
        });
      }
    } else {
      navigate(path);
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  const isActive = (path) => location.pathname === path;

  const isTeacher = userInfo?.role === 'Giáo viên';

  const NavButtonComponent = ({ text, path, icon, isDropdown }) => (
    <React.Fragment>
      <NavButton
        component={isDropdown ? undefined : Link}
        to={isDropdown ? undefined : path}
        onClick={isDropdown ? handleMenu : undefined}
        startIcon={icon}
        endIcon={isDropdown ? <KeyboardArrowDown /> : undefined}
        isActive={isActive(path)}
        isDarkMode={isDarkMode}
      >
        {text}
      </NavButton>
      {isDropdown && (
        <ModernMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          isDarkMode={isDarkMode}
        >
          {lessonCategories.map((category) => (
            <MenuItemStyled
              key={category.text}
              onClick={() => handleNavigation(category.path)}
              sx={{
                display: category.requiresTeacher && (!isLoggedIn || userInfo?.role !== 'Giáo viên') ? 'none' : 'flex',
                alignItems: 'center',
                gap: 2,
              }}
              isDarkMode={isDarkMode}
            >
              <ListItemIcon sx={{ color: "#FF6B6B", minWidth: 40 }}>
                {category.icon}
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {category.text}
                </Typography>
              </Box>
              <StatusChip 
                label={category.status} 
                size="small" 
                status={category.status}
              />
            </MenuItemStyled>
          ))}
        </ModernMenu>
      )}
    </React.Fragment>
  );

  const handleProfileAlertClose = () => {
    setProfileAlertOpen(false);
  };

  const handleGoToProfile = () => {
    setProfileAlertOpen(false);
    navigate('/ho-so');
  };

  return (
    <StyledAppBar isDarkMode={isDarkMode}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo */}
          <LogoContainer onClick={() => navigate("/")}>
            <LogoIcon />
            <BrandText isDarkMode={isDarkMode}>
              AI Math Tools
            </BrandText>
          </LogoContainer>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ 
              flexGrow: 1, 
              display: "flex", 
              justifyContent: "center",
              animation: `${fadeIn} 1s ease-out`,
            }}>
              {menuItems.map((item, index) =>
                (!item.requiresLogin || isLoggedIn) && (
                  <Box 
                    key={item.text}
                    sx={{ 
                      animation: `${slideInLeft} ${0.8 + index * 0.1}s ease-out` 
                    }}
                  >
                    {item.text === "Bài học" ? (
                      <NavButtonComponent
                        text={item.text}
                        path={item.path}
                        icon={item.icon}
                        isDropdown={true}
                      />
                    ) : (
                      <NavButtonComponent
                        text={item.text}
                        path={item.path}
                        icon={item.icon}
                        isDropdown={false}
                      />
                    )}
                  </Box>
                )
              )}
              {isLoggedIn && isTeacher && (
                <CreateButton
                  startIcon={<AutoAwesome />}
                  onClick={() => handleNavigation('/tao-giao-an')}
                  sx={{ ml: 2 }}
                >
                  Tạo Giáo án AI
                </CreateButton>
              )}
            </Box>
          )}

          {/* Right Side Controls */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2,
            animation: `${fadeIn} 1.2s ease-out`,
          }}>
            <ThemeToggle
              onClick={toggleTheme}
              isDarkMode={isDarkMode}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </ThemeToggle>

            {!isMobile ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {isLoggedIn ? (
                  <Tooltip title="Mở menu người dùng" arrow>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <UserAvatar
                        src={userInfo?.imgURL}
                      >
                        <Person />
                      </UserAvatar>
                    </IconButton>
                  </Tooltip>
                ) : (
                  <LoginButton
                    onClick={() => navigate("/login")}
                    isDarkMode={isDarkMode}
                  >
                    Đăng nhập
                  </LoginButton>
                )}
              </Box>
            ) : (
              <IconButton
                onClick={handleMobileMenuToggle}
                sx={{
                  color: theme.palette.text.primary,
                  p: 1.5,
                  borderRadius: '12px',
                  '&:hover': {
                    background: 'rgba(255, 107, 107, 0.1)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu */}
      <ModernDrawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        isDarkMode={isDarkMode}
      >
        <DrawerHeader isDarkMode={isDarkMode}>
          <Typography
            variant="h6"
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Menu
          </Typography>
          <IconButton
            onClick={handleMobileMenuToggle}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                background: 'rgba(255, 107, 107, 0.1)',
                transform: 'rotate(90deg)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DrawerHeader>

        <Box sx={{ p: 2 }}>
          <List>
            {menuItems.map((item, index) =>
              (!item.requiresLogin || isLoggedIn) && (
                item.text === "Bài học" ? (
                  <React.Fragment key={item.text}>
                    <DrawerListItem
                      button
                      onClick={handleMenu}
                      isActive={isActive(item.path)}
                      isDarkMode={isDarkMode}
                      sx={{
                        animation: `${slideInLeft} ${0.6 + index * 0.1}s ease-out`,
                      }}
                    >
                      <ListItemIcon sx={{ color: "#FF6B6B", minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text}
                        sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}
                      />
                      <KeyboardArrowDown />
                    </DrawerListItem>
                    {lessonCategories.map((category, catIndex) => (
                      <DrawerListItem
                        button
                        key={category.text}
                        onClick={() => handleNavigation(category.path)}
                        sx={{
                          pl: 6,
                          animation: `${slideInLeft} ${0.8 + catIndex * 0.05}s ease-out`,
                        }}
                        isDarkMode={isDarkMode}
                      >
                        <ListItemIcon sx={{ color: "#FF6B6B", minWidth: 30 }}>
                          {category.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={category.text}
                          sx={{ '& .MuiTypography-root': { fontSize: '0.9rem' } }}
                        />
                        <StatusChip 
                          label={category.status} 
                          size="small" 
                          status={category.status}
                        />
                      </DrawerListItem>
                    ))}
                  </React.Fragment>
                ) : (
                  <DrawerListItem
                    button
                    key={item.text}
                    onClick={() => handleNavigation(item.path)}
                    isActive={isActive(item.path)}
                    isDarkMode={isDarkMode}
                    sx={{
                      animation: `${slideInLeft} ${0.6 + index * 0.1}s ease-out`,
                    }}
                  >
                    <ListItemIcon sx={{ color: "#FF6B6B", minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}
                    />
                  </DrawerListItem>
                )
              )
            )}

            <Divider sx={{ my: 2, opacity: 0.3 }} />

            <DrawerListItem
              button
              onClick={toggleTheme}
              isDarkMode={isDarkMode}
            >
              <ListItemIcon sx={{ color: theme.palette.text.primary, minWidth: 40 }}>
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </ListItemIcon>
              <ListItemText
                primary={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
                sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}
              />
            </DrawerListItem>

            {isLoggedIn ? (
              settings.map((setting, index) => (
                <DrawerListItem
                  button
                  key={setting.name}
                  onClick={() => handleNavigation(setting.path)}
                  isDarkMode={isDarkMode}
                  sx={{
                    animation: `${slideInLeft} ${1.2 + index * 0.1}s ease-out`,
                  }}
                >
                  <ListItemIcon sx={{ color: theme.palette.text.primary, minWidth: 40 }}>
                    {setting.name === "Hồ sơ" ? (
                      userInfo?.imgURL ? (
                        <Avatar src={userInfo.imgURL} sx={{ width: 24, height: 24 }} />
                      ) : (
                        <Person />
                      )
                    ) : (
                      setting.icon
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={setting.name}
                    sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}
                  />
                </DrawerListItem>
              ))
            ) : (
              <>
                <DrawerListItem
                  button
                  onClick={() => handleNavigation("/login")}
                  isDarkMode={isDarkMode}
                >
                  <ListItemIcon sx={{ color: "#FF6B6B", minWidth: 40 }}>
                    <Person />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Đăng nhập"
                    sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}
                  />
                </DrawerListItem>
                <DrawerListItem
                  button
                  onClick={() => handleNavigation("/register")}
                  isDarkMode={isDarkMode}
                >
                  <ListItemIcon sx={{ color: "#FF6B6B", minWidth: 40 }}>
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Đăng ký"
                    sx={{ '& .MuiTypography-root': { fontWeight: 600 } }}
                  />
                </DrawerListItem>
              </>
            )}
          </List>
        </Box>
      </ModernDrawer>

      {/* User Menu */}
      <ModernMenu
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        isDarkMode={isDarkMode}
        sx={{ mt: "45px" }}
      >
        {settings.map((setting, index) => (
          <MenuItemStyled
            key={setting.name}
            onClick={() => handleNavigation(setting.path)}
            isDarkMode={isDarkMode}
            sx={{
              animation: `${fadeIn} ${0.8 + index * 0.1}s ease-out`,
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.primary, minWidth: 40 }}>
              {setting.name === "Hồ sơ" ? (
                userInfo?.imgURL ? (
                  <Avatar src={userInfo.imgURL} sx={{ width: 24, height: 24 }} />
                ) : (
                  <Person />
                )
              ) : (
                setting.icon
              )}
            </ListItemIcon>
            <Typography sx={{ fontWeight: 600 }}>{setting.name}</Typography>
          </MenuItemStyled>
        ))}
      </ModernMenu>

      {/* Profile Alert Dialog */}
      <Dialog
        open={profileAlertOpen}
        onClose={handleProfileAlertClose}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(45, 45, 61, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: isDarkMode
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(255, 107, 107, 0.1)',
            minWidth: 360,
          },
        }}
      >
        <DialogTitle sx={{ 
          color: theme.palette.text.primary,
          fontWeight: 700,
          fontSize: '1.25rem',
        }}>
          Thông báo
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ 
            color: theme.palette.text.primary,
            lineHeight: 1.6,
          }}>
            Bạn phải điền đầy đủ thông tin trong hồ sơ thì mới sử dụng được chức năng này
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
          <Button
            onClick={handleProfileAlertClose}
            sx={{
              color: theme.palette.text.primary,
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
              },
            }}
          >
            Đóng
          </Button>
          <Button
            onClick={handleGoToProfile}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
              borderRadius: '12px',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF8E8E 0%, #FF6B6B 100%)',
              },
            }}
          >
            Đi tới hồ sơ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </StyledAppBar>
  );
};

export default Navbar; 