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
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

const TotalLessons = () => {
  // Mock data
  const lessons = [
    {
      id: 'LS001',
      title: 'Phương trình bậc hai',
      teacherName: 'Nguyễn Văn A',
      subject: 'Toán học',
      grade: 'Lớp 1',
      status: 'approved',
      createdAt: '2024-03-01',
      views: 245,
      duration: '45 phút'
    },
    {
      id: 'LS002',
      title: 'Hàm số và đồ thị',
      teacherName: 'Trần Thị B',
      subject: 'Toán học',
      grade: 'Lớp 2',
      status: 'pending',
      createdAt: '2024-03-02',
      views: 180,
      duration: '40 phút'
    },
    {
      id: 'LS003',
      title: 'Hình học không gian',
      teacherName: 'Lê Văn C',
      subject: 'Toán học',
      grade: 'Lớp 3',
      status: 'rejected',
      createdAt: '2024-03-03',
      views: 0,
      duration: '50 phút'
    },
    {
      id: 'LS004',
      title: 'Giới hạn của hàm số',
      teacherName: 'Phạm Thị D',
      subject: 'Toán học',
      grade: 'Lớp 4',
      status: 'approved',
      createdAt: '2024-03-04',
      views: 320,
      duration: '45 phút'
    },
    {
      id: 'LS005',
      title: 'Đạo hàm và ứng dụng',
      teacherName: 'Hoàng Văn E',
      subject: 'Toán học',
      grade: 'Lớp 5',
      status: 'approved',
      createdAt: '2024-03-05',
      views: 290,
      duration: '55 phút'
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

  const stats = [
    {
      title: 'Tổng số bài giảng',
      value: '45',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: 'primary'
    },
    {
      title: 'Giáo viên tham gia',
      value: '12',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      color: 'success'
    },
    {
      title: 'Thời lượng trung bình',
      value: '45 phút',
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      color: 'warning'
    },
    {
      title: 'Lượt xem trung bình',
      value: '258',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: 'info'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Quản lý bài giảng Toán học
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
                <TableCell>Tên bài giảng</TableCell>
                <TableCell>Giáo viên</TableCell>
                <TableCell>Khối lớp</TableCell>
                <TableCell>Thời lượng</TableCell>
                <TableCell>Lượt xem</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow 
                  key={lesson.id}
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
                  <TableCell>{lesson.id}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {lesson.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{lesson.teacherName}</TableCell>
                  <TableCell>{lesson.grade}</TableCell>
                  <TableCell>{lesson.duration}</TableCell>
                  <TableCell>{lesson.views}</TableCell>
                  <TableCell>{getStatusChip(lesson.status)}</TableCell>
                  <TableCell>
                    {new Date(lesson.createdAt).toLocaleDateString('vi-VN')}
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

export default TotalLessons; 