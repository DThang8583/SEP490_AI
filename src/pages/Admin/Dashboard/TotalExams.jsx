import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Pagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Quiz as QuizIcon,
  Group as GroupIcon,
  Timer as TimerIcon,
  Assessment as AssessmentIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';

const TotalExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/quizzes`,
        {
          params: {
            Page: page,
            PageSize: pageSize,
            searchTerm: searchTerm,
          }
        }
      );
      
      if (response.data.code === 0) {
        setExams(response.data.data.items);
        setTotalPages(response.data.data.totalPages);
        setTotalRecords(response.data.data.totalRecords);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [page, pageSize, searchTerm]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'approved':
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Đã duyệt"
            color="success"
            size="small"
            sx={{ minWidth: 100 }}
          />
        );
      case 'rejected':
        return (
          <Chip
            icon={<CancelIcon />}
            label="Từ chối"
            color="error"
            size="small"
            sx={{ minWidth: 100 }}
          />
        );
      default:
        return (
          <Chip
            icon={<PendingIcon />}
            label="Chờ duyệt"
            color="warning"
            size="small"
            sx={{ minWidth: 100 }}
          />
        );
    }
  };

  const getDifficultyChip = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return (
          <Chip
            label="Dễ"
            color="success"
            size="small"
            variant="outlined"
          />
        );
      case 'hard':
        return (
          <Chip
            label="Khó"
            color="error"
            size="small"
            variant="outlined"
          />
        );
      default:
        return (
          <Chip
            label="Trung bình"
            color="warning"
            size="small"
            variant="outlined"
          />
        );
    }
  };

  const stats = [
    {
      title: 'Tổng số đề thi',
      value: totalRecords.toString(),
      icon: <QuizIcon sx={{ fontSize: 40 }} />,
      color: 'primary'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Quản lý đề thi Toán học
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Box sx={{ 
                  color: `${stat.color}.main`,
                  bgcolor: `${stat.color}.lighter`,
                  p: 1,
                  borderRadius: 2
                }}>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 3, width: '100%' }}>
        <TextField
          fullWidth
          label="Tìm kiếm đề thi"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading && <LinearProgress />}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên đề thi</TableCell>
                <TableCell>Tên bài học</TableCell>
                <TableCell>Khối</TableCell>
                <TableCell>Chủ đề</TableCell>
                <TableCell>Giáo viên</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow 
                  key={exam.quizId}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <TableCell>{exam.quizId}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {exam.quizName}
                    </Typography>
                  </TableCell>
                  <TableCell>{exam.lessonName}</TableCell>
                  <TableCell>Khối {exam.grade}</TableCell>
                  <TableCell>{exam.moduleName}</TableCell>
                  <TableCell>{exam.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TotalExams; 