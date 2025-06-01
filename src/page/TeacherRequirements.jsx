import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  useTheme, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  Grid,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  MenuBook as MenuBookIcon,
  Schedule as ScheduleIcon,
  BookmarkBorder as BookmarkIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { styled, keyframes } from '@mui/material/styles';

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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 8px rgba(33, 150, 243, 0);
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

const glow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(33, 150, 243, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(33, 150, 243, 0.6));
  }
`;

// Styled Components
const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at 20% 80%, rgba(33, 150, 243, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: '32px 24px',
  position: 'relative',
  zIndex: 1,
}));

const BackButton = styled(Button)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.2)',
  color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
  fontWeight: 600,
  padding: '12px 24px',
  textTransform: 'none',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  marginBottom: '24px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)'
      : 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(33, 150, 243, 0.2)',
  },
}));

const HeaderCard = styled(Paper)(({ theme }) => ({
  padding: '48px 32px',
  marginBottom: '32px',
  textAlign: 'center',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: theme.palette.mode === 'dark'
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

const FloatingIcon = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  marginBottom: '16px',
  animation: `${float} 3s ease-in-out infinite`,
  boxShadow: '0 12px 30px rgba(33, 150, 243, 0.4)',
  border: '4px solid rgba(255, 255, 255, 0.2)',
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    color: '#fff',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
  },
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'sans-serif',
  fontWeight: 800,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
    : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
  backgroundClip: 'text',
  textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'sans-serif',
  fontSize: '1.25rem',
  fontWeight: 500,
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(25, 118, 210, 0.8)',
  marginBottom: '24px',
  letterSpacing: '0.3px',
  lineHeight: 1.6,
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '16px',
  marginBottom: '32px',
}));

const StatCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.15)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #2196F3, #21CBF3, #2196F3)',
  },
}));

const StatContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '20px',
  '&:last-child': {
    paddingBottom: '20px',
  },
}));

const StatIcon = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    color: '#fff',
  },
}));

const StatText = styled(Typography)(({ theme }) => ({
  fontFamily: 'sans-serif',
  fontSize: '2rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: '8px',
}));

const DetailsCard = styled(Paper)(({ theme }) => ({
  padding: '32px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.2)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  animation: `${slideInUp} 0.8s ease-out`,
}));

const TableTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'sans-serif',
  fontSize: '1.5rem',
  fontWeight: 700,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
    : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: '24px',
  letterSpacing: '0.3px',
}));

const ModernTableContainer = styled(TableContainer)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.1)',
  overflow: 'hidden',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  '& .MuiTableCell-root': {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1rem',
    padding: '16px',
    borderBottom: 'none',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ theme, index }) => ({
  background: 'transparent',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${fadeIn} ${0.8 + (index || 0) * 0.1}s ease-out`,
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0.02) 100%)',
    transform: 'scale(1.01)',
    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.1)',
  },
  '& .MuiTableCell-root': {
    padding: '16px',
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(33, 150, 243, 0.1)'}`,
    color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
    fontSize: '0.95rem',
    fontWeight: 500,
    lineHeight: 1.6,
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.03) 0%, rgba(33, 150, 243, 0.01) 100%)',
  borderRadius: '20px',
  backdropFilter: 'blur(20px)',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.1)',
  animation: `${fadeIn} 0.8s ease-out`,
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  color: '#2196F3',
  marginBottom: '24px',
  filter: 'drop-shadow(0 4px 8px rgba(33, 150, 243, 0.3))',
  animation: `${glow} 2s ease-in-out infinite`,
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  fontFamily: 'sans-serif',
  fontSize: '1.1rem',
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
  textAlign: 'center',
  marginTop: '16px',
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  maxWidth: 600,
  borderRadius: '16px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(244, 67, 54, 0.08) 0%, rgba(244, 67, 54, 0.04) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(244, 67, 54, 0.2)',
  boxShadow: '0 20px 40px rgba(244, 67, 54, 0.1)',
  animation: `${fadeIn} 0.8s ease-out`,
  margin: '0 auto',
  marginTop: '32px',
}));

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

        const response = await axios.get(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/curriculums',
          {
            params: {
              PageNumber: 1,
              PageSize: 10,
              GradeNumber: parseInt(userInfo.gradeId, 10)
            }
          }
        );
        
        if (response.data.code !== 0 || !response.data.data || !response.data.data.items || response.data.data.items.length === 0) {
          setError('Không tìm thấy chương trình giảng dạy cho khối lớp ' + userInfo.gradeId);
          setLoading(false);
          return;
        }

        const found = response.data.data.items[0];
        console.log('Found curriculumId:', found.curriculumId);
        
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
  }, [userInfo?.gradeId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <MainContainer>
        <StyledContainer maxWidth="lg">
          <LoadingContainer>
            <LoadingSpinner size={80} />
            <LoadingText>
              Đang tải yêu cầu cần đạt...
            </LoadingText>
          </LoadingContainer>
        </StyledContainer>
      </MainContainer>
    );
  }

  if (error) {
    return (
      <MainContainer>
        <StyledContainer maxWidth="lg">
          <StyledAlert severity="error">
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Lỗi:</Typography>
            <Typography>{error}</Typography>
          </StyledAlert>
        </StyledContainer>
      </MainContainer>
    );
  }

  if (!curriculum) {
    return null;
  }

  return (
    <MainContainer>
      <StyledContainer maxWidth="lg">
        <BackButton
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Quay lại
        </BackButton>

        <HeaderCard elevation={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <FloatingIcon>
              <EmojiEventsIcon />
            </FloatingIcon>
            <GradientTitle>
              {curriculum.name}
            </GradientTitle>
            <SubTitle>
              {curriculum.description}
            </SubTitle>
          </Box>

          <StatsContainer>
            <StatCard>
              <StatContent>
                <StatIcon>
                  <ScheduleIcon />
                </StatIcon>
                <Box>
                  <StatText>Tổng số tiết</StatText>
                  <Typography variant="h6" sx={{ 
                    color: theme.palette.mode === 'dark' ? '#21CBF3' : '#1976d2',
                    fontWeight: 700 
                  }}>
                    {curriculum.totalPeriods}
                  </Typography>
                </Box>
              </StatContent>
            </StatCard>
            
            <StatCard>
              <StatContent>
                <StatIcon>
                  <SchoolIcon />
                </StatIcon>
                <Box>
                  <StatText>Năm học</StatText>
                  <Typography variant="h6" sx={{ 
                    color: theme.palette.mode === 'dark' ? '#21CBF3' : '#1976d2',
                    fontWeight: 700 
                  }}>
                    {curriculum.year}
                  </Typography>
                </Box>
              </StatContent>
            </StatCard>
          </StatsContainer>
        </HeaderCard>

        {curriculum.curriculumDetails && curriculum.curriculumDetails.length > 0 && (
          <DetailsCard elevation={0}>
            <TableTitle>
              <TrendingUpIcon />
              Chi tiết chương trình và yêu cầu cần đạt
            </TableTitle>
            
            <ModernTableContainer>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell>Chủ đề</TableCell>
                    <TableCell>Mạch nội dung</TableCell>
                    <TableCell>Mạch kiến thức</TableCell>
                    <TableCell>Nội dung</TableCell>
                    <TableCell>Mục tiêu cần đạt</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {curriculum.curriculumDetails.map((detail, index) => (
                    <StyledTableRow key={detail.curriculumDetailId} index={index}>
                      <TableCell sx={{ fontWeight: 600 }}>
                        <Chip 
                          label={detail.curriculumTopic}
                          sx={{
                            background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                            color: '#fff',
                            fontWeight: 600,
                            maxWidth: '200px'
                          }}
                        />
                      </TableCell>
                      <TableCell>{detail.curriculumSection}</TableCell>
                      <TableCell>{detail.curriculumSubSection}</TableCell>
                      <TableCell>{detail.curriculumContent}</TableCell>
                      <TableCell sx={{ 
                        whiteSpace: 'pre-line',
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'
                          : 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.02) 100%)',
                        borderRadius: '8px',
                        padding: '12px',
                        fontWeight: 600,
                        color: theme.palette.mode === 'dark' ? '#81C784' : '#2E7D32',
                      }}>
                        {detail.curriculumGoal}
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </ModernTableContainer>
          </DetailsCard>
        )}
      </StyledContainer>
    </MainContainer>
  );
};

export default TeacherRequirements; 