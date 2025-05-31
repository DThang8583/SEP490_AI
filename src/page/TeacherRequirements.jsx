import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, CircularProgress, Alert, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TeacherRequirements = () => {
  const { userInfo } = useAuth();
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurriculumDetail = async () => {
      try {
        setLoading(true);
        if (!userInfo?.gradeId) {
          setError('Grade ID not found in user info');
          setLoading(false);
          return;
        }
        // Step 1: Get curriculum by gradeNumber directly if API supports
        // Assuming API /api/v1/curriculums supports filtering by gradeNumber
        // If not, the previous logic iterating through the list is necessary.
        // Based on previous tasks, it seems filtering by gradeNumber is possible

        // Updated logic to find curriculum matching user's gradeId by gradeNumber
        const response = await axios.get(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums',
          {
            params: {
              PageNumber: 1,
              PageSize: 10, // Reduced page size, assuming there aren't too many curriculums per grade
              GradeNumber: parseInt(userInfo.gradeId, 10) // Filter directly by gradeNumber
            }
          }
        );
        
        if (response.data.code !== 0 || !response.data.data || !response.data.data.items || response.data.data.items.length === 0) {
          setError('Không tìm thấy chương trình giảng dạy cho khối lớp ' + userInfo.gradeId);
          setLoading(false);
          return;
        }

        // Assuming there is only one curriculum per grade in the filtered result
        const found = response.data.data.items[0];
        console.log('Found curriculumId:', found.curriculumId);
        
        // Step 2: Get curriculum detail by id
        const detailRes = await axios.get(
          `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums/${found.curriculumId}`
        );
        if (detailRes.data.code !== 0) {
          setError('Không lấy được chi tiết chương trình');
          setLoading(false);
          return;
        }
        setCurriculum(detailRes.data.data);
        console.log('Fetched curriculum detail:', detailRes.data.data);
      } catch (err) {
        setError('Error fetching curriculum data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCurriculumDetail();
  }, [userInfo?.gradeId]); // Dependency array remains the same

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
    );
  }
  if (!curriculum) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default, py: 4 }}>
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            mb: 2,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Quay lại
        </Button>

        <Paper elevation={0} sx={{ p: 4, mb: 4, textAlign: 'center', bgcolor: theme.palette.background.paper, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, boxShadow: theme.shadows[3] }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main, fontFamily: 'Times New Roman, serif', textShadow: theme.palette.mode === 'dark' ? 'none' : '1px 1px 2px rgba(0,0,0,0.1)' }}>
            {curriculum.name}
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: 'Times New Roman, serif', color: theme.palette.text.secondary, mb: 3, fontWeight: 500 }}>
            {curriculum.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, bgcolor: theme.palette.action.hover, px: 2, py: 1, borderRadius: 1 }}>
              Tổng số tiết: {curriculum.totalPeriods}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, bgcolor: theme.palette.action.hover, px: 2, py: 1, borderRadius: 1 }}>
              Năm học: {curriculum.year}
            </Typography>
          </Box>
        </Paper>
        {/* Curriculum Details Table */}
        {curriculum.curriculumDetails && curriculum.curriculumDetails.length > 0 && (
          <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.primary.main }}>Chi tiết chương trình</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Chủ đề</TableCell>
                    <TableCell>Mạch nội dung</TableCell>
                    <TableCell>Mạch kiến thức</TableCell>
                    <TableCell>Nội dung</TableCell>
                    <TableCell>Mục tiêu</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {curriculum.curriculumDetails.map(detail => (
                    <TableRow key={detail.curriculumDetailId}>
                      <TableCell>{detail.curriculumTopic}</TableCell>
                      <TableCell>{detail.curriculumSection}</TableCell>
                      <TableCell>{detail.curriculumSubSection}</TableCell>
                      <TableCell>{detail.curriculumContent}</TableCell>
                      <TableCell style={{ whiteSpace: 'pre-line' }}>{detail.curriculumGoal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default TeacherRequirements; 