import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  IconButton,
  Stack,
  Pagination,
  Paper,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const CommandManager = () => {
  const { isDarkMode } = useTheme();
  const [grades, setGrades] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Fetch grades
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades'
        );
        console.log('Grades API Response:', response.data);
        setGrades(response.data.data);

        // Get grade from localStorage and set corresponding gradeId
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        console.log('User Info from localStorage:', userInfo);
        if (userInfo?.grade) {
          const gradeNumber = userInfo.grade.replace('Lớp ', '');
          const matchingGrade = response.data.data.find(g => g.gradeNumber === parseInt(gradeNumber));
          console.log('Matching Grade:', matchingGrade);
          if (matchingGrade) {
            setSelectedGrade(matchingGrade.gradeId);
          }
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
      }
    };
    fetchGrades();
  }, []);

  // Fetch modules when grade is selected
  useEffect(() => {
    const fetchModules = async () => {
      if (selectedGrade) {
        try {
          const response = await axios.get(
            `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades/${selectedGrade}/modules`
          );
          console.log('Modules API Response:', response.data);
          setModules(response.data.data.modules);
        } catch (error) {
          console.error('Error fetching modules:', error);
        }
      }
    };
    fetchModules();
  }, [selectedGrade]);

  // Fetch lessons when module is selected
  useEffect(() => {
    const fetchLessons = async () => {
      if (selectedModule) {
        try {
          const response = await axios.get(
            `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${selectedModule}/lessons`
          );
          console.log('Lessons API Response:', response.data);
          setLessons(response.data.data.lessons);
        } catch (error) {
          console.error('Error fetching lessons:', error);
        }
      }
    };
    fetchLessons();
  }, [selectedModule]);

  // Fetch lesson details when lesson is selected
  useEffect(() => {
    const fetchLessonDetails = async () => {
      if (selectedLesson) {
        try {
          const response = await axios.get(
            `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${selectedLesson}`
          );
          setSelectedLesson(response.data.data);
        } catch (error) {
          console.error('Error fetching lesson details:', error);
        }
      }
    };
    fetchLessonDetails();
  }, [selectedLesson]);

  const handleGradeChange = (event) => {
    setSelectedGrade(event.target.value);
    setSelectedModule('');
    setSelectedLesson(null);
    setEditingSection(null);
  };

  const handleModuleChange = (event) => {
    setSelectedModule(event.target.value);
    setSelectedLesson(null);
    setEditingSection(null);
  };

  const handleLessonChange = async (event) => {
    const lessonId = event.target.value;
    try {
      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lessonId}`
      );
      console.log('Selected Lesson API Response:', response.data);
      if (response.data && response.data.code === 0) {
        setSelectedLesson(response.data.data);
      } else {
        throw new Error(response.data.message || "Không thể lấy thông tin bài học");
      }
    } catch (error) {
      console.error('Error fetching lesson details:', error);
      alert(`Lỗi khi lấy thông tin bài học: ${error.message}`);
    }
    setEditingSection(null);
  };

  const handleEdit = (section) => {
    if (section === 'basic') {
      setEditedData({
        description: selectedLesson.description || '',
        lessonType: selectedLesson.lessonType || '',
        note: selectedLesson.note || '',
        week: selectedLesson.week || '',
        module: selectedLesson.module || '',
        gradeNumber: selectedLesson.gradeNumber || '',
        specialAbility: selectedLesson.specialAbility || '',
        generalCapacity: selectedLesson.generalCapacity || '',
        quality: selectedLesson.quality || ''
      });
    } else {
      setEditedData({
        goal: selectedLesson[section]?.goal || '',
        teacherActivities: selectedLesson[section]?.teacherActivities || '',
        studentActivities: selectedLesson[section]?.studentActivities || ''
      });
    }
    setEditingSection(section);
  };

  const handleSave = async (section) => {
    try {
      let updatedLesson;
      if (section === 'basic') {
        updatedLesson = {
          ...selectedLesson,
          ...editedData
        };
      } else {
        updatedLesson = {
          ...selectedLesson,
          [section]: {
            ...selectedLesson[section],
            ...editedData
          }
        };
      }

      console.log("Current selectedLesson:", selectedLesson);
      console.log("Edited Data:", editedData);
      console.log("Updated Lesson:", updatedLesson);

      // Save to localStorage
      localStorage.setItem('selectedLesson', JSON.stringify(updatedLesson));
      
      setSelectedLesson(updatedLesson);
      setEditingSection(null);
      setEditedData(null);
      alert('Lưu thay đổi thành công!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert(`Lỗi khi lưu thay đổi: ${error.message}`);
    }
  };

  // Add useEffect to load saved lesson on mount
  useEffect(() => {
    const savedLesson = localStorage.getItem('selectedLesson');
    if (savedLesson) {
      try {
        const parsedLesson = JSON.parse(savedLesson);
        setSelectedLesson(parsedLesson);
      } catch (error) {
        console.error('Error loading saved lesson:', error);
      }
    }
  }, []);

  // Add useEffect to save lesson when it changes
  useEffect(() => {
    if (selectedLesson) {
      localStorage.setItem('selectedLesson', JSON.stringify(selectedLesson));
    }
  }, [selectedLesson]);

  const handleCancel = () => {
    setEditingSection(null);
    setEditedData(null);
  };

  const handleEditChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderEditableSection = (title, section, fields) => {
    const isEditing = editingSection === section;
    let data = {};

    if (isEditing) {
      data = editedData;
    } else if (section === 'basic') {
      data = {
        description: selectedLesson?.description || '',
        lessonType: selectedLesson?.lessonType || '',
        note: selectedLesson?.note || '',
        week: selectedLesson?.week || '',
        module: selectedLesson?.module || '',
        gradeNumber: selectedLesson?.gradeNumber || '',
        specialAbility: selectedLesson?.specialAbility || '',
        generalCapacity: selectedLesson?.generalCapacity || '',
        quality: selectedLesson?.quality || ''
      };
    } else {
      data = {
        goal: selectedLesson?.[section]?.goal || '',
        teacherActivities: selectedLesson?.[section]?.teacherActivities || '',
        studentActivities: selectedLesson?.[section]?.studentActivities || ''
      };
    }

    const fieldLabels = {
      description: 'Mô tả',
      lessonType: 'Loại bài học',
      note: 'Ghi chú',
      week: 'Tuần',
      module: 'Chủ đề',
      gradeNumber: 'Khối',
      specialAbility: 'Năng lực đặc thù',
      generalCapacity: 'Năng lực chung',
      quality: 'Phẩm chất',
      goal: 'Mục tiêu',
      teacherActivities: 'Hoạt động của giáo viên',
      studentActivities: 'Hoạt động của học sinh'
    };

    return (
      <Paper 
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: '16px',
          background: isDarkMode 
            ? 'rgba(30, 30, 30, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: isDarkMode ? '#ffffff' : '#2D3436',
              fontWeight: 600 
            }}
          >
            {title}
          </Typography>
          {!isEditing ? (
            <IconButton 
              onClick={() => handleEdit(section)} 
              size="small"
              sx={{
                color: isDarkMode ? '#ffffff' : '#2D3436',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <EditIcon />
            </IconButton>
          ) : (
            <Stack direction="row" spacing={1}>
              <IconButton 
                onClick={() => handleSave(section)} 
                size="small" 
                color="primary"
                sx={{
                  backgroundColor: '#4CAF50',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#388E3C',
                  },
                }}
              >
                <SaveIcon />
              </IconButton>
              <IconButton 
                onClick={handleCancel} 
                size="small" 
                color="error"
                sx={{
                  backgroundColor: '#F44336',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#D32F2F',
                  },
                }}
              >
                <CancelIcon />
              </IconButton>
            </Stack>
          )}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {isEditing ? (
          <Stack spacing={2}>
            {fields.map(field => (
              <TextField
                key={field}
                label={fieldLabels[field]}
                multiline
                rows={4}
                value={data[field] || ''}
                onChange={(e) => handleEditChange(field, e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                  },
                }}
              />
            ))}
          </Stack>
        ) : (
          <Stack spacing={2}>
            {fields.map(field => (
              <Box key={field}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    color: isDarkMode ? '#ffffff' : '#2D3436',
                    mb: 1
                  }}
                >
                  {fieldLabels[field]}:
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {data[field] || 'Chưa có dữ liệu'}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDarkMode
          ? 'linear-gradient(135deg, rgb(18, 18, 18) 0%, rgb(30, 30, 30) 100%)'
          : 'linear-gradient(135deg, rgb(248, 249, 250) 0%, rgb(255, 255, 255) 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 700,
            color: isDarkMode ? '#ffffff' : '#2D3436',
            mb: 4,
          }}
        >
          Quản lý giáo án
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            background: isDarkMode 
              ? 'rgba(30, 30, 30, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            mb: 4,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }}>
                  Khối
                </InputLabel>
                <Select
                  value={selectedGrade}
                  label="Khối"
                  disabled={true}
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    '& .MuiSelect-select': {
                      color: isDarkMode ? '#ffffff' : '#2D3436',
                    },
                  }}
                >
                  {grades.map((grade) => (
                    <MenuItem key={grade.gradeId} value={grade.gradeId}>
                      Khối {grade.gradeNumber}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }}>
                  Chọn Chủ đề
                </InputLabel>
                <Select
                  value={selectedModule}
                  onChange={handleModuleChange}
                  label="Chọn Chủ đề"
                  disabled={!selectedGrade}
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    '& .MuiSelect-select': {
                      color: isDarkMode ? '#ffffff' : '#2D3436',
                    },
                  }}
                >
                  {modules.map((module) => (
                    <MenuItem key={module.moduleId} value={module.moduleId}>
                      {module.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: isDarkMode ? 'rgb(176, 176, 176)' : 'rgb(102, 102, 102)' }}>
                  Chọn Bài học
                </InputLabel>
                <Select
                  value={selectedLesson?.lessonId || ''}
                  onChange={handleLessonChange}
                  label="Chọn Bài học"
                  disabled={!selectedModule}
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    '& .MuiSelect-select': {
                      color: isDarkMode ? '#ffffff' : '#2D3436',
                    },
                  }}
                >
                  {lessons.map((lesson) => (
                    <MenuItem key={lesson.lessonId} value={lesson.lessonId}>
                      {lesson.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {selectedLesson && (
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                background: isDarkMode 
                  ? 'rgba(30, 30, 30, 0.8)'
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                mb: 4,
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? '#ffffff' : '#2D3436',
                  mb: 3,
                }}
              >
                {selectedLesson.name}
              </Typography>

              {renderEditableSection('Thông tin cơ bản', 'basic', [
                'description',
                'lessonType',
                'note',
                'week',
                'module',
                'gradeNumber',
                'specialAbility',
                'generalCapacity',
                'quality'
              ])}

              {renderEditableSection('Khởi động', 'startUp', [
                'goal',
                'teacherActivities',
                'studentActivities'
              ])}

              {renderEditableSection('Kiến thức mới', 'knowLedge', [
                'goal',
                'teacherActivities',
                'studentActivities'
              ])}

              {renderEditableSection('Luyện tập', 'practice', [
                'goal',
                'teacherActivities',
                'studentActivities'
              ])}

              {renderEditableSection('Vận dụng', 'apply', [
                'goal',
                'teacherActivities',
                'studentActivities'
              ])}
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CommandManager;
