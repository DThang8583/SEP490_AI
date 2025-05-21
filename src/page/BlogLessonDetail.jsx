import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  Button,
  Grid,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar
} from '@mui/material';
import { 
  ArrowBack,
  School as SchoolIcon,
  Event as EventIcon,
  Description,
  Assignment,
  Send as SendIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';

const BlogLessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchLessonDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/teacher-lessons/${lessonId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.code === 0) {
        setLesson(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
      }
    } catch (err) {
      console.error('Lỗi khi tải chi tiết Giáo án:', err);
      setError(err.message || 'Không thể tải chi tiết Giáo án');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/blogs/${lessonId}/comments`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.code === 0) {
        setComments(response.data.data || []);
      } else {
        console.error('Lỗi khi tải bình luận:', response.data?.message);
      }
    } catch (err) {
      console.error('Lỗi khi tải bình luận:', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setSubmittingComment(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      console.log('Token:', token);

      const response = await axios.post(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/blogs/${lessonId}/comments`,
        { body: newComment },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.code === 0) {
        // Get user information from the response
        const userInfo = response.data.data;
        
        // Add the new comment to the list with user information
        const newCommentObj = {
          content: newComment,
          createdAt: new Date().toISOString(),
          userId: userInfo.userId,
          username: userInfo.username,
          fullname: userInfo.fullname,
          imgURL: userInfo.imgURL
        };
        
        setComments(prevComments => [newCommentObj, ...prevComments]);
        setNewComment('');
        setSnackbar({
          open: true,
          message: 'Bình luận đã được gửi thành công!',
          severity: 'success'
        });
      } else {
        throw new Error(response.data?.message || 'Có lỗi xảy ra khi gửi bình luận');
      }
    } catch (err) {
      console.error('Lỗi khi gửi bình luận:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Không thể gửi bình luận',
        severity: 'error'
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  useEffect(() => {
    fetchLessonDetail();
    fetchComments();
  }, [lessonId]);

  const formatContent = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => (
      <Typography key={index} paragraph>
        {line}
      </Typography>
    ));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        py: 4,
        minHeight: 'calc(100vh - 64px)',
        background: isDarkMode
          ? 'linear-gradient(135deg, rgb(18, 18, 18) 0%, rgb(30, 30, 30) 100%)'
          : 'linear-gradient(135deg, rgb(245, 247, 250) 0%, rgb(255, 255, 255) 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Quay lại
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '16px',
            backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
            boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.05)',
          }}
        >
          <Stack spacing={4}>
            {/* Header */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <SchoolIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                  {lesson?.lesson}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  <EventIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  {format(new Date(lesson?.createdAt), 'dd/MM/yyyy')}
                </Typography>
              </Stack>
            </Box>

            <Divider />

            {/* Content */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Stack spacing={4}>
                  {/* Mục tiêu */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <Assignment color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Mục tiêu
                      </Typography>
                    </Stack>
                    {formatContent(lesson?.goal)}
                  </Box>

                  {/* Giáo viên chuẩn bị */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                      <Description color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Giáo viên chuẩn bị
                      </Typography>
                    </Stack>
                    {formatContent(lesson?.schoolSupply)}
                  </Box>

                  {/* Hoạt động Khởi động */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      1. Hoạt động Khởi động
                    </Typography>
                    {formatContent(lesson?.startUp)}
                  </Box>

                  {/* Hoạt động Hình thành Kiến thức */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      2. Hoạt động Hình thành Kiến thức
                    </Typography>
                    {formatContent(lesson?.knowledge)}
                  </Box>

                  {/* Hoạt động Luyện tập */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      3. Hoạt động Luyện tập
                    </Typography>
                    {formatContent(lesson?.practice)}
                  </Box>

                  {/* Hoạt động Vận dụng */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      4. Hoạt động Vận dụng
                    </Typography>
                    {formatContent(lesson?.apply)}
                  </Box>

                  {/* Comments Section */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Bình luận
                    </Typography>
                    
                    {/* Comment Input */}
                    <Box sx={{ mb: 3 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Viết bình luận của bạn..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<SendIcon />}
                          onClick={handleSubmitComment}
                          disabled={!newComment.trim() || submittingComment}
                        >
                          {submittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                        </Button>
                      </Box>
                    </Box>

                    {/* Comments List */}
                    <List>
                      {comments.length > 0 ? (
                        comments.map((comment, index) => (
                          <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar 
                                src={comment.imgURL} 
                                alt={comment.fullname || comment.username}
                              >
                                {(comment.fullname || comment.username || 'U').charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle2" component="div">
                                  {comment.fullname || comment.username || 'Người dùng'}
                                </Typography>
                              }
                              secondary={
                                <>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                    sx={{ display: 'block', mb: 0.5 }}
                                  >
                                    {comment.content}
                                  </Typography>
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm')}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                        </Typography>
                      )}
                    </List>
                  </Box>
                </Stack>
              </Grid>

              {/* Sidebar */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Thông tin Giáo án
                    </Typography>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Chủ đề
                      </Typography>
                      <Typography variant="body1">
                        {lesson?.module}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Ngày tạo
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(lesson?.createdAt), 'dd/MM/yyyy')}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        </Paper>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BlogLessonDetail; 