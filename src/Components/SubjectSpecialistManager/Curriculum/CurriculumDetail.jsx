import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography, Button, Modal, TextField, MenuItem, useTheme } from '@mui/material';
import axios from 'axios';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const CurriculumDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
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
                    background: theme.palette.background.default,
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
                    background: theme.palette.background.default,
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
                    color: theme.palette.error.main
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
                    background: theme.palette.background.default,
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
                background: theme.palette.background.default,
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
                        marginBottom: '40px',
                        position: 'relative'
                    }}>
                        <button
                            onClick={handleBackClick}
                            style={{
                                padding: '12px 24px',
                                background: '#06A9AE',
                                color: '#ffffff',
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
                        <h1 style={{
                            fontSize: '32px',
                            color: theme.palette.text.primary,
                            margin: 0,
                            fontWeight: '700',
                            letterSpacing: '-0.5px',
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }}>Chi tiết nội dung cần đạt</h1>
                        <div style={{ width: '120px' }}></div> {/* Spacer to balance the layout */}
                    </div>

                    <div style={{
                        backgroundColor: theme.palette.background.paper,
                        padding: '32px',
                        borderRadius: '16px',
                        marginBottom: '32px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        transition: 'transform 0.3s ease'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            color: theme.palette.text.primary,
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
                                            color: theme.palette.text.primary,
                                            backgroundColor: theme.palette.background.secondary,
                                            borderRadius: '12px 0 0 12px',
                                            fontSize: '15px'
                                        }}>{item.label}</td>
                                        <td style={{
                                            padding: '16px 20px',
                                            backgroundColor: theme.palette.background.secondary,
                                            borderRadius: '0 12px 12px 0',
                                            fontSize: '15px',
                                            color: theme.palette.text.secondary,
                                        }}>{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{
                        backgroundColor: theme.palette.background.paper,
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
                                color: theme.palette.text.primary,
                                margin: 0,
                                fontWeight: '600'
                            }}>Nội dung cần đạt</h2>
                            <button
                                onClick={() => setShowAddModal(true)}
                                style={{
                                    padding: '8px 20px',
                                    background: '#06A9AE',
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
                                    boxShadow: '0 4px 12px rgba(6, 169, 174, 0.2)',
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
                                                background: '#06A9AE',
                                                color: '#ffffff',
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
                                            backgroundColor: index % 2 === 0 ? theme.palette.background.paper : theme.palette.background.secondary,
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                                fontSize: '15px'
                                            }}>{detail.curriculumTopic}</td>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                                fontSize: '15px'
                                            }}>{detail.curriculumSection}</td>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                                fontSize: '15px'
                                            }}>{detail.curriculumContent}</td>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                                fontSize: '15px'
                                            }}>{detail.curriculumGoal}</td>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                                fontSize: '15px'
                                            }}>{detail.curriculumSubSection}</td>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: `1px solid ${theme.palette.divider}`,
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
                                                            color: '#06A9AE',
                                                            bgcolor: 'rgba(6, 169, 174, 0.1)',
                                                            borderRadius: '8px',
                                                            marginRight: '4px',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(6, 169, 174, 0.2)',
                                                            }
                                                        }}
                                                    >
                                                        <EditIcon sx={{ fontSize: '20px' }} />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDeleteDetail(detail.curriculumDetailId)}
                                                        sx={{
                                                            color: '#06A9AE',
                                                            bgcolor: 'rgba(6, 169, 174, 0.1)',
                                                            borderRadius: '8px',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(6, 169, 174, 0.2)',
                                                            }
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
                        backgroundColor: theme.palette.background.paper,
                        padding: '32px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            color: theme.palette.text.primary,
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
                                            background: '#06A9AE',
                                            color: '#ffffff',
                                            textAlign: 'center',
                                            fontWeight: '600',
                                            width: '80px',
                                            fontSize: '15px',
                                            borderRadius: '12px 0 0 0'
                                        }}>STT</th>
                                        <th style={{
                                            padding: '16px 20px',
                                            background: '#06A9AE',
                                            color: '#ffffff',
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
                                            backgroundColor: index % 2 === 0 ? theme.palette.background.paper : theme.palette.background.secondary,
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                                textAlign: 'center',
                                                fontWeight: '600',
                                                color: '#06A9AE',
                                                fontSize: '15px'
                                            }}>{index + 1}</td>
                                            <td style={{
                                                padding: '16px 20px',
                                                borderBottom: `1px solid ${theme.palette.divider}`,
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
                    <Modal
                        open={showAddModal}
                        onClose={() => setShowAddModal(false)}
                        aria-labelledby="add-detail-modal-title"
                        aria-describedby="add-detail-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: theme.palette.background.paper,
                            border: '2px solid #06A9AE',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: '16px'
                        }}>
                            <Typography id="add-detail-modal-title" variant="h6" component="h2" sx={{ 
                                color: '#06A9AE',
                                fontWeight: '600',
                                mb: 3
                            }}>
                                Thêm Nội dung cần đạt mới
                            </Typography>
                            <TextField
                                fullWidth
                                label="Mạch kiến thức"
                                select
                                value={formData.curriculumSubSectionId}
                                onChange={(e) => setFormData({ ...formData, curriculumSubSectionId: e.target.value })}
                                margin="normal"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#06A9AE',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#05969A',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#06A9AE',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#06A9AE',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#06A9AE',
                                    }
                                }}
                            >
                                {curriculumSubSections.map((section) => (
                                    <MenuItem key={section.curriculumSubSectionId} value={section.curriculumSubSectionId}>
                                        {section.curriculumSubSectionName}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth
                                label="Nội dung cần đạt"
                                multiline
                                rows={4}
                                value={formData.curriculumContent}
                                onChange={(e) => setFormData({ ...formData, curriculumContent: e.target.value })}
                                margin="normal"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#06A9AE',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#05969A',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#06A9AE',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#06A9AE',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#06A9AE',
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Mục tiêu cần đạt"
                                multiline
                                rows={4}
                                value={formData.curriculumGoal}
                                onChange={(e) => setFormData({ ...formData, curriculumGoal: e.target.value })}
                                margin="normal"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#06A9AE',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#05969A',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#06A9AE',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#06A9AE',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#06A9AE',
                                    }
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button 
                                    onClick={() => setShowAddModal(false)} 
                                    sx={{ 
                                        mr: 1,
                                        color: '#06A9AE',
                                        '&:hover': {
                                            backgroundColor: 'rgba(6, 169, 174, 0.1)',
                                        }
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button 
                                    variant="contained" 
                                    onClick={handleAddDetail} 
                                    disabled={isSubmitting}
                                    sx={{
                                        backgroundColor: '#06A9AE',
                                        '&:hover': {
                                            backgroundColor: '#05969A',
                                        }
                                    }}
                                >
                                    Lưu
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                    {/* Edit Modal */}
                    <Modal
                        open={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        aria-labelledby="edit-detail-modal-title"
                        aria-describedby="edit-detail-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: theme.palette.background.paper,
                            border: '2px solid #06A9AE',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: '16px'
                        }}>
                            <Typography id="edit-detail-modal-title" variant="h6" component="h2" sx={{ 
                                color: '#06A9AE',
                                fontWeight: '600',
                                mb: 3
                            }}>
                                Chỉnh sửa Nội dung cần đạt
                            </Typography>
                            <TextField
                                fullWidth
                                label="Mạch kiến thức"
                                select
                                value={formData.curriculumSubSectionId}
                                onChange={(e) => setFormData({ ...formData, curriculumSubSectionId: e.target.value })}
                                margin="normal"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#06A9AE',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#05969A',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#06A9AE',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#06A9AE',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#06A9AE',
                                    }
                                }}
                            >
                                {curriculumSubSections.map((section) => (
                                    <MenuItem key={section.curriculumSubSectionId} value={section.curriculumSubSectionId}>
                                        {section.curriculumSubSectionName}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth
                                label="Nội dung cần đạt"
                                multiline
                                rows={4}
                                value={formData.curriculumContent}
                                onChange={(e) => setFormData({ ...formData, curriculumContent: e.target.value })}
                                margin="normal"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#06A9AE',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#05969A',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#06A9AE',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#06A9AE',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#06A9AE',
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Mục tiêu cần đạt"
                                multiline
                                rows={4}
                                value={formData.curriculumGoal}
                                onChange={(e) => setFormData({ ...formData, curriculumGoal: e.target.value })}
                                margin="normal"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#06A9AE',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#05969A',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#06A9AE',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#06A9AE',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#06A9AE',
                                    }
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button 
                                    onClick={() => setShowEditModal(false)} 
                                    sx={{ 
                                        mr: 1,
                                        color: '#06A9AE',
                                        '&:hover': {
                                            backgroundColor: 'rgba(6, 169, 174, 0.1)',
                                        }
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button 
                                    variant="contained" 
                                    onClick={handleEditDetail} 
                                    disabled={isSubmitting}
                                    sx={{
                                        backgroundColor: '#06A9AE',
                                        '&:hover': {
                                            backgroundColor: '#05969A',
                                        }
                                    }}
                                >
                                    Lưu
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </div>
            </div>
        </Box>
    );
};

export default CurriculumDetail;
