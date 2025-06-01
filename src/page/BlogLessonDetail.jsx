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
  IconButton,
  Fade,
  Zoom
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
  Edit as EditIcon,
  Article as ArticleIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { format, parse, parseISO, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Styled Components
const MainContainer = styled(Box)(({ theme, isDarkMode }) => ({
  minHeight: 'calc(100vh - 64px)',
  background: isDarkMode
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #2196F3 0%, #21CBF3 50%, #2196F3 100%)',
  position: 'relative',
  overflow: 'hidden',
  paddingTop: '32px',
  paddingBottom: '32px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDarkMode
      ? 'radial-gradient(circle at 20% 80%, rgba(33, 150, 243, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

const MainCard = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '40px',
  borderRadius: '20px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.2)',
  boxShadow: isDarkMode
    ? '0 20px 40px rgba(0, 0, 0, 0.3)'
    : '0 20px 40px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeIn} 0.8s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.1), transparent)',
    animation: `${shimmer} 3s ease-in-out infinite`,
  },
}));

const SidebarCard = styled(Paper)(({ theme, isDarkMode }) => ({
  padding: '24px',
  borderRadius: '16px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)'
    : 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
  backdropFilter: 'blur(10px)',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.1)',
  boxShadow: isDarkMode
    ? '0 12px 30px rgba(0, 0, 0, 0.2)'
    : '0 12px 30px rgba(0, 0, 0, 0.05)',
}));

const MainTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 800,
  fontSize: '2.2rem',
  background: isDarkMode
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
    : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '0.5px',
  lineHeight: 1.3,
  [theme.breakpoints.down('md')]: {
    fontSize: '1.8rem',
  },
}));

const SectionTitle = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 700,
  fontSize: '1.3rem',
  color: isDarkMode ? '#2196F3' : '#1976D2',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

const ContentText = styled(Typography)(({ theme, isDarkMode }) => ({
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontSize: '1rem',
  lineHeight: 1.7,
  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
  marginBottom: '16px',
}));

const StyledTextField = styled(TextField)(({ theme, isDarkMode }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    '& fieldset': {
      borderColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(33, 150, 243, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: isDarkMode 
        ? 'rgba(255, 255, 255, 0.4)' 
        : 'rgba(33, 150, 243, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2196F3',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontWeight: 600,
  },
  '& .MuiInputBase-input': {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  },
}));

const SubmitButton = styled(Button)(({ theme, isDarkMode }) => ({
  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  color: '#fff',
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 700,
  fontSize: '0.9rem',
  padding: '12px 24px',
  borderRadius: '12px',
  boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(33, 150, 243, 0.4)',
    background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
  },
  '&:disabled': {
    opacity: 0.7,
    transform: 'none',
  },
}));

const BackButton = styled(Button)(({ theme, isDarkMode }) => ({
  marginBottom: '24px',
  color: isDarkMode ? '#ffffff' : '#2D3436',
  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 600,
  borderRadius: '12px',
  padding: '12px 24px',
  background: isDarkMode
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  backdropFilter: 'blur(10px)',
  border: isDarkMode
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.2)',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(33, 150, 243, 0.1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
  },
}));

const FloatingBubble = styled(Box)(({ theme, size, top, left, delay, isDarkMode }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: isDarkMode
    ? `rgba(33, 150, 243, ${Math.random() * 0.1 + 0.05})`
    : `rgba(33, 150, 243, ${Math.random() * 0.08 + 0.02})`,
  top: top,
  left: left,
  animation: `${float} ${Math.random() * 8 + 8}s ease-in-out infinite`,
  animationDelay: delay,
  zIndex: 1,
  pointerEvents: 'none',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
  animation: `${float} 2s ease-in-out infinite`,
}));

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
      <MainContainer isDarkMode={isDarkMode}>
        <LoadingContainer>
          <CircularProgress size={60} sx={{ color: '#2196F3' }} />
        </LoadingContainer>
      </MainContainer>
    );
  }

  if (error) {
    return (
      <MainContainer isDarkMode={isDarkMode}>
        <StyledContainer maxWidth="lg">
          <Alert 
            severity="error"
            sx={{ 
              mt: 4,
              borderRadius: '12px',
              fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            {error}
          </Alert>
        </StyledContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer isDarkMode={isDarkMode}>
      {/* Floating Bubbles */}
      {[...Array(15)].map((_, index) => (
        <FloatingBubble
          key={index}
          size={Math.random() * 80 + 40}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          delay={`${Math.random() * 5}s`}
          isDarkMode={isDarkMode}
        />
      ))}

      <StyledContainer maxWidth="lg">
        <Fade in timeout={800}>
          <BackButton
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
            isDarkMode={isDarkMode}
        >
          Quay lại
          </BackButton>
        </Fade>

        <Zoom in timeout={1000}>
          <MainCard elevation={0} isDarkMode={isDarkMode}>
            <Stack spacing={5}>
              {/* Header Section */}
            <Box>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <ArticleIcon sx={{ fontSize: 40, color: '#2196F3' }} />
                  <MainTitle variant="h4" component="h1" isDarkMode={isDarkMode}>
                  {blogDetails?.title}
                  </MainTitle>
              </Stack>
                <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                      fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <EventIcon sx={{ fontSize: 16 }} />
                  {blogDetails?.publicationDate}
                </Typography>
              {blogDetails && (
                    <>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                        }}
                      >
                        Tác giả: {blogDetails.name}
                  </Typography>
                      <Chip 
                        label={blogDetails.category}
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                          color: '#fff',
                          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                          fontWeight: 600,
                        }}
                      />
                    </>
                  )}
                </Stack>
            </Box>

              <Divider sx={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(33, 150, 243, 0.2)' }} />

              {/* Main Content */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                  <Stack spacing={5}>
                    {/* Blog Content */}
                    <Fade in timeout={1200}>
                  <Box>
                        <SectionTitle isDarkMode={isDarkMode}>
                          <Description />
                      Nội dung bài viết
                        </SectionTitle>
                        {blogDetails?.body?.split('\n').map((line, index) => (
                          <ContentText key={index} isDarkMode={isDarkMode}>
                            {line}
                          </ContentText>
                        ))}
                  </Box>
                    </Fade>

                    {/* Lesson Plan Details */}
                  {lesson && (
                      <Fade in timeout={1400}>
                    <Stack spacing={4}>
                          {/* Goal Section */}
                      <Box>
                            <SectionTitle isDarkMode={isDarkMode}>
                              <Assignment />
                            Mục tiêu
                            </SectionTitle>
                            {lesson?.goal?.split('\n').map((line, index) => (
                              <ContentText key={index} isDarkMode={isDarkMode}>
                                {line}
                              </ContentText>
                            ))}
                      </Box>

                          {/* School Supply Section */}
                      <Box>
                            <SectionTitle isDarkMode={isDarkMode}>
                              <Description />
                            Giáo viên chuẩn bị
                            </SectionTitle>
                            {lesson?.schoolSupply?.split('\n').map((line, index) => (
                              <ContentText key={index} isDarkMode={isDarkMode}>
                                {line}
                              </ContentText>
                            ))}
                      </Box>

                          {/* Activity Sections */}
                          {[
                            { title: '1. Hoạt động Khởi động', content: lesson?.startUp },
                            { title: '2. Hoạt động Hình thành Kiến thức', content: lesson?.knowledge },
                            { title: '3. Hoạt động Luyện tập', content: lesson?.practice },
                            { title: '4. Hoạt động Vận dụng', content: lesson?.apply }
                          ].map((section, index) => (
                            <Box key={index}>
                              <SectionTitle isDarkMode={isDarkMode}>
                                {section.title}
                              </SectionTitle>
                              {section.content?.split('\n').map((line, lineIndex) => (
                                <ContentText key={lineIndex} isDarkMode={isDarkMode}>
                                  {line}
                                </ContentText>
                              ))}
                      </Box>
                          ))}
                    </Stack>
                      </Fade>
                  )}

                  {/* Comments Section */}
                    <Fade in timeout={1600}>
                  <Box>
                        <SectionTitle isDarkMode={isDarkMode}>
                          <CommentIcon />
                      Bình luận
                        </SectionTitle>
                    
                    {/* Comment Input */}
                        <Box sx={{ mb: 4 }}>
                          <StyledTextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Viết bình luận của bạn..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        variant="outlined"
                            isDarkMode={isDarkMode}
                            sx={{ mb: 2 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <SubmitButton
                          variant="contained"
                          endIcon={<SendIcon />}
                          onClick={handleSubmitComment}
                          disabled={!newComment.trim() || submittingComment}
                              isDarkMode={isDarkMode}
                        >
                          {submittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                            </SubmitButton>
                      </Box>
                    </Box>

                        {/* Display Comments */}
                        {!loadingBlog && !error && blogDetails && blogDetails.comments && (
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
                          <ContentText isDarkMode={isDarkMode} sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                        Chưa có bình luận nào.
                          </ContentText>
                    )}
                  </Box>
                    </Fade>
                </Stack>
              </Grid>

                {/* Sidebar */}
              {lesson && (
                <Grid item xs={12} md={4}>
                    <Fade in timeout={1800}>
                      <SidebarCard elevation={0} isDarkMode={isDarkMode}>
                        <Stack spacing={3}>
                          <SectionTitle isDarkMode={isDarkMode}>
                            <SchoolIcon />
                        Thông tin Giáo án
                          </SectionTitle>
                          <Divider sx={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(33, 150, 243, 0.1)' }} />
                          
                      {/* Module */}
                      <Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                                mb: 1,
                              }}
                            >
                          Chủ đề
                        </Typography>
                            <Typography 
                              variant="body1"
                              sx={{ 
                                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                                fontWeight: 600,
                              }}
                            >
                          {lesson?.module || 'N/A'}
                        </Typography>
                      </Box>
                          
                          {/* Created Date */}
                      <Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                                mb: 1,
                              }}
                            >
                          Ngày tạo
                        </Typography>
                            <Typography 
                              variant="body1"
                              sx={{ 
                                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                                fontWeight: 600,
                              }}
                            >
                          {lesson.createdAt}
                        </Typography>
                      </Box>
                          
                          {/* Grade and Periods */}
                      {(lesson?.grade || lesson?.totalPeriods) && (
                          <Box>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                                  mb: 1,
                                }}
                              >
                               Lớp / Số tiết
                             </Typography>
                              <Typography 
                                variant="body1"
                                sx={{ 
                                  fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
                                  fontWeight: 600,
                                }}
                              >
                               {`${lesson?.grade || 'N/A'} / ${lesson?.totalPeriods || 'N/A'}`}
                             </Typography>
                          </Box>
                      )}
                    </Stack>
                      </SidebarCard>
                    </Fade>
                </Grid>
              )}
            </Grid>
          </Stack>
          </MainCard>
        </Zoom>
      </StyledContainer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainContainer>
  );
};

export default BlogLessonDetail; 