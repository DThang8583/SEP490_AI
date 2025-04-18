import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const COLORS = {
    primary: '#06A9AE',
    secondary: '#1976d2',
    success: '#00AB55',
    error: '#FF4842',
    warning: '#FFAB00',
    background: {
        default: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
        paper: '#FFFFFF',
        secondary: 'rgba(6, 169, 174, 0.02)',
    },
    text: {
        primary: '#212B36',
        secondary: '#637381',
    }
};

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: 'rgba(6, 169, 174, 0.08)',
    border: `1px solid ${theme.palette.grey[300]}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
        backgroundColor: 'rgba(6, 169, 174, 0.04)',
    },
}));

const StyledButton = styled(Button)({
    borderRadius: 8,
    padding: '8px 16px',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
    },
    '&.MuiButton-contained': {
        backgroundColor: COLORS.primary,
        color: '#fff',
        '&:hover': {
            backgroundColor: COLORS.primary,
        }
    },
    '&.MuiButton-outlined': {
        borderColor: COLORS.primary,
        color: COLORS.primary,
        '&:hover': {
            backgroundColor: 'rgba(6, 169, 174, 0.08)',
            borderColor: COLORS.primary
        }
    }
});

const CurriculumDetail = () => {
    const { curriculumId } = useParams();
    const navigate = useNavigate();
    const [curriculumData, setCurriculumData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Kiểm tra authentication
    const checkAuthentication = () => {
        const accessToken = localStorage.getItem('accessToken');
        const userInfo = localStorage.getItem('userInfo');

        if (!accessToken || !userInfo) {
            throw new Error('Vui lòng đăng nhập để xem nội dung');
        }

        return accessToken;
    };

    useEffect(() => {
        const fetchCurriculumDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const accessToken = checkAuthentication();

                console.log('Fetching curriculum with ID:', curriculumId);
                const response = await axios.get(
                    `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/${curriculumId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }
                );

                if (response.data.code === 0) {
                    console.log('Curriculum data:', response.data.data);
                    setCurriculumData(response.data.data);
                } else {
                    throw new Error(response.data.message || 'Không thể tải dữ liệu');
                }
            } catch (err) {
                console.error('Error fetching curriculum:', err);
                if (err.message === 'Vui lòng đăng nhập để xem nội dung') {
                    setError('Vui lòng đăng nhập để xem nội dung');
                    navigate('/login', { state: { from: `/manager/curriculum-detail/${curriculumId}` } });
                } else if (err.response && err.response.status === 401) {
                    setError('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    navigate('/login', { state: { from: `/manager/curriculum-detail/${curriculumId}` } });
                } else {
                    setError('Đã xảy ra lỗi khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
                }
            } finally {
                setLoading(false);
            }
        };

        if (curriculumId) {
            fetchCurriculumDetail();
        }
    }, [curriculumId, navigate]);

    const handleBack = () => {
        navigate('/manager/curriculum-framework');
    };

    const handleViewCurriculumDetail = (curriculumId) => {
        navigate(`/manager/curriculum-detail/${curriculumId}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <StyledButton
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                >
                    Quay lại
                </StyledButton>
                <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            </Box>
        );
    }

    if (!curriculumData) {
        return (
            <Box sx={{ p: 3 }}>
                <StyledButton
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                >
                    Quay lại
                </StyledButton>
                <Alert severity="info">Không có dữ liệu để hiển thị</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <StyledButton
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
            >
                Quay lại
            </StyledButton>

            <Typography variant="h5" sx={{ mb: 3, color: '#06A9AE', fontWeight: 600 }}>
                {curriculumData.name}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
                {curriculumData.description}
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    Năm học: {curriculumData.year}
                </Typography>
                <Typography variant="body2">
                    Tổng số tiết: {curriculumData.totalPeriods}
                </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Mạch</StyledTableCell>
                            <StyledTableCell>Chủ đề</StyledTableCell>
                            <StyledTableCell>Nội dung</StyledTableCell>
                            <StyledTableCell>Yêu cầu cần đạt</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {curriculumData.curriculumDetails?.map((detail) => (
                            <StyledTableRow key={detail.curriculumDetailId}>
                                <TableCell>{detail.curriculumTopic}</TableCell>
                                <TableCell>{detail.curriculumSection}</TableCell>
                                <TableCell>{detail.curriculumContent}</TableCell>
                                <TableCell style={{ whiteSpace: 'pre-line' }}>
                                    {detail.curriculumGoal}
                                </TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CurriculumDetail;