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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    Card,
    CardContent,
    Fade
} from '@mui/material';
import { SaveOutlined, Person, Email, Phone, Cake, Class, LocationOn, School } from '@mui/icons-material';

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
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1100,
                overflowY: 'auto',
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
            }}
        >
            <Fade in={true}>
                <Box
                    sx={{
                        py: 2,
                        width: '100%',
                    }}
                >
                    <Container maxWidth="lg" sx={{ py: 2 }}>
                        <Card
                            elevation={6}
                            sx={{
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 10px 40px rgba(31, 38, 135, 0.15)',
                                maxWidth: '1000px',
                                margin: '0 auto',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    height: 120,
                                    background: 'linear-gradient(120deg, #06A9AE 0%, #0089a3 100%)',
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '40%',
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.2))',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: -50,
                                        left: { xs: '50%', sm: 40 },
                                        transform: { xs: 'translateX(-50%)', sm: 'translateX(0)' },
                                    }}
                                >
                                    <Avatar
                                        src={profile?.imgURL || 'https://via.placeholder.com/150'}
                                        alt="Ảnh đại diện"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            border: '4px solid white',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        position: 'absolute',
                                        top: { xs: 20, sm: 30 },
                                        left: { xs: '50%', sm: 40 },
                                        transform: { xs: 'translateX(-50%)', sm: 'translateX(0)' },
                                        color: 'white',
                                        fontWeight: 600,
                                        textAlign: { xs: 'center', sm: 'left' },
                                    }}
                                >
                                    Chỉnh sửa thông tin cá nhân
                                </Typography>
                            </Box>

                            <CardContent sx={{ pt: 5, px: { xs: 2, sm: 3 }, pb: 2 }}>
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
                                                    InputProps={{
                                                        startAdornment: <Person sx={{ mr: 1, color: '#06A9AE' }} />,
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '12px',
                                                            backgroundColor: 'rgba(6, 169, 174, 0.04)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(6, 169, 174, 0.08)',
                                                            },
                                                        },
                                                    }}
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
                                                    InputProps={{
                                                        startAdornment: <Email sx={{ mr: 1, color: '#06A9AE' }} />,
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '12px',
                                                            backgroundColor: 'rgba(6, 169, 174, 0.04)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(6, 169, 174, 0.08)',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Số điện thoại"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleInputChange}
                                                    InputProps={{
                                                        startAdornment: <Phone sx={{ mr: 1, color: '#06A9AE' }} />,
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '12px',
                                                            backgroundColor: 'rgba(6, 169, 174, 0.04)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(6, 169, 174, 0.08)',
                                                            },
                                                        },
                                                    }}
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
                                                    InputProps={{
                                                        startAdornment: <Cake sx={{ mr: 1, color: '#06A9AE' }} />,
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '12px',
                                                            backgroundColor: 'rgba(6, 169, 174, 0.04)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(6, 169, 174, 0.08)',
                                                            },
                                                        },
                                                    }}
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
                                                        startAdornment={<Person sx={{ mr: 1, color: '#06A9AE' }} />}
                                                        sx={{
                                                            borderRadius: '12px',
                                                            backgroundColor: 'rgba(6, 169, 174, 0.04)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(6, 169, 174, 0.08)',
                                                            },
                                                        }}
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
                                                    InputProps={{
                                                        startAdornment: <Class sx={{ mr: 1, color: '#06A9AE' }} />,
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '12px',
                                                            backgroundColor: 'rgba(6, 169, 174, 0.04)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(6, 169, 174, 0.08)',
                                                            },
                                                        },
                                                    }}
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
                                                    InputProps={{
                                                        startAdornment: <LocationOn sx={{ mr: 1, color: '#06A9AE' }} />,
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '12px',
                                                            backgroundColor: 'rgba(6, 169, 174, 0.04)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(6, 169, 174, 0.08)',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Trường"
                                                    name="school"
                                                    value={formData.school}
                                                    onChange={handleInputChange}
                                                    InputProps={{
                                                        startAdornment: <School sx={{ mr: 1, color: '#06A9AE' }} />,
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '12px',
                                                            backgroundColor: 'rgba(6, 169, 174, 0.04)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(6, 169, 174, 0.08)',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => navigate(-1)}
                                                        sx={{
                                                            borderRadius: '8px',
                                                            borderColor: '#06A9AE',
                                                            color: '#06A9AE',
                                                            '&:hover': {
                                                                borderColor: '#048b8f',
                                                                backgroundColor: 'rgba(6, 169, 174, 0.04)',
                                                            },
                                                        }}
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
                                                            backgroundColor: '#06A9AE',
                                                            boxShadow: '0 4px 12px rgba(6, 169, 174, 0.2)',
                                                            '&:hover': {
                                                                backgroundColor: '#048b8f',
                                                                boxShadow: '0 6px 15px rgba(6, 169, 174, 0.3)',
                                                            },
                                                        }}
                                                    >
                                                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Lưu thay đổi'}
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </Container>
                </Box>
            </Fade>
        </Box>
    );
};

export default EditProfile;
