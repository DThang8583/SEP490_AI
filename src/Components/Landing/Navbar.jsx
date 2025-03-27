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
} from "@mui/icons-material";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";
import { keyframes } from "@mui/system";
import { useAuth } from "../../context/AuthContext";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const lessonCategories = [
  { text: "Toán số", path: "/toan-so", icon: <Calculate /> },
  { text: "Toán hình", path: "/lessons/geometry", icon: <Timeline /> },
];

const menuItems = [
  { text: "Bài học", path: "/lessons" },
  { text: "Đề ôn thi", path: "/de-on-thi" },
  { text: "Hỗ trợ", path: "/support" },
];

const settings = [
  { name: "Hồ sơ", icon: <Person />, path: "/profile" },
  { name: "Cài đặt", icon: <Settings />, path: "/settings" },
  { name: "Đăng xuất", icon: <Logout />, path: "/logout" },
];

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { isLoggedIn, userInfo, logout } = useAuth();
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
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
                textDecoration: "none",
                "&:hover": {
                  color: "#FF6B6B",
                },
              }}
            >
              AI Math Tool
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
              {menuItems.map((item) => (
                <NavButton
                  key={item.text}
                  text={item.text}
                  path={item.path}
                  icon={item.icon}
                  isDropdown={item.text === "Bài học"}
                />
              ))}
              <Button
                component={Link}
                to="/ChoiceChatorClick"
                startIcon={<AutoAwesome />}
                variant="contained"
                sx={{
                  backgroundColor: "#FF6B6B",
                  color: "white",
                  mx: 1,
                  "&:hover": {
                    backgroundColor: "#FF5252",
                  },
                }}
              >
                Tạo bài giảng AI
              </Button>
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
                        alt={userInfo?.fullName || "User"}
                        src="/static/images/avatar/1.jpg"
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
                    <Button
                      variant="contained"
                      onClick={() => navigate("/Register")}
                      sx={{
                        backgroundColor: "#FF6B6B",
                        color: "#ffffff",
                        "&:hover": {
                          backgroundColor: "#FF5252",
                          transform: "translateY(-2px)",
                        },
                        textTransform: "none",
                        px: 3,
                        py: 1,
                        borderRadius: "12px",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        boxShadow: "0 4px 20px rgba(255, 107, 107, 0.3)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Đăng ký
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
            <ListItem
              button
              onClick={() => handleNavigation("/ChoiceChatorClick")}
              sx={{
                color: "#FF6B6B",
                backgroundColor: "rgba(255, 107, 107, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 107, 107, 0.2)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#FF6B6B" }}>
                <AutoAwesome />
              </ListItemIcon>
              <ListItemText primary="Tạo bài giảng AI" />
            </ListItem>
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
                    {setting.icon}
                  </ListItemIcon>
                  <ListItemText primary={setting.name} />
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
              {setting.icon}
            </ListItemIcon>
            <Typography textAlign="center">{setting.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};

export default Navbar; 