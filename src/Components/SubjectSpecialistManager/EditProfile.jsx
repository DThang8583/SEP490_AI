import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar
} from '@mui/material';
import { SaveOutlined, Person } from '@mui/icons-material';

const EditProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        school: '',
        grade: '',
        wardId: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const userInfoStr = localStorage.getItem('userInfo');

                if (!accessToken || !userInfoStr) {
                    setError('Vui lòng đăng nhập để xem thông tin cá nhân.');
                    setLoading(false);
                    return;
                }

                const userInfo = JSON.parse(userInfoStr);

                if (!userInfo.id) {
                    setError('Không tìm thấy thông tin người dùng.');
                    setLoading(false);
                    return;
                }

                console.log("Fetching user profile with ID:", userInfo.id);

                const response = await axios.get(
                    `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userInfo.id}/update`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );

                console.log("API Response:", response.data);

                if (response.data && response.data.data) {
                    const userData = response.data.data;
                    setProfile(userData);
                    setFormData({
                        fullname: userData.fullname || '',
                        email: userData.email || '',
                        phoneNumber: userData.phoneNumber || '',
                        dateOfBirth: userData.dateOfBirth || '',
                        gender: userData.gender || '',
                        address: userData.address || '',
                        school: userData.school || '',
                        grade: userData.grade || '',
                        wardId: userData.wardId || 0,
                    });
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (err) {
                console.error('Lỗi khi lấy thông tin hồ sơ:', err);
                setError('Không thể tải thông tin. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        try {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            if (!accessToken || !userInfo || !userInfo.id) {
                setError('Vui lòng đăng nhập để thực hiện chức năng này.');
                return;
            }

            // Format date to YYYY-MM-DD if in DD/MM/YYYY format
            let formattedDate = formData.dateOfBirth;
            if (formData.dateOfBirth && formData.dateOfBirth.includes('/')) {
                const parts = formData.dateOfBirth.split('/');
                if (parts.length === 3) {
                    formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            }

            const requestData = {
                fullname: formData.fullname,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                dateOfBirth: formattedDate,
                gender: parseInt(formData.gender) || 0,
                address: formData.address,
                wardId: formData.wardId || 0,
            };

            console.log("Updating profile for user ID:", userInfo.id);
            console.log("Update data:", requestData);

            const response = await axios.put(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userInfo.id}`,
                requestData,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            console.log("Update response:", response.data);

            // Handle various success response formats
            if (response.data) {
                // Check for success message in different formats
                if (response.data.code === 0 ||
                    response.data.status === 200 ||
                    response.data.message === "Updated successfully!" ||
                    response.status === 200) {

                    setSuccess('Cập nhật thông tin thành công!');
                    console.log("Updated user information:", response.data.data || response.data);

                    // Update profile state with new data if available
                    if (response.data.data) {
                        setProfile(response.data.data);
                    }

                    return; // Exit early on success
                }
            }

            // If we reach here, response didn't match expected success format
            throw new Error(response.data?.message || "Cập nhật thất bại");

        } catch (err) {
            console.error('Lỗi khi cập nhật thông tin:', err);

            // Don't treat "Updated successfully!" as an error
            if (err.message === "Updated successfully!") {
                setSuccess('Cập nhật thông tin thành công!');
            } else {
                setError(err.response?.data?.message || err.message || 'Không thể cập nhật thông tin. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar sx={{ bgcolor: '#06A9AE', mr: 2 }}>
                        <Person />
                    </Avatar>
                    <Typography variant="h5" component="h1">
                        Chỉnh sửa thông tin cá nhân
                    </Typography>
                </Box>

                {loading && !profile ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress sx={{ color: '#06A9AE' }} />
                    </Box>
                ) : error && !profile ? (
                    <Alert severity="error" sx={{ my: 2 }}>
                        {error}
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Họ và tên"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Số điện thoại"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Ngày sinh (DD/MM/YYYY)"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    placeholder="DD/MM/YYYY"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Giới tính</InputLabel>
                                    <Select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        label="Giới tính"
                                    >
                                        <MenuItem value={1}>Nam</MenuItem>
                                        <MenuItem value={2}>Nữ</MenuItem>
                                        <MenuItem value={0}>Khác</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Lớp"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Số nhà/Tên đường"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Trường"
                                    name="school"
                                    value={formData.school}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(-1)}
                                        sx={{ borderRadius: '8px' }}
                                    >
                                        Quay lại
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SaveOutlined />}
                                        disabled={loading}
                                        sx={{
                                            borderRadius: '8px',
                                            bgcolor: '#06A9AE',
                                            '&:hover': {
                                                bgcolor: '#048C87'
                                            }
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Lưu thay đổi'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Paper>
        </Container>
    );
};

export default EditProfile;
