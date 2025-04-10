import React from 'react';
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
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Quiz as QuizIcon,
  Group as GroupIcon,
  Timer as TimerIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const TotalExams = () => {
  // Mock data
  const exams = [
    {
      id: 'EX001',
      title: 'Kiểm tra chương 1: Phương trình bậc hai',
      teacherName: 'Nguyễn Văn A',
      subject: 'Toán học',
      grade: 'Lớp 1',
      status: 'approved',
      createdAt: '2024-03-01',
      duration: '45 phút',
      questions: 20,
      difficulty: 'medium'
    },
    {
      id: 'EX002',
      title: 'Kiểm tra chương 2: Hàm số và đồ thị',
      teacherName: 'Trần Thị B',
      subject: 'Toán học',
      grade: 'Lớp 2',
      status: 'pending',
      createdAt: '2024-03-02',
      duration: '60 phút',
      questions: 25,
      difficulty: 'hard'
    },
    {
      id: 'EX003',
      title: 'Kiểm tra chương 3: Hình học không gian',
      teacherName: 'Lê Văn C',
      subject: 'Toán học',
      grade: 'Lớp 3',
      status: 'approved',
      createdAt: '2024-03-03',
      duration: '90 phút',
      questions: 30,
      difficulty: 'hard'
    },
    {
      id: 'EX004',
      title: 'Kiểm tra 15 phút: Giới hạn hàm số',
      teacherName: 'Phạm Thị D',
      subject: 'Toán học',
      grade: 'Lớp 4',
      status: 'rejected',
      createdAt: '2024-03-04',
      duration: '15 phút',
      questions: 10,
      difficulty: 'easy'
    },
    {
      id: 'EX005',
      title: 'Kiểm tra học kỳ: Đạo hàm và ứng dụng',
      teacherName: 'Hoàng Văn E',
      subject: 'Toán học',
      grade: 'Lớp 5',
      status: 'approved',
      createdAt: '2024-03-05',
      duration: '90 phút',
      questions: 40,
      difficulty: 'hard'
    }
  ];

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
      value: '32',
      icon: <QuizIcon sx={{ fontSize: 40 }} />,
      color: 'primary'
    },
    {
      title: 'Số giáo viên tham gia',
      value: '8',
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      color: 'success'
    },
    {
      title: 'Thời gian trung bình',
      value: '60 phút',
      icon: <TimerIcon sx={{ fontSize: 40 }} />,
      color: 'warning'
    },
    {
      title: 'Tổng câu hỏi',
      value: '450',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: 'info'
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

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên đề thi</TableCell>
                <TableCell>Giáo viên</TableCell>
                <TableCell>Khối lớp</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Số câu hỏi</TableCell>
                <TableCell>Độ khó</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow 
                  key={exam.id}
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
                  <TableCell>{exam.id}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {exam.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{exam.teacherName}</TableCell>
                  <TableCell>{exam.grade}</TableCell>
                  <TableCell>{exam.duration}</TableCell>
                  <TableCell>{exam.questions}</TableCell>
                  <TableCell>{getDifficultyChip(exam.difficulty)}</TableCell>
                  <TableCell>{getStatusChip(exam.status)}</TableCell>
                  <TableCell>
                    {new Date(exam.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TotalExams; 