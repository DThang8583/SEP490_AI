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
  Snackbar,
  IconButton
} from '@mui/material';
import { 
  ArrowBack,
  School as SchoolIcon,
  Event as EventIcon,
  Description,
  Assignment,
  Send as SendIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { format, parse, parseISO, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';

const RecentUsersList = ({ comments, handleDeleteComment, handleEditClick, editingCommentId, editedCommentBody, setEditedCommentBody, handleSaveComment, handleCancelClick, currentUser }) => (
  <List>
    {comments.map((comment) => (
      <React.Fragment key={comment.commentId}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar src={comment.imgURL}>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {comment.user}
              </Typography>
            }
            secondary={
              <React.Fragment>
                {
                  editingCommentId === comment.commentId ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={editedCommentBody}
                      onChange={(e) => setEditedCommentBody(e.target.value)}
                      sx={{ mt: 1, mb: 1 }}
                    />
                  ) : (
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {comment.commentBody}
                    </Typography>
                  )
                }
                 <Typography
                  sx={{ display: 'block' }}
                  component="span"
                  variant="caption"
                  color="text.secondary"
                >
                  {/* Parse and format the timeStamp date */}
                  {comment.timeStamp}
                </Typography>
              </React.Fragment>
            }
          />
          {/* Edit and Delete buttons */}
          {currentUser && currentUser.userId === comment.userId && ( // Only show if current user is the author
            <Box sx={{ ml: 2, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              {editingCommentId === comment.commentId ? (
                <Stack direction="row" spacing={0}>
                  <Button variant="outlined" size="small" onClick={() => handleSaveComment(comment.commentId)}>Lưu</Button>
                  <Button variant="outlined" size="small" color="secondary" onClick={handleCancelClick}>Hủy</Button>
                </Stack>
              ) : (
                <Stack direction="row" spacing={0}>
                  <IconButton size="small" onClick={() => handleEditClick(comment)} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteComment(comment.commentId)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              )}
            </Box>
          )}
        </ListItem>
        <Divider variant="inset" component="li" />
      </React.Fragment>
    ))}
  </List>
);

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
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentBody, setEditedCommentBody] = useState('');
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
        console.log('fetchBlogDetails code:', response.data?.code);
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
        console.log('fetchLessonDetail code:', response.data?.code);
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

      if (response.data && response.data.code === 0 || response.data.code === 21) {
        // Thành công, xử lý bình luận
        console.log('handleSubmitComment code:', response.data?.code);
        
        // Fetch lại blog details để lấy thông tin comment mới nhất
        const blogResponse = await axios.get(
          `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/blogs/${blogId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (blogResponse.data && blogResponse.data.code === 0) {
          // Cập nhật comments với dữ liệu mới từ API
          setComments(blogResponse.data.data.comments || []);
          setNewComment('');
          setSnackbar({
            open: true,
            message: 'Bình luận đã được gửi thành công!',
            severity: 'success'
          });
        }
      } else {
        console.error('API returned non-success code for submitting comment:', response.data);
        setSnackbar({
          open: true,
          message: response.data?.message || 'Có lỗi xảy ra khi gửi bình luận.',
          severity: 'error'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Không thể gửi bình luận',
        severity: 'error'
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditedCommentBody(comment.commentBody);
  };

  const handleCancelClick = () => {
    setEditingCommentId(null);
    setEditedCommentBody('');
  };

  const handleSaveComment = async (commentId) => {
    if (!editedCommentBody.trim()) return; // Prevent saving empty comment

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await axios.put(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/blogs/${blogId}/comments/${commentId}`,
        { body: editedCommentBody },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.code === 0 || response.data.code === 22) { // Assuming code 22 is also success for update
        // Update the comment in the state
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.commentId === commentId ? { ...comment, commentBody: editedCommentBody } : comment
          )
        );
        setEditingCommentId(null);
        setEditedCommentBody('');
        setSnackbar({
          open: true,
          message: 'Bình luận đã được cập nhật thành công!',
          severity: 'success'
        });
      } else {
        console.error('API returned non-success code for updating comment:', response.data);
        setSnackbar({
          open: true,
          message: response.data?.message || 'Có lỗi xảy ra khi cập nhật bình luận.',
          severity: 'error'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Không thể cập nhật bình luận',
        severity: 'error'
      });
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

  // Thêm useEffect mới để lưu gradeId vào localStorage
  useEffect(() => {
    if (lesson?.gradeId) {
      localStorage.setItem('gradeId', lesson.gradeId);
      console.log('GradeId saved to localStorage:', lesson.gradeId);
    }
  }, [lesson?.gradeId]);

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

      if (response.data && response.data.code === 0 || response.data.code === 23) {
        // Xóa bình luận khỏi state
        console.log('handleDeleteComment code:', response.data?.code);
        setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
        setSnackbar({
          open: true,
          message: 'Đã xóa bình luận thành công!',
          severity: 'success'
        });
      } else {
        console.error('API returned non-success code for deleting comment:', response.data);
        setSnackbar({
          open: true,
          message: response.data?.message || 'Có lỗi xảy ra khi xóa bình luận.',
          severity: 'error'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Không thể xóa bình luận',
        severity: 'error'
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
                     {blogDetails.name}
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

                    {/* Display existing comments */}
                    {!loadingBlog && !error && blogDetails && blogDetails.comments && ( // Pass necessary props
                      <RecentUsersList
                        comments={comments}
                        handleDeleteComment={handleDeleteComment}
                        handleEditClick={handleEditClick}
                        editingCommentId={editingCommentId}
                        editedCommentBody={editedCommentBody}
                        setEditedCommentBody={setEditedCommentBody}
                        handleSaveComment={handleSaveComment}
                        handleCancelClick={handleCancelClick}
                        currentUser={currentUser}
                      />
                    )}
                     {!loadingBlog && !error && (!blogDetails || !blogDetails.comments || blogDetails.comments.length === 0) && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Chưa có bình luận nào.
                      </Typography>
                    )}
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