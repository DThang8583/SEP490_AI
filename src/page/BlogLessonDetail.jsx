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
  Send as SendIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';

const BlogLessonDetail = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { blogId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);

  console.log('BlogLessonDetail loaded with blogId:', blogId);

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [blogDetails, setBlogDetails] = useState(null);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchBlogDetails = async (blogId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Authentication token not found.');
        return null;
      }

      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/blogs/${blogId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.code === 0) {
        console.log('Blog details:', response.data.data);
        return response.data.data;
      } else {
        console.error('Failed to fetch blog details:', response.data?.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching blog details:', error);
      return null;
    }
  };

  const fetchLessonDetail = async (lessonPlanId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await axios.get( 
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lesson-plans/${lessonPlanId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.code === 0) {
        setLesson(response.data.data);
      } else {
        console.error('Failed to fetch Lesson Plan details:', response.data?.message);
        setError(response.data?.message || 'Không thể tải chi tiết Giáo án');
      }
    } catch (err) {
      console.error('Error fetching Lesson Plan details:', err);
      setError(err.message || 'Không thể tải chi tiết Giáo án');
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
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/blogs/${blogId}/comments`,
        { body: newComment },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.code === 0) {
        // Thành công, xử lý bình luận
        const userInfo = response.data.data;
      
        const newCommentObj = {
          commentBody: newComment,
          createdAt: new Date().toISOString(),
          timeStamp: new Date().toISOString(),
          userId: userInfo?.userId,
          username: userInfo?.username,
          fullname: userInfo?.fullname,
          imgURL: userInfo?.imgURL
        };
      
        setComments(prevComments => [newCommentObj, ...prevComments]);
        setNewComment('');
        setSnackbar({
          open: true,
          message: 'Bình luận đã được gửi thành công!',
          severity: 'success'
        });
      } else {
        const errorMsg = response.data?.message || 'Có lỗi xảy ra khi gửi bình luận';
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Không thể gửi bình luận',
        severity: 'success'
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  useEffect(() => {
    const loadBlogAndRelatedData = async () => {
      setLoadingBlog(true);
      setError('');
      setLesson(null);
      const blogData = await fetchBlogDetails(blogId);
      if (blogData) {
        setBlogDetails(blogData);
        setComments(blogData.comments || []);
        
        if (blogData.lessonPlanId) {
            fetchLessonDetail(blogData.lessonPlanId);
        } else {
            console.warn('No lessonPlanId found for this blog.');
        }
      } else {
        setError('Không thể tải chi tiết bài viết.');
      }
      setLoadingBlog(false);
      setLoading(false);
    };
    
    if (blogId) {
      loadBlogAndRelatedData();
    } else {
      setError('Không tìm thấy ID bài viết trong URL.');
      setLoading(false);
      setLoadingBlog(false);
    }
  }, [blogId]);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        console.log('Current user from localStorage:', parsedUserInfo);
        setCurrentUser(parsedUserInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await axios.delete(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/blogs/${blogId}/comments/${commentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.code === 0) {
        // Xóa bình luận khỏi state
        setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
        setSnackbar({
          open: true,
          message: 'Đã xóa bình luận thành công!',
          severity: 'success'
        });
      } else {
      }
    } catch (err) {
      setSnackbar({
        open: true,
      });
    }
  };

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

  if (loading || loadingBlog) {
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
                  {blogDetails?.title}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  <EventIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  {blogDetails?.publicationDate}
                </Typography>
              </Stack>
              {blogDetails && (
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Lesson Plan ID: {blogDetails.lessonPlanId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Danh mục: {blogDetails.category}
                  </Typography>
                </Stack>
              )}
            </Box>

            <Divider />

            {/* Content */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Nội dung bài viết
                    </Typography>
                    {formatContent(blogDetails?.body)}
                  </Box>

                  {/* Lesson Plan Details (Mục tiêu, Giáo viên chuẩn bị, Hoạt động) */}
                  {lesson && (
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
                    </Stack>
                  )}

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
                        comments.map((comment, index) => {
                          console.log('Comment data:', { comment, currentUser });
                          return (
                            <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle2" component="div">
                                      {comment.user || 'Người dùng'}
                                    </Typography>
                                    {currentUser && comment.user === currentUser.fullName && (
                                      <Button
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeleteComment(comment.commentId)}
                                        sx={{ minWidth: 'auto', p: 0.5 }}
                                      >
                                        Xóa
                                      </Button>
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <>
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                      sx={{ display: 'block', mb: 0.5 }}
                                    >
                                      {comment.commentBody || comment.content}
                                    </Typography>
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {comment.timeStamp}
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                          );
                        })
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                        </Typography>
                      )}
                    </List>
                  </Box>
                </Stack>
              </Grid>

              {/* Sidebar (Thông tin Giáo án) */}
              {lesson && (
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
                      {/* Module */}
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Chủ đề
                        </Typography>
                        <Typography variant="body1">
                          {lesson?.module || 'N/A'}
                        </Typography>
                      </Box>
                      {/* Created At */}
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Ngày tạo
                        </Typography>
                        <Typography variant="body1">
                          {lesson.createdAt}
                        </Typography>
                      </Box>
                      {/* Grade and Total Periods - assuming they are in lesson data */}
                      {(lesson?.grade || lesson?.totalPeriods) && (
                          <Box>
                             <Typography variant="body2" color="text.secondary">
                               Lớp / Số tiết
                             </Typography>
                             <Typography variant="body1">
                               {`${lesson?.grade || 'N/A'} / ${lesson?.totalPeriods || 'N/A'}`}
                             </Typography>
                          </Box>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
              )}
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