import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  CircularProgress,
  Alert,
  TextField
} from '@mui/material';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyDSf6v2-ynUdw6IS7Ac_2cSOJN7-g12c7k";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CreateExerciseModal = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const [gradeId, setGradeId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [grades, setGrades] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [loadingModules, setLoadingModules] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [error, setError] = useState('');
  
  // State for AI generation
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [difficulty, setDifficulty] = useState(''); // New state for difficulty
  const [exerciseName, setExerciseName] = useState(''); // New state for exercise name

  // Fetch Grades on modal open
  useEffect(() => {
    if (open) {
      const fetchGrades = async () => {
        setLoadingGrades(true);
        setError('');
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            throw new Error("Authentication token not found.");
          }
          const response = await axios.get(
            `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          if (response.data.code === 0) {
            setGrades(response.data.data || []);
          } else {
            setError(response.data.message || 'Failed to fetch grades.');
            setGrades([]);
          }
        } catch (err) {
          console.error("Error fetching grades:", err);
          setError(err.message || 'An error occurred while fetching grades.');
          setGrades([]);
        } finally {
          setLoadingGrades(false);
        }
      };
      fetchGrades();
    }
  }, [open]);

  // Fetch Modules when grade changes
  useEffect(() => {
    if (gradeId) {
      const fetchModules = async () => {
        setLoadingModules(true);
        setError('');
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            throw new Error("Authentication token not found.");
          }
          const response = await axios.get(
            `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/grades/${gradeId}/modules`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          if (response.data.code === 0) {
            setModules(response.data.data.modules || []);
            setLessonId(''); // Reset lesson when module changes
            setLessons([]); // Clear lessons when module changes
            setExerciseName(''); // Reset exercise name when grade changes
          } else {
            setError(response.data.message || `Failed to fetch modules for grade ${gradeId}.`);
            setModules([]);
            setLessonId('');
            setLessons([]);
            setExerciseName('');
          }
        } catch (err) {
          console.error(`Error fetching modules for grade ${gradeId}:`, err);
          setError(err.message || 'An error occurred while fetching modules.');
          setModules([]);
          setLessonId('');
          setLessons([]);
          setExerciseName('');
        } finally {
          setLoadingModules(false);
        }
      };
      fetchModules();
    } else {
      setModules([]);
      setLessonId('');
      setLessons([]);
      setExerciseName('');
    }
  }, [gradeId]);

  // Fetch Lessons when module changes
  useEffect(() => {
    if (moduleId) {
      const fetchLessons = async () => {
        setLoadingLessons(true);
        setError('');
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            throw new Error("Authentication token not found.");
          }
          const response = await axios.get(
            `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${moduleId}/lessons`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          if (response.data.code === 0) {
            setLessons(response.data.data.lessons || []);
            setLessonId(''); // Reset lesson when module changes
            setExerciseName(''); // Reset exercise name when module changes
          } else {
            setError(response.data.message || `Failed to fetch lessons for module ${moduleId}.`);
            setLessons([]);
            setLessonId('');
            setExerciseName('');
          }
        } catch (err) {
          console.error(`Error fetching lessons for module ${moduleId}:`, err);
          setError(err.message || 'An error occurred while fetching lessons.');
          setLessons([]);
          setLessonId('');
          setExerciseName('');
        } finally {
          setLoadingLessons(false);
        }
      };
      fetchLessons();
    } else {
      setLessons([]);
      setLessonId('');
      setExerciseName('');
    }
  }, [moduleId]);

  const handleGradeChange = (event) => {
    setGradeId(event.target.value);
    setModuleId(''); // Reset module and lesson when grade changes
    setLessonId('');
    setExerciseName(''); // Reset exercise name when grade changes
  };

  const handleModuleChange = (event) => {
    setModuleId(event.target.value);
    setLessonId(''); // Reset lesson when module changes
    setExerciseName(''); // Reset exercise name when module changes
  };

  const handleLessonChange = (event) => {
    setLessonId(event.target.value);
    setExerciseName(''); // Reset exercise name when lesson changes
  };

  const handleCreateExercise = async () => {
    if (!gradeId || !moduleId || !lessonId || !difficulty) {
      setError('Please select a Grade, Module, Lesson, and Difficulty.');
      return;
    }

    console.log('Creating exercise with lessonId:', lessonId);

    setGenerating(true);
    setError('');
    setGenerationError('');

    const selectedModule = modules.find(m => m.moduleId === moduleId);
    const selectedLesson = lessons.find(l => l.lessonId === lessonId);

    if (!selectedModule || !selectedLesson) {
      setError('Could not find selected module or lesson details.');
      setGenerating(false);
      return;
    }

    const moduleName = selectedModule.name;
    const lessonName = selectedLesson.name;

    const prompt = `Hãy tạo 5 câu hỏi trắc nghiệm môn Toán lớp ${gradeId} thuộc ${moduleName}, bài ${lessonName}, dựa theo kỹ thuật KWL. Không phân loại các câu hỏi theo K, W, L mà chỉ hiển thị danh sách câu hỏi trắc nghiệm liền mạch.

Mức độ câu hỏi: ${difficulty}.

Không sử dụng cụm "chữ số", chỉ dùng "số". Hạn chế các câu hỏi lý thuyết, ưu tiên các bài toán thực tế, gần gũi với học sinh tiểu học.

Mỗi câu hỏi có từ 3 đến 4 phương án lựa chọn, trong đó chỉ có một đáp án đúng.

Sau mỗi câu hỏi, hãy ghi rõ đáp án đúng theo định dạng "Đáp án đúng: [chữ cái của đáp án]".`;

    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      
      handleClose(); // Close modal first
      navigate('/generated-quiz', { state: { content: text, exerciseName: exerciseName, lessonId: lessonId } }); // Navigate to quiz page with content, exercise name, and lesson ID
    } catch (err) {
      console.error("Error generating quiz:", err);
      setGenerationError('Failed to generate quiz. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-exercise-modal-title"
      aria-describedby="create-exercise-modal-description"
    >
      <Box sx={style}>
        <Typography id="create-exercise-modal-title" variant="h6" component="h2" mb={2}>
          Tạo bài tập bằng AI
        </Typography>
        
        {/* Optional: Display selected lesson name if needed */}
        {/*
          {lessonId && lessons.length > 0 && (
            <Typography variant="subtitle1" component="p" sx={{ mb: 2, color: 'text.secondary' }}>
              Bài học đã chọn: {lessons.find(lesson => lesson.lessonId === lessonId)?.name}
            </Typography>
          )}
        */}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {generationError && <Alert severity="error" sx={{ mb: 2 }}>{generationError}</Alert>}

        <Stack spacing={3}>
          <FormControl fullWidth size="small" disabled={!lessonId || generating}>
            <TextField
              label="Tên bài tập"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              fullWidth
              size="small"
              margin="normal"
              disabled={!lessonId || generating}
            />
          </FormControl>

          <FormControl fullWidth size="small" disabled={loadingGrades || generating}>
            <Select
              value={gradeId}
              onChange={handleGradeChange}
              displayEmpty
            >
              <MenuItem value=""><em>Chọn Lớp</em></MenuItem>
              {grades.map((grade) => (
                <MenuItem key={grade.gradeId} value={grade.gradeId}>{`Lớp ${grade.gradeNumber}`}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" disabled={!gradeId || loadingModules || generating}>
            <Select
              value={moduleId}
              onChange={handleModuleChange}
              displayEmpty
            >
               <MenuItem value=""><em>Chọn Chủ đề</em></MenuItem>
              {modules.map((module) => (
                <MenuItem key={module.moduleId} value={module.moduleId}>{module.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" disabled={!moduleId || loadingLessons || generating}>
            <Select
              value={lessonId}
              onChange={handleLessonChange}
              displayEmpty
            >
               <MenuItem value=""><em>Chọn Bài học</em></MenuItem>
              {lessons.map((lesson) => (
                <MenuItem key={lesson.lessonId} value={lesson.lessonId}>{lesson.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" disabled={!lessonId || generating}>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              displayEmpty
            >
               <MenuItem value=""><em>Chọn độ khó</em></MenuItem>
               <MenuItem value="dễ">Dễ</MenuItem>
               <MenuItem value="trung bình">Trung bình</MenuItem>
               <MenuItem value="khó">Khó</MenuItem>
               <MenuItem value="kết hợp tăng dần độ khó">Kết hợp tăng dần độ khó</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateExercise}
            disabled={!lessonId || !difficulty || generating}
            startIcon={generating ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {generating ? 'Đang tạo...' : 'Tạo bài tập'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CreateExerciseModal; 