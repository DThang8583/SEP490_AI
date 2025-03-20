import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { Box, Typography, TextField, Button } from '@mui/material';

const EditProfile = () => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.getProfile().then((res) => setProfile(res.data));
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        api.updateProfile(profile).then(() => {
            alert('Thông tin cập nhật thành công!');
            navigate('/manager/profile');
        });
    };

    if (!profile) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ p: 4, maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Chỉnh sửa thông tin</Typography>
            <TextField label="Họ và tên" name="name" value={profile.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Email" name="email" value={profile.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Số điện thoại" name="phone" value={profile.phone} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Ngày sinh" name="dob" value={profile.dateOfBirth} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Giới tính" name="gender" value={profile.gender} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Địa chỉ" name="address" value={profile.address} onChange={handleChange} fullWidth sx={{ mb: 2 }} />

            <Button onClick={handleSave} variant="contained" sx={{ mr: 2 }}>Xác nhận</Button>
            <Button onClick={() => navigate('/manager/profile')} variant="outlined">Hủy</Button>
        </Box>
    );
};

export default EditProfile;
