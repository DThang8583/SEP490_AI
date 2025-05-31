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
} from "@mui/icons-material";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";
import { keyframes } from "@mui/system";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const lessonCategories = [
  { 
    text: "Giáo án đang chờ duyệt", 
    path: "/giao-an-cho-duyet",
    icon: <HourglassTop />, 
    requiresTeacher: true 
  },
  { 
    text: "Giáo án đã chấp nhận", 
    path: "/giao-an-da-duyet",
    icon: <CheckCircleOutline />, 
    requiresTeacher: true 
  },
  { 
    text: "Giáo án bị từ chối", 
    path: "/giao-an-bi-tu-choi",
    icon: <Cancel />,
    requiresTeacher: true 
  },
  { 
    text: "Giáo án nháp", 
    path: "/giao-an-nhap",
    icon: <EditNote />, 
    requiresTeacher: true 
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
  
  // Add console.log for user role
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

  const isActive = (path) => location.pathname === path

  const isTeacher = userInfo?.role === 'Giáo viên';
  const NavButton = ({ text, path, icon, isDropdown }) => (
    <React.Fragment>
      <Button
        component={isDropdown ? undefined : Link}
        to={isDropdown ? undefined : path}
        onClick={isDropdown ? handleMenu : undefined}
        startIcon={icon}
        endIcon={isDropdown ? <KeyboardArrowDown /> : undefined}
        sx={{
          color: isActive(path) ? "#FF6B6B" : theme.palette.text.primary,
          mx: 1,
          "&:hover": {
            color: "#FF6B6B",
            backgroundColor: "rgba(255, 107, 107, 0.1)",
          },
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: isActive(path) ? "100%" : "0%",
            height: "2px",
            backgroundColor: "#FF6B6B",
            transition: "all 0.3s ease",
            transform: "translateX(-50%)",
          },
          "&:hover::after": {
            width: "100%",
          },
        }}
      >
        {text}
      </Button>
      {isDropdown && (
        <Menu
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
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.background.paper,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: `1px solid ${
                isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
              }`,
              mt: 1.5,
              minWidth: 200,
              ml:28
            },
          }}
          MenuListProps={{
            sx: {
              py: 0.5,
            },
          }}
        >
          {lessonCategories.map((category) => (
            <MenuItem
              key={category.text}
              onClick={() => handleNavigation(category.path)}
              sx={{
                color: theme.palette.text.primary,
                py: 1.5,
                display: category.requiresTeacher && (!isLoggedIn || userInfo?.role !== 'Giáo viên') ? 'none' : 'flex',
                "&:hover": {
                  backgroundColor: "rgba(255, 107, 107, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#FF6B6B", minWidth: 40 }}>
                {category.icon}
              </ListItemIcon>
              {category.text}
            </MenuItem>
          ))}
        </Menu>
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
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        borderBottom: `1px solid ${
          isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
        }`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 2,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <School
              sx={{
                fontSize: 40,
                color: "#FF6B6B",
                mr: 1,
                animation: `${float} 3s ease-in-out infinite`,
              }}
            />
            
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
              {menuItems.map((item) =>
                (!item.requiresLogin || isLoggedIn) && (
                  item.text === "Bài học" ? (
                     <NavButton
                       key={item.text}
                       text={item.text}
                       path={item.path}
                       icon={item.icon}
                       isDropdown={true}
                     />
                  ) : (
                   <NavButton
                     key={item.text}
                     text={item.text}
                     path={item.path}
                     icon={item.icon}
                     isDropdown={false}
                   />
                 )
                )
              )}
              {isLoggedIn && isTeacher && (
                <Button
                  variant="contained"
                  startIcon={<AutoAwesome />}
                  onClick={() => handleNavigation('/tao-giao-an')}
                  sx={{
                    ml: 2,
                    backgroundColor: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#FF5252',
                    }
                  }}
                >
                  Tạo Giáo án bằng AI
                </Button>
              )}
            </Box>
          )}

          {/* Auth Buttons and Theme Toggle */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: theme.palette.text.primary,
                mr: 1,
                "&:hover": {
                  backgroundColor: "rgba(255, 107, 107, 0.1)",
                },
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            {!isMobile ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {isLoggedIn ? (
                  <Tooltip title="Mở cài đặt">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Person
                        sx={{
                          fontSize: 40,
                          color: theme.palette.text.primary,
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/Login")}
                      sx={{
                        color: isDarkMode ? "#ffffff" : "#2D3436",
                        borderColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                          borderColor: isDarkMode ? "#ffffff" : "#2D3436",
                          backgroundColor: isDarkMode
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.05)",
                        },
                        textTransform: "none",
                        px: 3,
                        py: 1,
                        borderRadius: "12px",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </>
                )}
              </Box>
            ) : (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleMobileMenuToggle}
                sx={{ color: theme.palette.text.primary }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        PaperProps={{
          sx: {
            width: "80%",
            maxWidth: "300px",
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: theme.palette.text.primary }}
          >
            Menu
          </Typography>
          <List>
            {menuItems.map((item) =>
              (!item.requiresLogin || isLoggedIn) && (
                item.text === "Các Giáo án" ? (
                  <ListItem
                    button
                    key={item.text}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color: isActive(item.path)
                        ? "#FF6B6B"
                        : theme.palette.text.primary,
                      "&:hover": {
                        backgroundColor: "rgba(255, 107, 107, 0.1)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "#FF6B6B" }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ) : item.text === "Bài học" ? (
                  <React.Fragment key={item.text}>
                    <ListItem
                      button
                      onClick={handleMenu}
                      sx={{
                        color: isActive(item.path)
                          ? "#FF6B6B"
                          : theme.palette.text.primary,
                        "&:hover": {
                          backgroundColor: "rgba(255, 107, 107, 0.1)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActive(item.path)
                            ? "#FF6B6B"
                            : theme.palette.text.primary,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                      <KeyboardArrowDown />
                    </ListItem>
                    {lessonCategories.map((category) => (
                      <ListItem
                        button
                        key={category.text}
                        onClick={() => handleNavigation(category.path)}
                        sx={{
                          pl: 4,
                          color: theme.palette.text.primary,
                          "&:hover": {
                            backgroundColor: "rgba(255, 107, 107, 0.1)",
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: "#FF6B6B" }}>
                          {category.icon}
                        </ListItemIcon>
                        <ListItemText primary={category.text} />
                      </ListItem>
                    ))}
                  </React.Fragment>
                ) : (
                  <ListItem
                    button
                    key={item.text}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color: isActive(item.path)
                        ? "#FF6B6B"
                        : theme.palette.text.primary,
                      "&:hover": {
                        backgroundColor: "rgba(255, 107, 107, 0.1)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive(item.path)
                          ? "#FF6B6B"
                          : theme.palette.text.primary,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                )
              )
            )}
            <Divider sx={{ my: 1 }} />
            <ListItem
              button
              onClick={toggleTheme}
              sx={{
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: "rgba(255, 107, 107, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </ListItemIcon>
              <ListItemText
                primary={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
              />
            </ListItem>
            {isLoggedIn ? (
              settings.map((setting) => (
                <ListItem
                  button
                  key={setting.name}
                  onClick={() => handleNavigation(setting.path)}
                  sx={{
                    color: theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: "rgba(255, 107, 107, 0.1)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: theme.palette.text.primary }}>
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
                  <Typography textAlign="center">{setting.name}</Typography>
                </ListItem>
              ))
            ) : (
              <>
                <ListItem
                  button
                  onClick={() => handleNavigation("/login")}
                  sx={{
                    color: theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: "rgba(255, 107, 107, 0.1)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Đăng nhập" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => handleNavigation("/register")}
                  sx={{
                    color: "#FF6B6B",
                    "&:hover": {
                      backgroundColor: "rgba(255, 107, 107, 0.1)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "#FF6B6B" }}>
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText primary="Đăng ký" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* User Menu */}
      <Menu
        sx={{ mt: "45px" }}
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
        PaperProps={{
          sx: {
            background: isDarkMode
              ? "rgba(18, 18, 18, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${
              isDarkMode
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)"
            }`,
          },
        }}
      >
        {settings.map((setting) => (
          <MenuItem
            key={setting.name}
            onClick={() => handleNavigation(setting.path)}
            sx={{
              color: isDarkMode ? "#ffffff" : "#2D3436",
              "&:hover": {
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDarkMode ? "#ffffff" : "#2D3436" }}>
              {setting.name === "Hồ sơ" ? (
                userInfo?.imgURL ? (
                   <Avatar src={userInfo.imgURL} sx={{ width: 24, height: 24, color: isDarkMode ? "#ffffff" : "#2D3436" }} />
                ) : (
                   <Person sx={{ color: isDarkMode ? "#ffffff" : "#2D3436" }} />
                )
              ) : (
                setting.icon
              )}
            </ListItemIcon>
            <Typography textAlign="center">{setting.name}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Profile Alert Dialog */}
      <Dialog
        open={profileAlertOpen}
        onClose={handleProfileAlertClose}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            minWidth: 320,
          },
        }}
      >
        <DialogTitle sx={{ color: theme.palette.text.primary }}>
          Thông báo
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: theme.palette.text.primary }}>
            Bạn phải điền đầy đủ thông tin trong hồ sơ thì mới sử dụng được chức năng này
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleProfileAlertClose}
            sx={{
              color: theme.palette.text.primary,
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
              backgroundColor: '#FF6B6B',
              '&:hover': {
                backgroundColor: '#FF5252',
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
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Navbar; 