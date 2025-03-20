import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { Box, Typography, TextField, Button } from '@mui/material';

const ChangePassword = () => {
    const [password, setPassword] = useState({ newPassword: '', confirmPassword: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (password.newPassword !== password.confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }
        api.changePassword({ newPassword: password.newPassword }).then(() => {
            alert('Đổi mật khẩu thành công!');
            navigate('/manager/profile');
        });
    };

    return (
        <Box sx={{ p: 4, maxWidth: '400px', margin: '0 auto' }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Đổi mật khẩu</Typography>
            <TextField label="Mật khẩu mới" name="newPassword" type="password" onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Xác nhận mật khẩu" name="confirmPassword" type="password" onChange={handleChange} fullWidth sx={{ mb: 2 }} />

            <Button onClick={handleSave} variant="contained" sx={{ mr: 2 }}>Xác nhận</Button>
            <Button onClick={() => navigate('/manager/profile')} variant="outlined">Hủy</Button>
        </Box>
    );
};

export default ChangePassword;
