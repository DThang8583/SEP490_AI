// src/Components/SubjectSpecialistManager/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Grid,
    Container,
    CircularProgress,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { api } from '../../api';
import axios from 'axios';
import {
    CheckCircle,
    Cancel,
    HourglassEmpty,
    TrendingUp,
    Dashboard as DashboardIcon,
    Assignment
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

// Styled components with better shadows and interactions
const DashboardCard = styled(Card)(({ theme, isDarkMode }) => ({
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: isDarkMode 
        ? '0 8px 24px rgba(0, 0, 0, 0.2)' 
        : '0 8px 24px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    height: '100%',
    position: 'relative',
    background: isDarkMode ? '#1E1E1E' : theme.palette.background.paper,
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: isDarkMode 
            ? '0 12px 30px rgba(0, 0, 0, 0.3)' 
            : '0 12px 30px rgba(0, 0, 0, 0.12)',
    },
}));

const CardHeader = styled(Box)(({ theme, bgcolor, isDarkMode }) => ({
    padding: theme.spacing(2),
    background: isDarkMode ? '#2D3436' : (bgcolor || theme.palette.primary.main),
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const Dashboard = ({ sidebarOpen }) => {
    const { isDarkMode } = useTheme();
    const [approvedLessons, setApprovedLessons] = useState(0);
    const [rejectedLessons, setRejectedLessons] = useState(0);
    const [pendingLessons, setPendingLessons] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userGradeNumber, setUserGradeNumber] = useState(null);
    const [allLessonsCount, setAllLessonsCount] = useState(0);
    const [totalLessonPlans, setTotalLessonPlans] = useState(0);
    const [pendingLessonPlans, setPendingLessonPlans] = useState(0);
    const [approvedLessonPlans, setApprovedLessonPlans] = useState(0);
    const [rejectedLessonPlans, setRejectedLessonPlans] = useState(0);

    const sidebarWidth = sidebarOpen ? 60 : 240; // sidebarOpen = true: thu nhỏ, false: mở rộng

    // Get user grade number
    const getUserGradeNumber = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            if (!accessToken || !userInfo || !userInfo.id) {
                throw new Error('Vui lòng đăng nhập để xem thông tin.');
            }

            const response = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/users/${userInfo.id}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            const userData = response.data?.data;
            if (!userData || !userData.grade) {
                throw new Error('Không tìm thấy thông tin khối.');
            }

            const gradeMatch = userData.grade.match(/\d+/);
            const gradeNumber = gradeMatch ? parseInt(gradeMatch[0], 10) : null;

            if (!gradeNumber) {
                throw new Error('Không thể xác định khối.');
            }

            return gradeNumber;
        } catch (err) {
            console.error('Lỗi khi lấy gradeNumber:', err);
            throw new Error(`Lỗi khi lấy gradeNumber: ${err.message}`);
        }
    }, []);

    const fetchTotalLessons = async () => {
        console.log('🚀 === BẮT ĐẦU GỌI API LESSONS ===');
        console.log('⏰ Thời gian bắt đầu:', new Date().toLocaleString('vi-VN'));
        
        const apiUrl = 'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons?Page=1&PageSize=999';
        console.log('📡 API URL:', apiUrl);
        
        try {
            // Gọi API
            console.log('📞 Đang gọi API với axios...');
            const response = await axios.get(apiUrl, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 giây timeout
            });
            
            console.log('📊 === RESPONSE INFO ===');
            console.log('✅ Response status:', response.status);
            console.log('✅ Response statusText:', response.statusText);
            console.log('✅ Response headers:', response.headers);
            console.log('✅ Response config:', response.config);
            
            // Kiểm tra response.data
            console.log('📄 === API RESPONSE DATA ===');
            console.log('📄 Response.data type:', typeof response.data);
            console.log('📄 Response.data keys:', Object.keys(response.data || {}));
            console.log('📄 Response.data.code:', response.data?.code);
            console.log('📄 Response.data.message:', response.data?.message);
            console.log('📄 Response.data.data type:', typeof response.data?.data);
            console.log('📄 Full response.data:', response.data);
            
            // Kiểm tra API response code
            if (response.data && response.data.code !== 0) {
                console.error('❌ API Error Code:', response.data.code);
                console.error('❌ API Error Message:', response.data.message);
                console.error('❌ Full response:', response.data);
                return;
            }
            
            // Kiểm tra data structure
            console.log('🔍 === KIỂM TRA DATA STRUCTURE ===');
            console.log('🔍 response.data exists:', !!response.data);
            console.log('🔍 response.data.data exists:', !!response.data?.data);
            console.log('🔍 response.data.data type:', typeof response.data?.data);
            
            if (response.data?.data) {
                console.log('🔍 response.data.data keys:', Object.keys(response.data.data));
                console.log('🔍 response.data.data.items exists:', !!response.data.data.items);
                console.log('🔍 response.data.data.totalSize exists:', !!response.data.data.totalSize);
                console.log('🔍 response.data.data.items type:', typeof response.data.data.items);
                console.log('🔍 response.data.data.items isArray:', Array.isArray(response.data.data.items));
                console.log('🔍 response.data.data.totalSize:', response.data.data.totalSize);
            }
            
            // Xử lý data
            if (response.data && response.data.code === 0) {
                console.log('📊 === XỬ LÝ DATA THÀNH CÔNG ===');
                
                // Kiểm tra totalSize
                if (response.data.data && response.data.data.totalSize !== undefined) {
                    console.log('🎯 Tổng số bài học (totalSize):', response.data.data.totalSize);
                    setAllLessonsCount(response.data.data.totalSize);
                } else if (response.data.data && response.data.data.items) {
                    // Fallback: đếm từ items array
                    const itemsCount = response.data.data.items.length;
                    console.log('🎯 Tổng số bài học (từ items.length):', itemsCount);
                    setAllLessonsCount(itemsCount);
                    
                    // Hiển thị chi tiết một vài bài học đầu tiên
                    console.log('\n📋 === CHI TIẾT 5 BÀI HỌC ĐẦU TIÊN ===');
                    response.data.data.items.slice(0, 5).forEach((lesson, index) => {
                        console.log(`${index + 1}. ID: ${lesson.lessonId}`);
                        console.log(`   Tên: "${lesson.name}"`);
                        console.log(`   Loại: ${lesson.lessonType}`);
                        console.log(`   Module: ${lesson.module}`);
                        console.log(`   Số tiết: ${lesson.totalPeriods}`);
                        console.log(`   Khối: ${lesson.gradeNumber}`);
                        console.log('   ---');
                    });
                    
                    // Thống kê lesson IDs
                    const lessonIds = response.data.data.items.map(lesson => lesson.lessonId).filter(id => id != null);
                    console.log('\n🔢 === THỐNG KÊ LESSON IDS ===');
                    console.log('🔢 Tổng số lesson IDs hợp lệ:', lessonIds.length);
                    console.log('🔢 10 IDs đầu tiên:', lessonIds.slice(0, 10));
                    console.log('🔢 10 IDs cuối cùng:', lessonIds.slice(-10));
                    
                    if (lessonIds.length > 0) {
                        console.log('🔢 Min lesson ID:', Math.min(...lessonIds));
                        console.log('🔢 Max lesson ID:', Math.max(...lessonIds));
                    }
                    
                    // Thống kê theo loại bài học
                    const lessonTypes = {};
                    response.data.data.items.forEach(lesson => {
                        const type = lesson.lessonType || 'Không xác định';
                        lessonTypes[type] = (lessonTypes[type] || 0) + 1;
                    });
                    
                    console.log('\n📈 === THỐNG KÊ THEO LOẠI BÀI HỌC ===');
                    Object.entries(lessonTypes).forEach(([type, count]) => {
                        console.log(`📌 ${type}: ${count} bài`);
                    });
                    
                    // Thống kê theo module
                    const modules = {};
                    response.data.data.items.forEach(lesson => {
                        const module = lesson.module || 'Không xác định';
                        modules[module] = (modules[module] || 0) + 1;
                    });
                    
                    console.log('\n📚 === THỐNG KÊ THEO MODULE ===');
                    Object.entries(modules).forEach(([module, count]) => {
                        console.log(`📖 ${module}: ${count} bài`);
                    });
                } else {
                    console.error('❌ Không tìm thấy totalSize hoặc items trong response.data.data');
                    console.error('❌ response.data.data value:', response.data.data);
                    setAllLessonsCount(0);
                }
                
                console.log('🎉 === FETCH TOTAL LESSONS THÀNH CÔNG ===');
            } else {
                console.error('❌ Response code không phải 0 hoặc response.data không tồn tại');
                setAllLessonsCount(0);
            }
            
        } catch (error) {
            console.error('\n🚨 === LỖI KHI GỌI API LESSONS ===');
            console.error('❌ Error type:', error.constructor.name);
            console.error('❌ Error message:', error.message);
            
            if (error.stack) {
                console.error('❌ Error stack:', error.stack);
            }
            
            // Kiểm tra axios error
            if (error.response) {
                console.error('📄 Error Response status:', error.response.status);
                console.error('📄 Error Response statusText:', error.response.statusText);
                console.error('📄 Error Response headers:', error.response.headers);
                console.error('📄 Error Response data:', error.response.data);
            } else if (error.request) {
                console.error('📡 Request was made but no response received');
                console.error('📡 Request:', error.request);
            } else {
                console.error('⚙️ Error setting up request:', error.message);
            }
            
            if (error.code) {
                console.error('❌ Error code:', error.code);
            }
            
            // Kiểm tra các loại lỗi cụ thể
            if (error.code === 'ENOTFOUND') {
                console.error('🌐 DNS resolution failed - Kiểm tra kết nối internet');
            } else if (error.code === 'ECONNREFUSED') {
                console.error('🔒 Connection refused - Server có thể đang down');
            } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
                console.error('⏰ Request timeout - Server phản hồi quá chậm');
            } else if (error.message.includes('Network Error')) {
                console.error('🌐 Network Error - Có thể là vấn đề CORS hoặc kết nối');
            }
            
            console.error('🔍 Full error object:', error);
            setAllLessonsCount(0);
            
        } finally {
            console.log('\n⏰ Thời gian kết thúc:', new Date().toLocaleString('vi-VN'));
            console.log('🏁 === KẾT THÚC FETCH TOTAL LESSONS ===\n');
        }
    };

    const fetchLessonPlansByStatus = async () => {
        try {
            // Fetch pending lessons (status 2)
            const pendingResponse = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans`,
                {
                    params: {
                        GradeId: userGradeNumber,
                        Status: 2,
                        Page: 1,
                        PageSize: 999
                    }
                }
            );

            // Fetch approved lessons (status 3)
            const approvedResponse = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans`,
                {
                    params: {
                        GradeId: userGradeNumber,
                        Status: 3,
                        Page: 1,
                        PageSize: 999
                    }
                }
            );

            // Fetch rejected lessons (status 4)
            const rejectedResponse = await axios.get(
                `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans`,
                {
                    params: {
                        GradeId: userGradeNumber,
                        Status: 4,
                        Page: 1,
                        PageSize: 999
                    }
                }
            );

            if (pendingResponse.data?.code === 0) {
                setPendingLessonPlans(pendingResponse.data.data.items.length);
            }
            if (approvedResponse.data?.code === 0) {
                setApprovedLessonPlans(approvedResponse.data.data.items.length);
            }
            if (rejectedResponse.data?.code === 0) {
                setRejectedLessonPlans(rejectedResponse.data.data.items.length);
            }

            // Calculate total
            const total = 
                (pendingResponse.data?.data?.items?.length || 0) +
                (approvedResponse.data?.data?.items?.length || 0) +
                (rejectedResponse.data?.data?.items?.length || 0);
            setTotalLessonPlans(total);

        } catch (error) {
            console.error('Error fetching lesson plans by status:', error);
            setError('Failed to fetch lesson plans data');
        }
    };

    useEffect(() => {
        fetchTotalLessons();
    }, []);

    useEffect(() => {
        const fetchLessonStats = async () => {
            setLoading(true);
            setError(null);

            try {
                const gradeNumber = await getUserGradeNumber();
                setUserGradeNumber(gradeNumber);

                if (gradeNumber) {
                    // Use mock data for now until CORS issues are resolved
                    try {
                        // Mock response based on the example payload
                        const mockItems = [
                            {
                                "teacherLessonId": 10,
                                "fullname": "Trần Nhật Nam",
                                "lesson": "Các số 7, 8, 9",
                                "module": "Các số đến 10",
                                "grade": 1,
                                "status": "Pending",
                                "createdAt": "11/04/2025 0:47",
                                "disapprovedReason": ""
                            },
                            {
                                "teacherLessonId": 9,
                                "fullname": "Trần Nhật Nam",
                                "lesson": "Ôn tập về số và phép tính trong phạm vi 100000",
                                "module": "Số tự nhiên",
                                "grade": 4,
                                "status": "Approved",
                                "createdAt": "10/04/2025 23:47",
                                "disapprovedReason": ""
                            },
                            {
                                "teacherLessonId": 8,
                                "fullname": "Trần Nhật Nam",
                                "lesson": "Ôn tập về hình học và đo lường",
                                "module": "Số tự nhiên",
                                "grade": 4,
                                "status": "Draft",
                                "createdAt": "10/04/2025 23:45",
                                "disapprovedReason": ""
                            },
                            {
                                "teacherLessonId": 7,
                                "fullname": "Trần Nhật Nam",
                                "lesson": "Hình vuông – Hình tròn – Hình tam giác – Hình chữ nhật",
                                "module": "Các số đến 10",
                                "grade": 1,
                                "status": "Pending",
                                "createdAt": "10/04/2025 21:10",
                                "disapprovedReason": ""
                            },
                            {
                                "teacherLessonId": 6,
                                "fullname": "Trần Nhật Nam",
                                "lesson": "Trên – Dưới. Phải – Trái. Trước – Sau. Ở giữa",
                                "module": "Các số đến 10",
                                "grade": 1,
                                "status": "Approved",
                                "createdAt": "10/04/2025 17:38",
                                "disapprovedReason": ""
                            }
                        ];

                        // Filter by status
                        const approvedItems = mockItems.filter(item => item.status === "Approved");
                        const rejectedItems = mockItems.filter(item => item.status === "Disapproved");
                        const pendingItems = mockItems.filter(item => item.status === "Pending");

                        setApprovedLessons(approvedItems.length);
                        setRejectedLessons(rejectedItems.length);
                        setPendingLessons(pendingItems.length);

                        console.log('Using mock data due to CORS issues. In production, this should connect to the real API.');
                    } catch (apiError) {
                        console.error('Error with mock data:', apiError);
                        setError('Lỗi xử lý dữ liệu. Vui lòng làm mới trang.');

                        // Set default values for lessons
                        setApprovedLessons(0);
                        setRejectedLessons(0);
                        setPendingLessons(0);
                    }
                }
            } catch (err) {
                console.error('Lỗi khi lấy thông tin người dùng:', err);
                setError('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại hoặc làm mới trang.');

                // Set default values for lessons
                setApprovedLessons(0);
                setRejectedLessons(0);
                setPendingLessons(0);
            } finally {
                setLoading(false);
            }
        };

        fetchLessonStats();
    }, [getUserGradeNumber]);

    useEffect(() => {
        if (userGradeNumber) {
            fetchLessonPlansByStatus();
        }
    }, [userGradeNumber]);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: isDarkMode 
                        ? 'linear-gradient(135deg, #1E1E1E 0%, #2D3436 100%)'
                        : 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1100,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <CircularProgress size={50} sx={{ color: '#06A9AE' }} />
                    <Typography variant="body1" sx={{ color: isDarkMode ? '#fff' : '#546e7a' }}>
                        Đang tải thông tin...
                    </Typography>
                </Box>
            </Box>
        );
    }

    // Calculate stats for progress indicators
    const totalLessons = approvedLessons + rejectedLessons + pendingLessons;
    const totalProcessedLessonPlans = approvedLessonPlans + rejectedLessonPlans;
    const approvalRate = totalProcessedLessonPlans > 0
        ? Math.round((approvedLessonPlans / totalProcessedLessonPlans) * 100)
        : 0;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: isDarkMode 
                    ? 'linear-gradient(135deg, #1E1E1E 0%, #2D3436 100%)'
                    : 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1100,
            }}
        >
            <Box
                sx={{
                    py: 4,
                    px: 2,
                    ml: `${sidebarWidth}px`,
                    transition: 'margin-left 0.3s ease',
                }}
            >
                <Container maxWidth="lg">
                    {/* Header with dashboard title and subtitle */}
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                        <DashboardIcon sx={{ fontSize: 36, color: '#06A9AE', mr: 2 }} />
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: isDarkMode ? '#fff' : '#212B36',
                                    lineHeight: 1.2,
                                }}
                            >
                                Bảng điều khiển
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381',
                                    mt: 0.5,
                                }}
                            >
                                Quản lý chuyên gia khối {userGradeNumber || '?'}
                            </Typography>
                        </Box>
                    </Box>

                    {error && (
                        <DashboardCard
                            isDarkMode={isDarkMode}
                            sx={{
                                mb: 4,
                                bgcolor: isDarkMode ? 'rgba(255, 72, 66, 0.15)' : 'rgba(255, 72, 66, 0.08)',
                                borderLeft: '4px solid #d32f2f',
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ color: '#d32f2f', mb: 1 }}>
                                    Lỗi
                                </Typography>
                                <Typography sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381' }}>{error}</Typography>
                            </CardContent>
                        </DashboardCard>
                    )}

                    {/* Overview card */}
                    <DashboardCard isDarkMode={isDarkMode}>
                        <CardHeader bgcolor="#06A9AE" isDarkMode={isDarkMode}>
                            <Box display="flex" alignItems="center">
                                <TrendingUp sx={{ mr: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Tổng quan
                                </Typography>
                            </Box>
                        </CardHeader>
                        <CardContent sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            bgcolor: isDarkMode 
                                                ? 'rgba(0, 171, 85, 0.15)' 
                                                : 'rgba(0, 171, 85, 0.08)',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography variant="h5" sx={{ color: '#00AB55', fontWeight: 600, mb: 1 }}>
                                            {allLessonsCount}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381' }}>
                                            Tổng số bài học
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            bgcolor: isDarkMode 
                                                ? 'rgba(25, 118, 210, 0.15)' 
                                                : 'rgba(25, 118, 210, 0.08)',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>
                                            {approvalRate}%
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381' }}>
                                            Tỷ lệ duyệt
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3, bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: isDarkMode ? '#fff' : '#212B36',
                                        fontWeight: 600,
                                        mb: 2,
                                    }}
                                >
                                    Phân tích
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 1,
                                                bgcolor: isDarkMode 
                                                    ? 'rgba(0, 171, 85, 0.15)' 
                                                    : 'rgba(0, 171, 85, 0.08)',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    bgcolor: '#00AB55',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                }}
                                            >
                                                <CheckCircle sx={{ color: '#fff' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381' }}>
                                                    Đã duyệt
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: isDarkMode ? '#fff' : '#212B36' }}>
                                                    {approvedLessonPlans}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 1,
                                                bgcolor: isDarkMode 
                                                    ? 'rgba(255, 72, 66, 0.15)' 
                                                    : 'rgba(255, 72, 66, 0.08)',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    bgcolor: '#FF4842',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                }}
                                            >
                                                <Cancel sx={{ color: '#fff' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381' }}>
                                                    Đã từ chối
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: isDarkMode ? '#fff' : '#212B36' }}>
                                                    {rejectedLessonPlans}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 1,
                                                bgcolor: isDarkMode 
                                                    ? 'rgba(255, 171, 0, 0.15)' 
                                                    : 'rgba(255, 171, 0, 0.08)',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    bgcolor: '#FFAB00',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                }}
                                            >
                                                <HourglassEmpty sx={{ color: '#fff' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381' }}>
                                                    Đang chờ duyệt
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: isDarkMode ? '#fff' : '#212B36' }}>
                                                    {pendingLessonPlans}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 1,
                                                bgcolor: isDarkMode 
                                                    ? 'rgba(25, 118, 210, 0.15)' 
                                                    : 'rgba(25, 118, 210, 0.08)',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    bgcolor: '#1976d2',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                }}
                                            >
                                                <Assignment sx={{ color: '#fff' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#637381' }}>
                                                    Tổng số giáo án
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: isDarkMode ? '#fff' : '#212B36' }}>
                                                    {totalLessonPlans}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </DashboardCard>
                </Container>
            </Box>
        </Box>
    );
};

export default Dashboard;