import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Statistics = () => {
  // Mock data for charts
  const monthlyData = [
    { month: 'T1', lessons: 15, exams: 8 },
    { month: 'T2', lessons: 20, exams: 12 },
    { month: 'T3', lessons: 25, exams: 15 },
    { month: 'T4', lessons: 30, exams: 18 },
    { month: 'T5', lessons: 22, exams: 14 },
    { month: 'T6', lessons: 28, exams: 16 },
  ];

  const statusData = [
    { name: 'Đã duyệt', value: 65, color: '#4CAF50' },
    { name: 'Chờ duyệt', value: 25, color: '#FFA726' },
    { name: 'Từ chối', value: 10, color: '#EF5350' },
  ];

  const gradeData = [
    { grade: 'Lớp 1', count: 12 },
    { grade: 'Lớp 2', count: 15 },
    { grade: 'Lớp 3', count: 18 },
    { grade: 'Lớp 4', count: 22 },
    { grade: 'Lớp 5', count: 20 },
  ];

  const topTeachers = [
    { name: 'Nguyễn Văn A', lessons: 25, completion: 95 },
    { name: 'Trần Thị B', lessons: 20, completion: 88 },
    { name: 'Lê Văn C', lessons: 18, completion: 92 },
    { name: 'Phạm Thị D', lessons: 15, completion: 85 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Thống kê tổng quan
      </Typography>

      <Grid container spacing={3}>
        {/* Monthly Activity Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Hoạt động theo tháng
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="lessons" name="Giáo án" fill="#2196F3" />
                <Bar dataKey="exams" name="Đề thi" fill="#FF9800" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Phân bố trạng thái
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Grade Distribution */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Phân bố theo khối lớp
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" name="Số lượng" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Teachers */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Giáo viên tích cực
            </Typography>
            <Grid container spacing={3}>
              {topTeachers.map((teacher, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                        {teacher.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {teacher.lessons} Giáo án
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          Hoàn thành:
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {teacher.completion}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={teacher.completion}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics; 