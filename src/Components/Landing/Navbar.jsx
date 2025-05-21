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
  { text: "Các bài giảng", path: "/các-Giáo-án", icon: <Calculate /> },
  { 
    text: "Bài giảng đang chờ duyệt", 
    path: "/pending-lessons",
    icon: <HourglassTop />, 
    requiresTeacher: true 
  },
  { 
    text: "Bài giảng đã chấp nhận", 
    path: "/approved-lessons",
    icon: <CheckCircleOutline />, 
    requiresTeacher: true 
  },
  { 
    text: "Bài giảng bị từ chối", 
    path: "/rejected-lessons",
    icon: <Cancel />,
    requiresTeacher: true 
  },
  { 
    text: "Bài giảng nháp", 
    path: "/draft-lessons",
    icon: <EditNote />, 
    requiresTeacher: true 
  }
];

const menuItems = [
  { text: "Bài học", path: "/lessons" },
  { text: "Đề ôn", path: "/de-on" },
  { text: "Hỗ trợ", path: "/support" },
];

const settings = [
  { name: "Hồ sơ", icon: <Person />, path: "/teacher/profile" },
  { name: "Đăng xuất", icon: <Logout />, path: "/logout" },
];

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { isLoggedIn, userInfo, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  
  // Add console.log for user role
  useEffect(() => {
    console.log('User Info:', userInfo);
    console.log('User Role:', userInfo?.role);
    console.log('Is Logged In:', isLoggedIn);
  }, [userInfo, isLoggedIn]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();
 
      useEffect(() => {
        const fetchUserProfile = async () => {
          console.log("Fetching user profile..."); // Kiểm tra xem hàm có chạy không
    
          if (!isLoggedIn) {
            console.warn("User is not logged in");
            return;
          }
    
          if (!userInfo?.id) {
            console.warn("User ID is missing");
            return;
          }
    
          try {
            const token = localStorage.getItem("accessToken");
            console.log("Token:", token);
            if (!token) {
              console.warn("No access token found");
              return;
            }
    
            const response = await axios.get(
              `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userInfo.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
    
            console.log("API Response:", response.data);
            if (response.data?.data?.imgURL) {
              setUserProfile(response.data.data);
            } else {
              console.warn("No image URL found in response");
            }
          } catch (error) {
            console.error("Error fetching user profile:", error.response?.data || error.message);
          }
        };
    
        fetchUserProfile();
      }, [isLoggedIn, userInfo?.userId]);

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

  const handleNavigation = (path) => {
    if (path === '/logout') {
      logout();
      navigate('/login');
    } else {
      navigate(path);
    }
    handleClose();
    handleCloseUserMenu();
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path

  const isTeacher = userInfo?.role === 'Giáo viên';
  console.log('Is Teacher:', isTeacher);

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
              ml: 10,
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
              {menuItems.map((item) => (
                (!item.requiresTeacher || (isLoggedIn && isTeacher)) && (
                  <NavButton
                    key={item.text}
                    text={item.text}
                    path={item.path}
                    icon={item.icon}
                    isDropdown={item.text === "Bài học"}
                  />
                )
                
              ))}
              {isLoggedIn && isTeacher && (
            <Button
              variant="contained"
              startIcon={<AutoAwesome />}
              onClick={() => handleNavigation('/CreateLesson')}
              sx={{
                ml: 2,
                backgroundColor: '#FF6B6B',
                '&:hover': {
                  backgroundColor: '#FF5252',
                }
              }}
            >
              Tạo bài giảng bằng AI
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
                      <Avatar
                        alt={userProfile?.fullname || "User"}
                        src={userProfile?.imgURL}
                        sx={{
                          width: 40,
                          height: 40,
                          border: `2px solid ${isDarkMode ? "#ffffff" : "#2D3436"}`,
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
              item.text === "Bài học" ? (
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
                      <Avatar
                        alt={userProfile?.fullname || "User"}
                        src={userProfile?.imgURL}
                        sx={{
                          width: 32,
                          height: 32,
                          border: `1px solid ${isDarkMode ? "#ffffff" : "#2D3436"}`,
                        }}
                      />
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
                <Avatar
                  alt={userProfile?.fullname || "User"}
                  src={userProfile?.imgURL}
                  sx={{
                    width: 32,
                    height: 32,
                    border: `1px solid ${isDarkMode ? "#ffffff" : "#2D3436"}`,
                  }}
                />
              ) : (
                setting.icon
              )}
            </ListItemIcon>
            <Typography textAlign="center">{setting.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};

export default Navbar; 