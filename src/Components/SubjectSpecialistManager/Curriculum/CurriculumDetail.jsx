import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import axios from 'axios';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Add color constants similar to CurriculumFramework
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
    },
    hover: {
        primary: 'rgba(6, 169, 174, 0.08)',
        secondary: 'rgba(25, 118, 210, 0.08)',
    }
};

const CurriculumDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [curriculum, setCurriculum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States for CRUD operations
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDetail, setEditingDetail] = useState(null);
    const [formData, setFormData] = useState({
        curriculumContent: '',
        curriculumGoal: '',
        curriculumSubSectionId: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for curriculum sub-sections
    const [curriculumSubSections, setCurriculumSubSections] = useState([]);
    useEffect(() => {
        // Fetch curriculum sub-sections
        const fetchSubSections = async () => {
            try {
                const subSectionsResponse = await axios.get('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/sub-sections');
                if (subSectionsResponse.data.code === 0 && subSectionsResponse.data.data) {
                    console.log("API Response:", subSectionsResponse.data.data);
                    setCurriculumSubSections(subSectionsResponse.data.data);
                } else {
                    console.error('Failed to fetch curriculum sub-sections:', subSectionsResponse.data.message);
                }
            } catch (err) {
                console.error('Error fetching curriculum sub-sections:', err);
            }
        };

        const fetchCurriculum = async () => {
            try {
                const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/${id}`);
                if (response.data.code === 0 && response.data.data) {
                    setCurriculum(response.data.data);
                } else {
                    setError('Failed to fetch curriculum data');
                }
            } catch (err) {
                setError('Error fetching curriculum data');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCurriculum();
            fetchSubSections();
        } else {
            setError('No curriculum ID provided');
            setLoading(false);
        }
    }, [id]);

    // Function to refresh curriculum data
    const refreshCurriculumData = async () => {
        try {
            const response = await axios.get(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/${id}`);
            if (response.data.code === 0 && response.data.data) {
                setCurriculum(response.data.data);
            }
        } catch (err) {
            console.error('Error refreshing curriculum data:', err);
        }
    };

    // Handle Add New Detail
    const handleAddDetail = async () => {
        if (!formData.curriculumContent.trim() || !formData.curriculumGoal.trim()) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/detail', {
                curriculumContent: formData.curriculumContent,
                curriculumGoal: formData.curriculumGoal,
                curriculumId: parseInt(id),
                curriculumSubSectionId: formData.curriculumSubSectionId
            });

            if (response.data.code === 0 || response.data.code === 21) {
                alert('Thêm nội dung cần đạt thành công!');
                setShowAddModal(false);
                setFormData({ curriculumContent: '', curriculumGoal: '', curriculumSubSectionId: '' });
                setIsSubmitting(false);
                await refreshCurriculumData();
            } else {
                alert('Lỗi khi thêm: ' + (response.data.message || 'Unknown error'));
            }
        } catch (err) {
            alert('Lỗi khi thêm: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Edit Detail
    const handleEditDetail = async () => {
        if (!formData.curriculumContent.trim() || !formData.curriculumGoal.trim()) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.put(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/detail/${editingDetail.curriculumDetailId}`, {
                curriculumContent: formData.curriculumContent,
                curriculumGoal: formData.curriculumGoal,
                curriculumId: parseInt(id),
                curriculumSubSectionId: formData.curriculumSubSectionId
            });

            if (response.data.code === 0) {
                alert('Cập nhật nội dung cần đạt thành công!');
                setShowEditModal(false);
                setEditingDetail(null);
                setFormData({ curriculumContent: '', curriculumGoal: '', curriculumSubSectionId: '' });
                setIsSubmitting(false);
                await refreshCurriculumData();
            } else {
                alert('Lỗi khi cập nhật: ' + (response.data.message || 'Unknown error'));
            }
        } catch (err) {
            alert('Lỗi khi cập nhật: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Delete Detail
    const handleDeleteDetail = async (detailId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa nội dung này không?')) {
            return;
        }

        try {
            const response = await axios.delete(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/detail/${detailId}`);
            console.log('Delete response code:', response.data.code);
            if (response.data.code === 0 || response.data.code === 31) {
                alert('Xóa nội dung cần đạt thành công!');
                setIsSubmitting(false);
                await refreshCurriculumData();
            } else {
                alert('Lỗi khi xóa: ' + (response.data.message || 'Unknown error'));
            }
        } catch (err) {
            alert('Lỗi khi xóa: ' + err.message);
        }
    };

    // Open edit modal with data
    const openEditModal = (detail) => {
        setEditingDetail(detail);
        setFormData({
            curriculumContent: detail.curriculumContent,
            curriculumGoal: detail.curriculumGoal,
            curriculumSubSectionId: detail.curriculumSubSectionId || ''
        });
        setShowEditModal(true);
    };

    const handleBackClick = () => {
        navigate('/manager/curriculum-framework');
    };

    if (loading) {
        return (
            <Box
                sx={{
                    width: 'calc(100% - 78px)',
                    height: '100vh',
                    background: '#f8f9fa',
                    position: 'fixed',
                    top: 0,
                    left: '78px',
                    right: 0,
                    bottom: 0,
                    overflow: 'auto',
                    zIndex: 1100,
                    paddingTop: 0,
                }}
            >
                <div style={{
                    padding: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}>
                    Loading...
                </div>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    width: 'calc(100% - 78px)',
                    height: '100vh',
                    background: '#f8f9fa',
                    position: 'fixed',
                    top: 0,
                    left: '78px',
                    right: 0,
                    bottom: 0,
                    overflow: 'auto',
                    zIndex: 1100,
                    paddingTop: 0,
                }}
            >
                <div style={{
                    padding: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    color: 'red'
                }}>
                    {error}
                </div>
            </Box>
        );
    }

    if (!curriculum) {
        return (
            <Box
                sx={{
                    width: 'calc(100% - 78px)',
                    height: '100vh',
                    background: '#f8f9fa',
                    position: 'fixed',
                    top: 0,
                    left: '78px',
                    right: 0,
                    bottom: 0,
                    overflow: 'auto',
                    zIndex: 1100,
                    paddingTop: 0,
                }}
            >
                <div style={{
                    padding: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh'
                }}>
                    No curriculum data found
                </div>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: 'calc(100% - 78px)',
                height: '100vh',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                position: 'fixed',
                top: 0,
                left: '78px',
                right: 0,
                bottom: 0,
                overflow: 'auto',
                zIndex: 1100,
                paddingTop: 0,
            }}
        >
            <div style={{
                padding: '40px',
                minHeight: '100vh'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '40px'
                    }}>
                        <h1 style={{
                            fontSize: '32px',
                            color: '#1a237e',
                            margin: 0,
                            fontWeight: '700',
                            letterSpacing: '-0.5px'
                        }}>Chi tiết nội dung cần đạt</h1>
                        <button
                            onClick={handleBackClick}
                            style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #06A9AE 0%, #048a8d 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(6, 169, 174, 0.2)'
                            }}
                        >
                            Quay lại
                        </button>
                    </div>

                    <div style={{
                        backgroundColor: 'white',
                        padding: '32px',
                        borderRadius: '16px',
                        marginBottom: '32px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        transition: 'transform 0.3s ease'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            color: '#1a237e',
                            marginBottom: '24px',
                            paddingBottom: '16px',
                            borderBottom: '3px solid #06A9AE',
                            fontWeight: '600'
                        }}>Thông tin chung</h2>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'separate',
                            borderSpacing: '0 12px'
                        }}>
                            <tbody>
                                {[
                                    { label: 'Tên chương trình', value: curriculum.name },
                                    { label: 'Mô tả', value: curriculum.description },
                                    { label: 'Năm học', value: curriculum.year },
                                    { label: 'Tổng số tiết', value: curriculum.totalPeriods }
                                ].map((item, index) => (
                                    <tr key={index}>
                                        <td style={{
                                            padding: '16px 20px',
                                            fontWeight: '600',
                                            width: '200px',
                                            color: '#1a237e',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '12px 0 0 12px',
                                            fontSize: '15px'
                                        }}>{item.label}</td>
                                        <td style={{
                                            padding: '16px 20px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '0 12px 12px 0',
                                            fontSize: '15px',
                                            color: '#2c3e50'
                                        }}>{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{
                        backgroundColor: 'white',
                        padding: '32px',
                        borderRadius: '16px',
                        marginBottom: '32px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px',
                            paddingBottom: '16px',
                            borderBottom: '3px solid #06A9AE'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                color: '#1a237e',
                                margin: 0,
                                fontWeight: '600'
                            }}>Nội dung cần đạt</h2>
                            <button
                                onClick={() => setShowAddModal(true)}
                                style={{
                                    padding: '8px 20px',
                                    background: COLORS.primary,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                    textTransform: 'none'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                                }}
                            >
                                <AddIcon sx={{ fontSize: '20px' }} />
                                Thêm nội dung
                            </button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'separate',
                                borderSpacing: '0'
                            }}>
                                <thead>
                                    <tr>
                                        {['Chủ đề', 'Mạch nội dung', 'Nội dung', 'Yêu cầu cần đạt', 'Mạch kiến thức', 'Thao tác'].map((header, index) => (
                                            <th key={index} style={{
                                                padding: '16px 20px',
                                                background: 'linear-gradient(135deg, #06A9AE 0%, #048a8d 100%)',
                                                color: 'white',
                                                textAlign: 'left',
                                                fontWeight: '600',
                                                fontSize: '15px',
                                                borderRadius: index === 0 ? '12px 0 0 0' :
                                                    index === 5 ? '0 12px 0 0' : '0',
                                                minWidth: index === 5 ? '180px' : 'auto'
                                            }}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {curriculum.curriculumDetails.map((detail, index) => (
                                        <tr key={detail.curriculumDetailId} style={{
                                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: '1px solid #e9ecef',
                                                fontSize: '15px'
                                            }}>{detail.curriculumTopic}</td>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: '1px solid #e9ecef',
                                                fontSize: '15px'
                                            }}>{detail.curriculumSection}</td>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: '1px solid #e9ecef',
                                                fontSize: '15px'
                                            }}>{detail.curriculumContent}</td>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: '1px solid #e9ecef',
                                                fontSize: '15px'
                                            }}>{detail.curriculumGoal}</td>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: '1px solid #e9ecef',
                                                fontSize: '15px'
                                            }}>{detail.curriculumSubSection}</td>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: '1px solid #e9ecef',
                                                fontSize: '15px'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '8px',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'center'
                                                }}>
                                                    <IconButton
                                                        onClick={() => openEditModal(detail)}
                                                        sx={{
                                                            color: COLORS.primary,
                                                            bgcolor: 'rgba(6, 169, 174, 0.08)',
                                                            borderRadius: '8px',
                                                            p: 1,
                                                            '&:hover': {
                                                                bgcolor: 'rgba(6, 169, 174, 0.15)',
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)'
                                                            },
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <EditIcon sx={{ fontSize: '20px' }} />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDeleteDetail(detail.curriculumDetailId)}
                                                        sx={{
                                                            color: COLORS.error,
                                                            bgcolor: 'rgba(255, 72, 66, 0.08)',
                                                            borderRadius: '8px',
                                                            p: 1,
                                                            '&:hover': {
                                                                bgcolor: 'rgba(255, 72, 66, 0.15)',
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)'
                                                            },
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: '20px' }} />
                                                    </IconButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: 'white',
                        padding: '32px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            color: '#1a237e',
                            marginBottom: '24px',
                            paddingBottom: '16px',
                            borderBottom: '3px solid #06A9AE',
                            fontWeight: '600'
                        }}>Hoạt động giáo dục</h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'separate',
                                borderSpacing: '0'
                            }}>
                                <thead>
                                    <tr>
                                        <th style={{
                                            padding: '16px 20px',
                                            background: 'linear-gradient(135deg, #06A9AE 0%, #048a8d 100%)',
                                            color: 'white',
                                            textAlign: 'center',
                                            fontWeight: '600',
                                            width: '80px',
                                            fontSize: '15px',
                                            borderRadius: '12px 0 0 0'
                                        }}>STT</th>
                                        <th style={{
                                            padding: '16px 20px',
                                            background: 'linear-gradient(135deg, #06A9AE 0%, #048a8d 100%)',
                                            color: 'white',
                                            textAlign: 'left',
                                            fontWeight: '600',
                                            fontSize: '15px',
                                            borderRadius: '0 12px 0 0'
                                        }}>Mô tả hoạt động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {curriculum.curriculumActivities.map((activity, index) => (
                                        <tr key={activity.curriculumActivityId} style={{
                                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: '1px solid #e9ecef',
                                                textAlign: 'center',
                                                fontWeight: '600',
                                                color: '#06A9AE',
                                                fontSize: '15px'
                                            }}>{index + 1}</td>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: '1px solid #e9ecef',
                                                fontSize: '15px'
                                            }}>
                                                {activity.curriculumAcitityDescription}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Add Modal */}
                    {showAddModal && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 2000,
                            backdropFilter: 'blur(4px)'
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                padding: '32px',
                                borderRadius: '16px',
                                width: '600px',
                                maxHeight: '80vh',
                                overflow: 'auto',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                border: '1px solid #e9ecef'
                            }}>
                                <h3 style={{
                                    margin: '0 0 24px 0',
                                    color: '#1a237e',
                                    fontSize: '22px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    fontWeight: '600'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(0, 171, 85, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <AddIcon sx={{ fontSize: '20px', color: '#00AB55' }} />
                                    </div>
                                    Thêm nội dung cần đạt mới
                                </h3>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#1a237e',
                                        fontSize: '14px'
                                    }}>
                                        Nội dung: <span style={{ color: '#d32f2f' }}>*</span>
                                    </label>
                                    <textarea
                                        value={formData.curriculumContent}
                                        onChange={(e) => setFormData(prev => ({ ...prev, curriculumContent: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            height: '100px',
                                            padding: '12px',
                                            border: '2px solid #e9ecef',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            transition: 'border-color 0.3s ease',
                                            outline: 'none'
                                        }}
                                        placeholder="Nhập nội dung..."
                                        onFocus={(e) => e.target.style.borderColor = '#06A9AE'}
                                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#1a237e',
                                        fontSize: '14px'
                                    }}>
                                        Yêu cầu cần đạt: <span style={{ color: '#d32f2f' }}>*</span>
                                    </label>
                                    <textarea
                                        value={formData.curriculumGoal}
                                        onChange={(e) => setFormData(prev => ({ ...prev, curriculumGoal: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            height: '100px',
                                            padding: '12px',
                                            border: '2px solid #e9ecef',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            transition: 'border-color 0.3s ease',
                                            outline: 'none'
                                        }}
                                        placeholder="Nhập yêu cầu cần đạt..."
                                        onFocus={(e) => e.target.style.borderColor = '#06A9AE'}
                                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                    />
                                </div>

                                <div style={{ marginBottom: '28px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#1a237e',
                                        fontSize: '14px'
                                    }}>
                                        Mạch kiến thức:
                                    </label>
                                    <select
                                        value={formData.curriculumSubSectionId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, curriculumSubSectionId: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #e9ecef',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            transition: 'border-color 0.3s ease',
                                            outline: 'none',
                                            backgroundColor: 'white'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#06A9AE'}
                                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                    >
                                        <option value="">-- Chọn mạch kiến thức --</option>
                                        {curriculumSubSections.map((section) => (
                                            <option
                                                key={section.curriculumSubSectionId}
                                                value={section.curriculumSubSectionId}
                                            >
                                                {section.curriculumSubSectionName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setFormData({ curriculumContent: '', curriculumGoal: '', curriculumSubSectionId: '' });
                                        }}
                                        style={{
                                            padding: '12px 24px',
                                            background: '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            fontWeight: '500',
                                            fontSize: '14px'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = '#5a6268'}
                                        onMouseOut={(e) => e.target.style.background = '#6c757d'}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleAddDetail}
                                        disabled={isSubmitting}
                                        style={{
                                            padding: '12px 24px',
                                            background: isSubmitting ? '#ccc' : 'linear-gradient(135deg, #00AB55 0%, #00A048 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.3s ease',
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(0, 171, 85, 0.2)'
                                        }}
                                        onMouseOver={(e) => {
                                            if (!isSubmitting) {
                                                e.target.style.transform = 'translateY(-1px)';
                                                e.target.style.boxShadow = '0 6px 16px rgba(0, 171, 85, 0.3)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!isSubmitting) {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 4px 12px rgba(0, 171, 85, 0.2)';
                                            }
                                        }}
                                    >
                                        <AddIcon sx={{ fontSize: '16px' }} />
                                        {isSubmitting ? 'Đang thêm...' : 'Thêm'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {showEditModal && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 2000,
                            backdropFilter: 'blur(4px)'
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                padding: '32px',
                                borderRadius: '16px',
                                width: '600px',
                                maxHeight: '80vh',
                                overflow: 'auto',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                border: '1px solid #e9ecef'
                            }}>
                                <h3 style={{
                                    margin: '0 0 24px 0',
                                    color: '#1a237e',
                                    fontSize: '22px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    fontWeight: '600'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <EditIcon sx={{ fontSize: '20px', color: '#1976d2' }} />
                                    </div>
                                    Chỉnh sửa nội dung cần đạt
                                </h3>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#1a237e',
                                        fontSize: '14px'
                                    }}>
                                        Nội dung: <span style={{ color: '#d32f2f' }}>*</span>
                                    </label>
                                    <textarea
                                        value={formData.curriculumContent}
                                        onChange={(e) => setFormData(prev => ({ ...prev, curriculumContent: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            height: '100px',
                                            padding: '12px',
                                            border: '2px solid #e9ecef',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            transition: 'border-color 0.3s ease',
                                            outline: 'none'
                                        }}
                                        placeholder="Nhập nội dung..."
                                        onFocus={(e) => e.target.style.borderColor = '#06A9AE'}
                                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#1a237e',
                                        fontSize: '14px'
                                    }}>
                                        Yêu cầu cần đạt: <span style={{ color: '#d32f2f' }}>*</span>
                                    </label>
                                    <textarea
                                        value={formData.curriculumGoal}
                                        onChange={(e) => setFormData(prev => ({ ...prev, curriculumGoal: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            height: '100px',
                                            padding: '12px',
                                            border: '2px solid #e9ecef',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            transition: 'border-color 0.3s ease',
                                            outline: 'none'
                                        }}
                                        placeholder="Nhập yêu cầu cần đạt..."
                                        onFocus={(e) => e.target.style.borderColor = '#06A9AE'}
                                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                    />
                                </div>

                                <div style={{ marginBottom: '28px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        color: '#1a237e',
                                        fontSize: '14px'
                                    }}>
                                        Mạch kiến thức:
                                    </label>
                                    <select
                                        value={formData.curriculumSubSectionId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, curriculumSubSectionId: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #e9ecef',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            transition: 'border-color 0.3s ease',
                                            outline: 'none',
                                            backgroundColor: 'white'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#06A9AE'}
                                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                    >
                                        <option value="">-- Chọn mạch kiến thức --</option>
                                        {curriculumSubSections.map((section) => (
                                            <option
                                                key={section.curriculumSubSectionId}
                                                value={section.curriculumSubSectionId}
                                            >
                                                {section.curriculumSubSectionName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setEditingDetail(null);
                                            setFormData({ curriculumContent: '', curriculumGoal: '', curriculumSubSectionId: '' });
                                        }}
                                        style={{
                                            padding: '12px 24px',
                                            background: '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            fontWeight: '500',
                                            fontSize: '14px'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = '#5a6268'}
                                        onMouseOut={(e) => e.target.style.background = '#6c757d'}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleEditDetail}
                                        disabled={isSubmitting}
                                        style={{
                                            padding: '12px 24px',
                                            background: isSubmitting ? '#ccc' : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.3s ease',
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(25, 118, 210, 0.2)'
                                        }}
                                        onMouseOver={(e) => {
                                            if (!isSubmitting) {
                                                e.target.style.transform = 'translateY(-1px)';
                                                e.target.style.boxShadow = '0 6px 16px rgba(25, 118, 210, 0.3)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!isSubmitting) {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.2)';
                                            }
                                        }}
                                    >
                                        <EditIcon sx={{ fontSize: '16px' }} />
                                        {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{
                        marginTop: '40px',
                        textAlign: 'center'
                    }}>
                        <button
                            onClick={handleBackClick}
                            style={{
                                padding: '14px 28px',
                                background: 'linear-gradient(135deg, #06A9AE 0%, #048a8d 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(6, 169, 174, 0.2)'
                            }}
                        >
                            Quay lại trang chương trình
                        </button>
                    </div>
                </div>
            </div>
        </Box>
    );
};

export default CurriculumDetail;
