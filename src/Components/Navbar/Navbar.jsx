import * as React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Logo from '../../image/logo.jpg'
// Các trang trong menu
const pages = [
  { name: "Trang chủ", path: "/" },
  { name: "Tạo bài giảng", path: "/Choice" },
  { name: "Bản nháp", path: "/Draft" },
  { name: "Bài giảng", path: "/Lesson" },
  { name: "Bài giảng đã nộp", path: "/SubmitLesson" },
];

const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // Trạng thái đăng nhập
  const navigate = useNavigate(); // Dùng để điều hướng

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogin = () => {
    // Điều hướng đến trang đăng nhập
    navigate("/login"); // Giả sử trang login có đường dẫn là /login
  };

  const handleLogout = () => {
    // Đặt trạng thái đăng xuất và điều hướng đến trang chủ
    setIsLoggedIn(false);
    navigate("/"); // Điều hướng về trang chủ hoặc trang login
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "white", boxShadow: "none" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Logo bên trái */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  textDecoration: "none",
                  color: "gray",
                  fontWeight: "normal",
                  textTransform: "none",
                  letterSpacing: "0.1rem",
                  mx: 1,
                }}
              >
                <img src={Logo} alt="Logo" style={{ width: 40, height: 40, marginRight: 10 }} />
              </Typography>
            </Box>

            {/* Menu chính giữa */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component={Link}
                  to={page.path}
                  sx={{
                    my: 2,
                    color: "gray",
                    display: "block",
                    fontSize: "18px",
                    fontWeight: "normal",
                    textTransform: "none",
                    letterSpacing: "0.1rem",
                    mx: 1.5,
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* Avatar & menu settings bên phải */}
            <Box sx={{ flexGrow: 0 }}>
              {isLoggedIn ? (
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  onClick={handleLogin}
                  sx={{
                    color: "white", // Màu chữ của nút
                    backgroundColor: "#06A9AE", // Màu nền của nút
                    '&:hover': {
                      backgroundColor: "#048C87", // Màu nền khi hover (nếu muốn thay đổi)
                    },
                    borderRadius: "4px", // Để nút có góc bo tròn nhẹ
                    padding: "8px 16px", // Thêm padding cho nút
                  }}
                >
                  Đăng nhập
                </Button>

              )}
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
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={setting === "Logout" ? handleLogout : handleCloseUserMenu}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        textTransform: "none",
                        letterSpacing: "0.1rem",
                        mx: 1,
                        color: "gray",
                      }}
                    >
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </>
  );
}

export default Navbar;
