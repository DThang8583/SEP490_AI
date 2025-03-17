// import React, { useState } from 'react';
// import { Box, TextField, Button, Typography, Link } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate(); // Điều hướng sang trang khác

//   // Xử lý đăng nhập (giả lập)
//   const handleLogin = () => {
//     if (email && password) {
//       // Giả sử đăng nhập thành công, chuyển sang trang dashboard hoặc trang chính
//       navigate('/home'); // Đổi '/home' thành trang bạn muốn điều hướng sau khi login
//     } else {
//       alert('Vui lòng điền đầy đủ email và mật khẩu');
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '100vh',
//         backgroundColor: '#f4f6f8',
//       }}
//     >
//       <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
//         Đăng nhập
//       </Typography>

//       {/* Form Login */}
//       <Box sx={{ width: '100%', maxWidth: 400, padding: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
//         {/* Email */}
//         <TextField
//           label="Email"
//           variant="outlined"
//           type="email"
//           fullWidth
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           sx={{ marginBottom: 2 }}
//         />

//         {/* Password */}
//         <TextField
//           label="Mật khẩu"
//           variant="outlined"
//           type="password"
//           fullWidth
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           sx={{ marginBottom: 2 }}
//         />

//         {/* Button Đăng nhập */}
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleLogin}
//           sx={{ marginBottom: 2, backgroundColor: '#06A9AE', '&:hover': { backgroundColor: '#048C87' } }}
//         >
//           Đăng nhập
//         </Button>

//         {/* Liên kết Quên mật khẩu và Đăng ký */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
//           <Link href="/forgot-password" sx={{ color: 'gray', textDecoration: 'none' }}>
//             Quên mật khẩu?
//           </Link>
//           <Link href="/Signup" sx={{ color: 'gray', textDecoration: 'none' }}>
//             Đăng ký
//           </Link>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Login;


// src/page/Login.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && password) {
      if (onLoginSuccess) {
        onLoginSuccess(email, password).then(() => {
          navigate('/manager/dashboard'); // Điều hướng đến Dashboard sau khi đăng nhập thành công
        });
      }
    } else {
      alert('Vui lòng điền đầy đủ email và mật khẩu');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4f6f8',
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
        Đăng nhập
      </Typography>

      {/* Form Login */}
      <Box sx={{ width: '100%', maxWidth: 400, padding: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
        {/* Email */}
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Password */}
        <TextField
          label="Mật khẩu"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Button Đăng nhập */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ marginBottom: 2, backgroundColor: '#06A9AE', '&:hover': { backgroundColor: '#048C87' } }}
        >
          Đăng nhập
        </Button>

        {/* Liên kết Quên mật khẩu và Đăng ký */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <Link href="/forgot-password" sx={{ color: 'gray', textDecoration: 'none' }}>
            Quên mật khẩu?
          </Link>
          <Link href="/Signup" sx={{ color: 'gray', textDecoration: 'none' }}>
            Đăng ký
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;