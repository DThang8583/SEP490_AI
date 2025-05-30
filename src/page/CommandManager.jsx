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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const CommandManager = () => {
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
        setGrades(response.data.data);
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

  const handleLessonChange = (event) => {
    setSelectedLesson(event.target.value);
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
      if (section === 'basic') {
        setSelectedLesson(prev => ({
          ...prev,
          ...editedData
        }));
      } else {
        setSelectedLesson(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            ...editedData
          }
        }));
      }
      setEditingSection(null);
      setEditedData(null);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

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

    return (
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {!isEditing ? (
            <IconButton onClick={() => handleEdit(section)} size="small">
              <EditIcon />
            </IconButton>
          ) : (
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => handleSave(section)} size="small" color="primary">
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCancel} size="small" color="error">
                <CancelIcon />
              </IconButton>
            </Stack>
          )}
        </Stack>

        {isEditing ? (
          <Stack spacing={2}>
            {fields.map(field => (
              <TextField
                key={field}
                label={field}
                multiline
                rows={4}
                value={data[field] || ''}
                onChange={(e) => handleEditChange(field, e.target.value)}
                fullWidth
              />
            ))}
          </Stack>
        ) : (
          <Stack spacing={1}>
            {fields.map(field => (
              <Typography key={field} variant="body1" paragraph>
                <strong>{field}:</strong> {data[field] || 'Chưa có dữ liệu'}
              </Typography>
            ))}
          </Stack>
        )}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý câu lệnh
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Chọn Khối</InputLabel>
            <Select
              value={selectedGrade}
              onChange={handleGradeChange}
              label="Chọn Khối"
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
            <InputLabel>Chọn Module</InputLabel>
            <Select
              value={selectedModule}
              onChange={handleModuleChange}
              label="Chọn Module"
              disabled={!selectedGrade}
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
            <InputLabel>Chọn Bài học</InputLabel>
            <Select
              value={selectedLesson?.lessonId || ''}
              onChange={handleLessonChange}
              label="Chọn Bài học"
              disabled={!selectedModule}
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

      {selectedLesson && (
        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
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
            </CardContent>
          </Card>
        </Box>
      )}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default CommandManager;
