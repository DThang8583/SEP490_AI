import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

const CurriculumDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [curriculum, setCurriculum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurriculum = async () => {
            try {
                const response = await fetch(`https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/${id}`);
                const result = await response.json();

                if (result.code === 0 && result.data) {
                    setCurriculum(result.data);
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
        } else {
            setError('No curriculum ID provided');
            setLoading(false);
        }
    }, [id]);

    const handleBackClick = () => {
        navigate('/manager/curriculum-framework');
    };

    if (loading) {
        return (
            <Box
                sx={{
                    width: 'calc(100% - 78px)',  // Account for sidebar width (78px)
                    height: '100vh',
                    background: '#f8f9fa',
                    position: 'fixed',
                    top: 0,
                    left: '78px',  // Leave space for sidebar (78px)
                    right: 0,
                    bottom: 0,
                    overflow: 'auto',
                    zIndex: 1100,
                    paddingTop: 0,  // Remove top padding to avoid navbar
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
                    width: 'calc(100% - 78px)',  // Account for sidebar width (78px)
                    height: '100vh',
                    background: '#f8f9fa',
                    position: 'fixed',
                    top: 0,
                    left: '78px',  // Leave space for sidebar (78px)
                    right: 0,
                    bottom: 0,
                    overflow: 'auto',
                    zIndex: 1100,
                    paddingTop: 0,  // Remove top padding to avoid navbar
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
                    width: 'calc(100% - 78px)',  // Account for sidebar width (78px)
                    height: '100vh',
                    background: '#f8f9fa',
                    position: 'fixed',
                    top: 0,
                    left: '78px',  // Leave space for sidebar (78px)
                    right: 0,
                    bottom: 0,
                    overflow: 'auto',
                    zIndex: 1100,
                    paddingTop: 0,  // Remove top padding to avoid navbar
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
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 16px rgba(6, 169, 174, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(6, 169, 174, 0.2)';
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
                        <h2 style={{
                            fontSize: '24px',
                            color: '#1a237e',
                            marginBottom: '24px',
                            paddingBottom: '16px',
                            borderBottom: '3px solid #06A9AE',
                            fontWeight: '600'
                        }}>Nội dung cần đạt</h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'separate',
                                borderSpacing: '0'
                            }}>
                                <thead>
                                    <tr>
                                        {['Chủ đề', 'Mạch nội dung', 'Nội dung', 'Yêu cầu cần đạt'].map((header, index) => (
                                            <th key={index} style={{
                                                padding: '16px 20px',
                                                background: 'linear-gradient(135deg, #06A9AE 0%, #048a8d 100%)',
                                                color: 'white',
                                                textAlign: 'left',
                                                fontWeight: '600',
                                                fontSize: '15px',
                                                borderRadius: index === 0 ? '12px 0 0 0' :
                                                    index === 3 ? '0 12px 0 0' : '0'
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
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 16px rgba(6, 169, 174, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(6, 169, 174, 0.2)';
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
