import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const Reports = () => {
  const [reportType, setReportType] = useState('lessons');
  const [timeRange, setTimeRange] = useState('month');
  const [grade, setGrade] = useState('all');

  // Mock data for reports
  const lessonReports = [
    {
      id: 'LR001',
      title: 'Báo cáo bài giảng tháng 3/2024',
      grade: 'Lớp 1',
      totalLessons: 25,
      approvedLessons: 20,
      pendingLessons: 3,
      rejectedLessons: 2,
      totalViews: 1250,
      averageDuration: '35 phút',
      createdAt: '2024-03-15'
    },
    {
      id: 'LR002',
      title: 'Báo cáo bài giảng tháng 3/2024',
      grade: 'Lớp 2',
      totalLessons: 28,
      approvedLessons: 24,
      pendingLessons: 2,
      rejectedLessons: 2,
      totalViews: 1450,
      averageDuration: '40 phút',
      createdAt: '2024-03-15'
    },
    {
      id: 'LR003',
      title: 'Báo cáo bài giảng tháng 3/2024',
      grade: 'Lớp 3',
      totalLessons: 30,
      approvedLessons: 26,
      pendingLessons: 3,
      rejectedLessons: 1,
      totalViews: 1650,
      averageDuration: '45 phút',
      createdAt: '2024-03-15'
    }
  ];

  const examReports = [
    {
      id: 'ER001',
      title: 'Báo cáo đề thi tháng 3/2024',
      grade: 'Lớp 1',
      totalExams: 15,
      approvedExams: 12,
      pendingExams: 2,
      rejectedExams: 1,
      totalQuestions: 150,
      averageDuration: '30 phút',
      createdAt: '2024-03-15'
    },
    {
      id: 'ER002',
      title: 'Báo cáo đề thi tháng 3/2024',
      grade: 'Lớp 2',
      totalExams: 18,
      approvedExams: 15,
      pendingExams: 2,
      rejectedExams: 1,
      totalQuestions: 180,
      averageDuration: '35 phút',
      createdAt: '2024-03-15'
    },
    {
      id: 'ER003',
      title: 'Báo cáo đề thi tháng 3/2024',
      grade: 'Lớp 3',
      totalExams: 20,
      approvedExams: 17,
      pendingExams: 2,
      rejectedExams: 1,
      totalQuestions: 200,
      averageDuration: '40 phút',
      createdAt: '2024-03-15'
    }
  ];

  const stats = [
    {
      title: 'Tổng số báo cáo',
      value: '12',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: 'primary'
    },
    {
      title: 'Báo cáo bài giảng',
      value: '6',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: 'success'
    },
    {
      title: 'Báo cáo đề thi',
      value: '6',
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      color: 'warning'
    },
    {
      title: 'Tổng lượt xem',
      value: '4,350',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: 'info'
    }
  ];

  const handleDownloadReport = (reportId) => {
    // Implement download logic here
    console.log('Downloading report:', reportId);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Báo cáo và Thống kê
      </Typography>

      <Grid container spacing={3}>
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

        {/* Filters */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Loại báo cáo</InputLabel>
                  <Select
                    value={reportType}
                    label="Loại báo cáo"
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <MenuItem value="lessons">Báo cáo bài giảng</MenuItem>
                    <MenuItem value="exams">Báo cáo đề thi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Thời gian</InputLabel>
                  <Select
                    value={timeRange}
                    label="Thời gian"
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <MenuItem value="week">Tuần</MenuItem>
                    <MenuItem value="month">Tháng</MenuItem>
                    <MenuItem value="quarter">Quý</MenuItem>
                    <MenuItem value="year">Năm</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Khối lớp</InputLabel>
                  <Select
                    value={grade}
                    label="Khối lớp"
                    onChange={(e) => setGrade(e.target.value)}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="1">Lớp 1</MenuItem>
                    <MenuItem value="2">Lớp 2</MenuItem>
                    <MenuItem value="3">Lớp 3</MenuItem>
                    <MenuItem value="4">Lớp 4</MenuItem>
                    <MenuItem value="5">Lớp 5</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Reports Table */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Tiêu đề</TableCell>
                    <TableCell>Khối lớp</TableCell>
                    <TableCell>Tổng số</TableCell>
                    <TableCell>Đã duyệt</TableCell>
                    <TableCell>Chờ duyệt</TableCell>
                    <TableCell>Từ chối</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(reportType === 'lessons' ? lessonReports : examReports).map((report) => (
                    <TableRow 
                      key={report.id}
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
                      <TableCell>{report.id}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                          {report.title}
                        </Typography>
                      </TableCell>
                      <TableCell>{report.grade}</TableCell>
                      <TableCell>
                        {reportType === 'lessons' ? report.totalLessons : report.totalExams}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={reportType === 'lessons' ? report.approvedLessons : report.approvedExams}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={reportType === 'lessons' ? report.pendingLessons : report.pendingExams}
                          color="warning"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={reportType === 'lessons' ? report.rejectedLessons : report.rejectedExams}
                          color="error"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          Tải xuống
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports; 