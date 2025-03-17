// src/Components/SubjectSpecialistManager/CurriculumFramework.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { Box, Typography, TextField, Button, List, ListItem, IconButton, Tabs, Tab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const CurriculumFramework = ({ sidebarOpen }) => {
    const [curricula, setCurricula] = useState([]); // Danh sách curricula cho từng khối lớp
    const [selectedGrade, setSelectedGrade] = useState(null); // Khối lớp được chọn
    const [editMode, setEditMode] = useState(null);
    const [editedTopic, setEditedTopic] = useState({ name: '', description: '' });

    const sidebarWidth = sidebarOpen ? 240 : 0; // Chiều rộng của Sidebar khi mở/đóng

    // Danh sách các khối lớp (Grade 1 đến Grade 5)
    const grades = [
        { id: 1, label: 'Grade 1' },
        { id: 2, label: 'Grade 2' },
        { id: 3, label: 'Grade 3' },
        { id: 4, label: 'Grade 4' },
        { id: 5, label: 'Grade 5' },
    ];

    // Lấy danh sách curricula cho từng khối lớp khi component được mount
    useEffect(() => {
        const fetchCurricula = async () => {
            try {
                const fetchedCurricula = await Promise.all(
                    grades.map(async (grade) => {
                        // Giả sử API hỗ trợ lấy curriculum theo grade
                        const res = await api.getCurriculum({ grade: grade.id });
                        return { gradeId: grade.id, data: res.data };
                    })
                );
                setCurricula(fetchedCurricula);
                // Mặc định chọn khối lớp 1
                setSelectedGrade(grades[0].id);
            } catch (error) {
                console.error('Error fetching curricula:', error);
            }
        };
        fetchCurricula();
    }, []);

    const handleGradeChange = (event, newValue) => {
        setSelectedGrade(newValue);
        setEditMode(null); // Reset edit mode khi chuyển khối lớp
        setEditedTopic({ name: '', description: '' });
    };

    const handleEditClick = (topic) => {
        setEditMode(topic.id);
        setEditedTopic({ name: topic.name, description: topic.description });
    };

    const handleInputChange = (e) => {
        setEditedTopic({ ...editedTopic, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async () => {
        const selectedCurriculum = curricula.find((c) => c.gradeId === selectedGrade);
        const updatedTopics = selectedCurriculum.data.topics.map((topic) =>
            topic.id === editMode ? { ...topic, ...editedTopic } : topic
        );
        try {
            const updatedCurriculum = { ...selectedCurriculum.data, topics: updatedTopics };
            const res = await api.updateCurriculum({ grade: selectedGrade, curriculum: updatedCurriculum });
            setCurricula(
                curricula.map((c) =>
                    c.gradeId === selectedGrade ? { ...c, data: res.data } : c
                )
            );
            setEditMode(null);
            alert('Curriculum updated successfully!');
        } catch (error) {
            console.error('Error updating curriculum:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(null);
        setEditedTopic({ name: '', description: '' });
    };

    // Lấy curriculum hiện tại dựa trên khối lớp được chọn
    const selectedCurriculum = curricula.find((c) => c.gradeId === selectedGrade);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                py: 4,
                ml: `${sidebarWidth}px`,
                transition: 'all 0.3s ease',
                px: { xs: 2, md: 4 },
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 1,
                    background: 'linear-gradient(45deg, #2196F3 30%, #00BCD4 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.5px',
                }}
            >
                Curriculum Framework
            </Typography>
            <Typography
                variant="subtitle1"
                sx={{
                    mb: 4,
                    color: 'text.secondary',
                    mx: 2,
                }}
            >
                Manage curriculum imported from Ministry of Education
            </Typography>

            <Tabs
                value={selectedGrade}
                onChange={handleGradeChange}
                sx={{
                    mb: 4,
                    '& .MuiTab-root': {
                        minWidth: 120,
                        fontWeight: 600,
                        fontSize: '1rem',
                        transition: 'all 0.2s',
                        '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.08)',
                        },
                    },
                    '& .Mui-selected': {
                        color: '#2196F3',
                    },
                    '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: '3px 3px 0 0',
                    },
                }}
                variant="scrollable"
                scrollButtons="auto"
            >
                {grades.map((grade) => (
                    <Tab key={grade.id} label={grade.label} value={grade.id} />
                ))}
            </Tabs>

            {selectedCurriculum ? (
                <>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            fontWeight: 600,
                            color: '#1976d2',
                            display: 'flex',
                            alignItems: 'center',
                            '&::before': {
                                content: '""',
                                width: 4,
                                height: 24,
                                backgroundColor: '#1976d2',
                                marginRight: 2,
                                borderRadius: 1,
                            },
                        }}
                    >
                        {selectedCurriculum.data.title} - Grade {selectedGrade}
                    </Typography>
                    <List
                        sx={{
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            overflow: 'hidden',
                        }}
                    >
                        {selectedCurriculum.data.topics.map((topic) => (
                            <ListItem
                                key={topic.id}
                                sx={{
                                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        backgroundColor: 'rgba(33, 150, 243, 0.02)',
                                    },
                                    p: 3,
                                }}
                            >
                                {editMode === topic.id ? (
                                    <Box sx={{ width: '100%' }}>
                                        <TextField
                                            label="Topic Name"
                                            name="name"
                                            value={editedTopic.name}
                                            onChange={handleInputChange}
                                            fullWidth
                                            sx={{
                                                mb: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': {
                                                        borderColor: '#2196F3',
                                                    },
                                                },
                                            }}
                                        />
                                        <TextField
                                            label="Description"
                                            name="description"
                                            value={editedTopic.description}
                                            onChange={handleInputChange}
                                            fullWidth
                                            multiline
                                            rows={3}
                                            sx={{
                                                mb: 3,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': {
                                                        borderColor: '#2196F3',
                                                    },
                                                },
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button
                                                onClick={handleSaveEdit}
                                                variant="contained"
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    px: 4,
                                                    py: 1.2,
                                                    fontWeight: 600,
                                                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
                                                    '&:hover': {
                                                        boxShadow: '0 6px 16px rgba(33, 150, 243, 0.3)',
                                                    },
                                                }}
                                            >
                                                Save Changes
                                            </Button>
                                            <Button
                                                onClick={handleCancelEdit}
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    px: 4,
                                                    py: 1.2,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    mb: 1,
                                                    color: '#2c3e50',
                                                    fontSize: '1.1rem',
                                                }}
                                            >
                                                {topic.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {topic.description}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            onClick={() => handleEditClick(topic)}
                                            sx={{
                                                backgroundColor: 'rgba(33, 150, 243, 0.08)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(33, 150, 243, 0.15)',
                                                },
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Box>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '300px',
                        backgroundColor: 'white',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    }}
                >
                    <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                        Loading curriculum...
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default CurriculumFramework;