import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  CircularProgress,
  Alert,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  LinearProgress,
  Button,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Schedule as ScheduleIcon,
  MenuBook as MenuBookIcon,
  Subject as SubjectIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  AutoStories as AutoStoriesIcon,
  Class as ClassIcon,
  BookmarkBorder as BookmarkIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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

const TitleSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '32px',
  position: 'relative',
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
  fontSize: '2.5rem',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)'
    : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: '8px',
  letterSpacing: '0.5px',
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
  marginBottom: '16px',
  letterSpacing: '0.3px',
}));

const InfoCardsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '24px',
  marginBottom: '32px',
  padding: '24px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(156, 39, 176, 0.08) 100%)'
    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
  borderRadius: '20px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
}));

const InfoCard = styled(Card)(({ theme }) => ({
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

const InfoCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '20px',
  '&:last-child': {
    paddingBottom: '20px',
  },
}));

const InfoIcon = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    color: '#fff',
  },
}));

const InfoText = styled(Typography)(({ theme }) => ({
  fontFamily: 'sans-serif',
  fontSize: '0.95rem',
  fontWeight: 500,
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(25, 118, 210, 0.8)',
  textAlign: 'center',
  letterSpacing: '0.2px',
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
  marginBottom: '16px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

const ModernToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.15)'
    : '1px solid rgba(33, 150, 243, 0.2)',
  overflow: 'hidden',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  '& .MuiToggleButton-root': {
    border: 'none',
    padding: '12px 24px',
    fontWeight: 600,
    fontSize: '1rem',
    color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.1), transparent)',
      transition: 'left 0.6s ease',
    },
    '&:hover': {
      background: 'rgba(33, 150, 243, 0.1)',
      '&::before': {
        left: '100%',
      },
    },
    '&.Mui-selected': {
      background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
      '&:hover': {
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      },
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  color: '#fff',
  borderRadius: '16px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1rem',
  boxShadow: '0 8px 25px rgba(33, 150, 243, 0.4)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(33, 150, 243, 0.5)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
  animation: `${pulse} 3s ease-in-out infinite`,
}));

const ModernTableContainer = styled(TableContainer)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.2)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  animation: `${slideInUp} 0.8s ease-out`,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
    : 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  '& .MuiTableCell-root': {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.1rem',
    padding: '20px 16px',
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

const StyledTableRow = styled(TableRow)(({ theme, isExpanded }) => ({
  background: isExpanded
    ? theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(33, 150, 243, 0.08) 100%)'
      : 'linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(33, 150, 243, 0.04) 100%)'
    : 'transparent',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.12) 0%, rgba(33, 150, 243, 0.06) 100%)'
      : 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0.02) 100%)',
    transform: 'scale(1.01)',
    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.2)',
  },
  '& .MuiTableCell-root': {
    padding: '16px',
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(33, 150, 243, 0.1)'}`,
    color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
    fontSize: '1rem',
  },
}));

const ExpandButton = styled(IconButton)(({ theme, isExpanded }) => ({
  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  color: '#fff',
  width: 36,
  height: 36,
  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
  '&:hover': {
    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    transform: isExpanded ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)',
    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
  },
}));

const CollapsibleContent = styled(Box)(({ theme }) => ({
  margin: '16px',
  padding: '24px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.03) 0%, rgba(33, 150, 243, 0.01) 100%)',
  borderRadius: '16px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.1)',
  backdropFilter: 'blur(10px)',
  animation: `${fadeIn} 0.5s ease-out`,
}));

const LessonCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
  borderRadius: '12px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.1)',
  marginBottom: '12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateX(8px)',
    boxShadow: '0 8px 25px rgba(33, 150, 243, 0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: 'linear-gradient(180deg, #2196F3 0%, #21CBF3 100%)',
  },
}));

const LessonInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flex: 1,
}));

const LessonIcon = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: '#fff',
  },
}));

const LessonText = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}));

const LessonTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
  lineHeight: 1.3,
}));

const LessonSubtext = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(25, 118, 210, 0.7)',
  fontWeight: 500,
}));

const ViewButton = styled(IconButton)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
  color: '#fff',
  width: 40,
  height: 40,
  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #388E3C 0%, #66BB6A 100%)',
    transform: 'scale(1.1)',
    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
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

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
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
}));

const EmptyStateContainer = styled(Paper)(({ theme }) => ({
  padding: '48px 32px',
  textAlign: 'center',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.2)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  marginTop: '24px',
  animation: `${slideInUp} 0.8s ease-out`,
}));

const EmptyStateText = styled(Typography)(({ theme }) => ({
  fontFamily: 'sans-serif',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
  marginBottom: '16px',
}));

const ModernDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(30, 30, 46, 0.95) 0%, rgba(45, 45, 61, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
    backdropFilter: 'blur(20px)',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(33, 150, 243, 0.2)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
}));

const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '1.5rem',
  padding: '24px 32px',
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
}));

const DetailCard = styled(Paper)(({ theme }) => ({
  padding: '20px',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.03) 0%, rgba(33, 150, 243, 0.01) 100%)',
  borderRadius: '12px',
  border: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(33, 150, 243, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(33, 150, 243, 0.15)',
  },
}));

const DetailLabel = styled(Typography)(({ theme }) => ({
  fontFamily: 'sans-serif',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(25, 118, 210, 0.8)',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  fontFamily: 'sans-serif',
  fontSize: '1rem',
  fontWeight: 500,
  color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
  lineHeight: 1.5,
}));

const TeacherCurriculumm = () => {
  const { userInfo } = useAuth();
  console.log('userInfo:', userInfo);
  console.log('gradeId from userInfo:', userInfo?.gradeId);
  
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [lessons, setLessons] = useState({}); // Store lessons for each module
  const [lessonLoading, setLessonLoading] = useState({}); // Loading state for each module's lessons
  const [lessonError, setLessonError] = useState({}); // Error state for each module's lessons
  const [semester, setSemester] = useState('1');
  const [sortColumn, setSortColumn] = useState(null); // State for sorting column
  const [sortDir, setSortDir] = useState(null); // State for sorting direction (0: asc, 1: desc)
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonDetails, setLessonDetails] = useState({});
  const [loadingLessonDetails, setLoadingLessonDetails] = useState({});
  const [lessonDetailsError, setLessonDetailsError] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({}); // Track expanded lessons
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate(); // Get the navigate function

  const fetchLessons = async (moduleId) => {
    if (lessons[moduleId] || lessonLoading[moduleId]) return; // Don't fetch if already loaded or loading

    setLessonLoading(prev => ({ ...prev, [moduleId]: true }));
    setLessonError(prev => ({ ...prev, [moduleId]: null }));

    try {
      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules/${moduleId}/lessons`
      );

      if (response.data.code === 0 && response.data.data && response.data.data.lessons) {
        setLessons(prev => ({ ...prev, [moduleId]: response.data.data.lessons }));
      } else {
        setLessonError(prev => ({ ...prev, [moduleId]: 'Failed to fetch lessons' }));
      }
    } catch (err) {
      setLessonError(prev => ({ ...prev, [moduleId]: 'Error fetching lessons: ' + err.message }));
    } finally {
      setLessonLoading(prev => ({ ...prev, [moduleId]: false }));
    }
  };

  const toggleRow = (moduleId) => {
    setExpandedRows(prev => {
      const isExpanded = !prev[moduleId];
      if (isExpanded) {
        fetchLessons(moduleId);
      }
      return { ...prev, [moduleId]: isExpanded };
    });
  };

  const handleSemesterChange = (event, newSemester) => {
    if (newSemester !== null) {
      setSemester(newSemester);
    }
  };

  // Handle sort click
  const handleSortClick = (column) => {
    setSortColumn(prevColumn => {
      let newDir = null;
      if (prevColumn === column) {
        // Cycle through sort directions: asc -> desc -> no sort
        setSortDir(prevDir => {
          newDir = (prevDir === null) ? 0 : (prevDir === 0 ? 1 : null);
          // Save sort state to localStorage
          if (newDir !== null) {
            localStorage.setItem('teacherCurriculummSortColumn', column);
            localStorage.setItem('teacherCurriculummSortDir', newDir.toString());
          } else {
            localStorage.removeItem('teacherCurriculummSortColumn');
            localStorage.removeItem('teacherCurriculummSortDir');
          }
          return newDir;
        });
        return prevColumn; // Column remains the same for cycling direction
      } else {
        // New column, default to ascending sort (0)
        newDir = 0;
        // Save sort state to localStorage
        localStorage.setItem('teacherCurriculummSortColumn', column);
        localStorage.setItem('teacherCurriculummSortDir', newDir.toString());
        setSortDir(0);
        return column;
      }
    });
  };

  // Function for viewing requirements
  const handleViewRequirements = () => {
    navigate('/yeu-cau-can-dat', { state: { gradeId: userInfo?.gradeId } });
  };

  const handleViewLesson = async (lessonId, moduleId) => {
    const lessonKey = `${moduleId}-${lessonId}`;
    
    // Toggle expanded state
    setExpandedLessons(prev => {
      const isExpanded = !prev[lessonKey];
      
      if (isExpanded && !lessonDetails[lessonKey]) {
        // Fetch lesson details if not already loaded
        fetchLessonDetails(lessonId, moduleId);
      }
      
      return { ...prev, [lessonKey]: isExpanded };
    });
  };

  const fetchLessonDetails = async (lessonId, moduleId) => {
    const lessonKey = `${moduleId}-${lessonId}`;
    
    setLoadingLessonDetails(prev => ({ ...prev, [lessonKey]: true }));
    setLessonDetailsError(prev => ({ ...prev, [lessonKey]: null }));
    
    try {
      const response = await axios.get(
        `https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/lessons/${lessonId}`
      );
      
      if (response.data.code === 0 && response.data.data) {
        setLessonDetails(prev => ({ ...prev, [lessonKey]: response.data.data }));
      } else {
        setLessonDetailsError(prev => ({ ...prev, [lessonKey]: 'Failed to fetch lesson details' }));
      }
    } catch (err) {
      setLessonDetailsError(prev => ({ ...prev, [lessonKey]: 'Error fetching lesson details: ' + err.message }));
    } finally {
      setLoadingLessonDetails(prev => ({ ...prev, [lessonKey]: false }));
    }
  };

  const handleCloseLessonDetails = () => {
    setSelectedLesson(null);
    setLessonDetailsError(null);
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        if (!userInfo?.gradeId) {
          setError('Grade ID not found in user info');
          setLoading(false);
          return;
        }

        const params = {
          PageNumber: 1,
          PageSize: 999,
        };

        const response = await axios.get(
          'https://teacheraitools-cza4cbf8gha8ddgc.southeastasia-01.azurewebsites.net/api/v1/modules',
          { params }
        );

        if (response.data.code === 0) {
          console.log('API Response Data:', response.data.data.items);
          const filteredModules = response.data.data.items.filter(
            module => module.gradeNumber === parseInt(userInfo.gradeId, 10)
          );
          console.log('Modules filtered by gradeId:', filteredModules);
          setModules(filteredModules);
        } else {
          setError('Failed to fetch modules');
        }
      } catch (err) {
        setError('Error fetching modules: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [userInfo?.gradeId]);

  useEffect(() => {
    // Create a mutable copy for sorting
    const sortedModules = [...modules];

    // Apply client-side sorting
    if (sortColumn !== null && sortDir !== null) {
      sortedModules.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDir === 0 ? -1 : 1; // 0: asc, 1: desc
        if (aValue > bValue) return sortDir === 0 ? 1 : -1;
        return 0;
      });
    }

    // Apply filtering by semester on the sorted list
    const filtered = sortedModules.filter(module => module.semester === parseInt(semester));
    console.log('Modules filtered and sorted:', filtered);
    setFilteredModules(filtered);
  }, [semester, modules, sortColumn, sortDir]);

  // Load sort state from localStorage on component mount
  useEffect(() => {
    const savedColumn = localStorage.getItem('teacherCurriculummSortColumn');
    const savedDir = localStorage.getItem('teacherCurriculummSortDir');

    if (savedColumn !== null) {
      setSortColumn(savedColumn);
      setSortDir(parseInt(savedDir, 10));
    } else {
      // Set default sort to moduleId ascending if no saved state
      setSortColumn('moduleId');
      setSortDir(0);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return (
      <MainContainer>
        <StyledContainer maxWidth="xl">
          <LoadingContainer>
            <LoadingSpinner size={80} />
            <LoadingText>
              Đang tải chương trình giảng dạy...
            </LoadingText>
          </LoadingContainer>
        </StyledContainer>
      </MainContainer>
    );
  }

  if (error) {
    return (
      <MainContainer>
        <StyledContainer maxWidth="xl">
          <ErrorContainer>
            <StyledAlert severity="error">
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Lỗi:</Typography>
              <Typography>{error}</Typography>
            </StyledAlert>
          </ErrorContainer>
        </StyledContainer>
      </MainContainer>
    );
  }

  const commonInfo = modules[0] || {};

  return (
    <MainContainer>
      <StyledContainer maxWidth="xl">
        <HeaderCard elevation={0}>
          <TitleSection>
            <FloatingIcon>
              <AutoStoriesIcon />
            </FloatingIcon>
            <GradientTitle>
              Sách Giáo Khoa Toán Lớp {userInfo?.gradeId}
            </GradientTitle>
            <SubTitle>
              Chương trình giảng dạy hiện đại
            </SubTitle>
          </TitleSection>

          <InfoCardsContainer>
            <InfoCard>
              <InfoCardContent>
                <InfoIcon>
                  <ClassIcon />
                </InfoIcon>
                <Box>
                  <InfoText>Lớp {commonInfo.gradeNumber}</InfoText>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Cấp học
                  </Typography>
                </Box>
              </InfoCardContent>
            </InfoCard>
            
            <InfoCard>
              <InfoCardContent>
                <InfoIcon>
                  <MenuBookIcon />
                </InfoIcon>
                <Box>
                  <InfoText>{commonInfo.curriculum}</InfoText>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Chương trình
                  </Typography>
                </Box>
              </InfoCardContent>
            </InfoCard>
            
            <InfoCard>
              <InfoCardContent>
                <InfoIcon>
                  <BookIcon />
                </InfoIcon>
                <Box>
                  <InfoText>{commonInfo.book}</InfoText>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Sách giáo khoa
                  </Typography>
                </Box>
              </InfoCardContent>
            </InfoCard>
          </InfoCardsContainer>

          <Divider sx={{ mb: 3, opacity: 0.3 }} />

          <ControlsContainer>
            <ModernToggleGroup
              value={semester}
              exclusive
              onChange={handleSemesterChange}
              aria-label="semester selection"
            >
              <ToggleButton value="1" aria-label="semester 1">
                Học kỳ 1
              </ToggleButton>
              <ToggleButton value="2" aria-label="semester 2">
                Học kỳ 2
              </ToggleButton>
            </ModernToggleGroup>

            <ActionButton 
              startIcon={<AssignmentIcon />}
              onClick={handleViewRequirements}
            >
              Xem yêu cầu cần đạt
            </ActionButton>
          </ControlsContainer>
        </HeaderCard>

        <ModernTableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell sx={{ width: '60px' }} />
                <TableCell 
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleSortClick('moduleId')}
                >
                  <TableSortLabel
                    active={sortColumn === 'moduleId'}
                    direction={sortDir === 0 ? 'asc' : (sortDir === 1 ? 'desc' : undefined)}
                    sx={{
                      '& .MuiTableSortLabel-icon': {
                        color: '#fff !important',
                      },
                    }}
                  >
                    Chủ đề
                  </TableSortLabel>
                </TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Tổng số tiết</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredModules.map((module, index) => (
                <React.Fragment key={module.moduleId}>
                  <StyledTableRow 
                    onClick={() => toggleRow(module.moduleId)}
                    isExpanded={expandedRows[module.moduleId]}
                    sx={{
                      animation: `${slideInUp} ${0.8 + index * 0.1}s ease-out`,
                    }}
                  >
                    <TableCell>
                      <ExpandButton 
                        size="small" 
                        isExpanded={expandedRows[module.moduleId]}
                      >
                        <KeyboardArrowDownIcon />
                      </ExpandButton>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Chủ đề {module.moduleId}: {module.name}
                    </TableCell>
                    <TableCell>{module.desciption}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{module.totalPeriods}</TableCell>
                  </StyledTableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                      <Collapse in={expandedRows[module.moduleId]} timeout="auto" unmountOnExit>
                        <CollapsibleContent>
                          {lessonLoading[module.moduleId] ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                              <LinearProgress 
                                sx={{ 
                                  width: '100%', 
                                  borderRadius: '4px',
                                  '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                                  }
                                }} 
                              />
                            </Box>
                          ) : lessonError[module.moduleId] ? (
                            <StyledAlert severity="error">{lessonError[module.moduleId]}</StyledAlert>
                          ) : lessons[module.moduleId] && lessons[module.moduleId].length > 0 ? (
                            <Box sx={{ width: '100%' }}>
                              <Typography variant="h6" sx={{ 
                                fontWeight: 700, 
                                mb: 3,
                                color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                              }}>
                                <BookmarkIcon />
                                Danh sách bài học
                              </Typography>
                              {lessons[module.moduleId].map((lesson, lessonIndex) => {
                                const lessonKey = `${module.moduleId}-${lesson.lessonId}`;
                                const isExpanded = expandedLessons[lessonKey];
                                const details = lessonDetails[lessonKey];
                                const isLoadingDetails = loadingLessonDetails[lessonKey];
                                const detailsError = lessonDetailsError[lessonKey];
                                
                                return (
                                  <React.Fragment key={lesson.lessonId}>
                                    <LessonCard 
                                      sx={{
                                        animation: `${fadeIn} ${0.5 + lessonIndex * 0.1}s ease-out`,
                                        cursor: 'pointer',
                                      }}
                                      onClick={() => handleViewLesson(lesson.lessonId, module.moduleId)}
                                    >
                                      <LessonInfo>
                                        <LessonIcon>
                                          <SubjectIcon />
                                        </LessonIcon>
                                        <LessonText>
                                          <LessonTitle>
                                            {lesson.name}
                                          </LessonTitle>
                                          <LessonSubtext>
                                            Tổng số tiết: {lesson.totalPeriods}
                                          </LessonSubtext>
                                        </LessonText>
                                      </LessonInfo>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip 
                                          label={isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                                          size="small"
                                          sx={{
                                            background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                                            color: '#fff',
                                            fontWeight: 600,
                                          }}
                                        />
                                        <ExpandButton 
                                          size="small"
                                          isExpanded={isExpanded}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewLesson(lesson.lessonId, module.moduleId);
                                          }}
                                        >
                                          <KeyboardArrowDownIcon />
                                        </ExpandButton>
                                      </Box>
                                    </LessonCard>
                                    
                                    {/* Lesson Details Collapse */}
                                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                      <Box sx={{ 
                                        ml: 4, 
                                        mr: 2, 
                                        mb: 2, 
                                        p: 3, 
                                        background: theme.palette.mode === 'dark'
                                          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)'
                                          : 'linear-gradient(135deg, rgba(33, 150, 243, 0.02) 0%, rgba(33, 150, 243, 0.01) 100%)',
                                        borderRadius: '16px',
                                        border: theme.palette.mode === 'dark'
                                          ? '1px solid rgba(255, 255, 255, 0.05)'
                                          : '1px solid rgba(33, 150, 243, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        animation: `${fadeIn} 0.5s ease-out`,
                                      }}>
                                        {isLoadingDetails ? (
                                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                            <LoadingSpinner size={40} />
                                          </Box>
                                        ) : detailsError ? (
                                          <StyledAlert severity="error" sx={{ mt: 2 }}>
                                            {detailsError}
                                          </StyledAlert>
                                        ) : details ? (
                                          <Box>
                                            <Box sx={{ mb: 3 }}>
                                              <Typography variant="h5" sx={{ 
                                                fontWeight: 'bold', 
                                                color: theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
                                                mb: 1 
                                              }}>
                                                {details.name} 
                                              </Typography>
                                              <Typography variant="body1" sx={{ 
                                                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(25, 118, 210, 0.8)',
                                                mb: 2
                                              }}>
                                                {details.description}
                                              </Typography>
                                            </Box>

                                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                              <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                  <Chip
                                                    icon={<ScheduleIcon />}
                                                    label={`Số tiết: ${details.totalPeriods}`}
                                                    sx={{
                                                      background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                                                      color: '#fff',
                                                      fontWeight: 600,
                                                      '& .MuiChip-icon': { color: '#fff' }
                                                    }}
                                                  />
                                                  {details.lessonType && (
                                                    <Chip
                                                      icon={<MenuBookIcon />} 
                                                      label={`Loại: ${details.lessonType}`}
                                                      sx={{
                                                        background: 'linear-gradient(135deg, #9C27B0 0%, #E1BEE7 100%)',
                                                        color: '#fff',
                                                        fontWeight: 600,
                                                        '& .MuiChip-icon': { color: '#fff' }
                                                      }}
                                                    />
                                                  )}
                                                  {details.gradeNumber && (
                                                    <Chip
                                                      icon={<ClassIcon />} 
                                                      label={`Khối: ${details.gradeNumber}`}
                                                      sx={{
                                                        background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
                                                        color: '#fff',
                                                        fontWeight: 600,
                                                        '& .MuiChip-icon': { color: '#fff' }
                                                      }}
                                                    />
                                                  )}
                                                  {details.module && (
                                                    <Chip
                                                      icon={<BookIcon />} 
                                                      label={`Chủ đề: ${details.module}`}
                                                      sx={{
                                                        background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                                                        color: '#fff',
                                                        fontWeight: 600,
                                                        '& .MuiChip-icon': { color: '#fff' }
                                                      }}
                                                    />
                                                  )}
                                                </Box>
                                              </Grid>
                                            </Grid>

                                            {/* Năng lực đặc biệt */}
                                            {details.specialAbility && (
                                              <DetailCard sx={{ mt: 3, borderLeft: `4px solid #1976d2` }}>
                                                <Typography variant="h6" sx={{ 
                                                  color: '#1976d2',
                                                  mb: 2,
                                                  fontWeight: 600,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: 1
                                                }}>
                                                  🎯 Năng lực đặc biệt
                                                </Typography>
                                                <Typography variant="body2" sx={{ 
                                                  color: theme.palette.text.primary,
                                                  lineHeight: 1.6,
                                                  whiteSpace: 'pre-line'
                                                }}>
                                                  {details.specialAbility}
                                                </Typography>
                                              </DetailCard>
                                            )}

                                            {/* Năng lực chung */}
                                            {details.generalCapacity && (
                                              <DetailCard sx={{ mt: 3, borderLeft: `4px solid #9c27b0` }}>
                                                <Typography variant="h6" sx={{ 
                                                  color: '#9c27b0',
                                                  mb: 2,
                                                  fontWeight: 600,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: 1
                                                }}>
                                                  🧠 Năng lực chung
                                                </Typography>
                                                <Typography variant="body2" sx={{ 
                                                  color: theme.palette.text.primary,
                                                  lineHeight: 1.6,
                                                  whiteSpace: 'pre-line'
                                                }}>
                                                  {details.generalCapacity}
                                                </Typography>
                                              </DetailCard>
                                            )}

                                            {/* Phẩm chất */}
                                            {details.quality && (
                                              <DetailCard sx={{ mt: 3, borderLeft: `4px solid #2e7d32` }}>
                                                <Typography variant="h6" sx={{ 
                                                  color: '#2e7d32',
                                                  mb: 2,
                                                  fontWeight: 600,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: 1
                                                }}>
                                                  ⭐ Phẩm chất
                                                </Typography>
                                                <Typography variant="body2" sx={{ 
                                                  color: theme.palette.text.primary,
                                                  lineHeight: 1.6,
                                                  whiteSpace: 'pre-line'
                                                }}>
                                                  {details.quality}
                                                </Typography>
                                              </DetailCard>
                                            )}

                                            {/* Đồ dùng dạy học */}
                                            {details.schoolSupply && (
                                              <DetailCard sx={{ mt: 3, borderLeft: `4px solid #ed6c02` }}>
                                                <Typography variant="h6" sx={{ 
                                                  color: '#ed6c02',
                                                  mb: 2,
                                                  fontWeight: 600,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: 1
                                                }}>
                                                  📚 Đồ dùng dạy học
                                                </Typography>
                                                <Typography variant="body2" sx={{ 
                                                  color: theme.palette.text.primary,
                                                  lineHeight: 1.6
                                                }}>
                                                  {details.schoolSupply}
                                                </Typography>
                                              </DetailCard>
                                            )}

                                            {/* Các hoạt động dạy học */}
                                            {(details.startUp || details.knowLedge || details.practice || details.apply) && (
                                              <>
                                                <Typography variant="h6" sx={{ 
                                                  color: theme.palette.text.primary,
                                                  mt: 4,
                                                  mb: 2,
                                                  fontWeight: 600
                                                }}>
                                                  📋 Các hoạt động dạy học
                                                </Typography>

                                                {/* Khởi động */}
                                                {details.startUp && (
                                                  <DetailCard sx={{ mt: 2, border: `1px solid ${theme.palette.divider}` }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                      <Typography variant="h6" sx={{ 
                                                        color: '#2196F3',
                                                        fontWeight: 600,
                                                        mr: 2
                                                      }}>
                                                        🚀 Hoạt động Khởi động
                                                      </Typography>
                                                      <Chip 
                                                        label={`${details.startUp.duration} phút`}
                                                        size="small"
                                                        sx={{ 
                                                          bgcolor: 'rgba(33, 150, 243, 0.1)', 
                                                          color: '#2196F3',
                                                          fontWeight: 600
                                                        }}
                                                      />
                                                    </Box>
                                                    
                                                    <DetailLabel>Mục tiêu:</DetailLabel>
                                                    <DetailValue sx={{ mb: 2 }}>
                                                      {details.startUp.goal}
                                                    </DetailValue>

                                                    <Grid container spacing={2}>
                                                      <Grid item xs={12} md={6}>
                                                        <DetailLabel>Hoạt động của giáo viên:</DetailLabel>
                                                        <DetailValue sx={{ whiteSpace: 'pre-line' }}>
                                                          {details.startUp.teacherActivities}
                                                        </DetailValue>
                                                      </Grid>
                                                      <Grid item xs={12} md={6}>
                                                        <DetailLabel>Hoạt động của học sinh:</DetailLabel>
                                                        <DetailValue sx={{ whiteSpace: 'pre-line' }}>
                                                          {details.startUp.studentActivities}
                                                        </DetailValue>
                                                      </Grid>
                                                    </Grid>
                                                  </DetailCard>
                                                )}

                                                {/* Hình thành kiến thức */}
                                                {details.knowLedge && (
                                                  <DetailCard sx={{ mt: 2, border: `1px solid ${theme.palette.divider}` }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                      <Typography variant="h6" sx={{ 
                                                        color: '#1976d2',
                                                        fontWeight: 600,
                                                        mr: 2
                                                      }}>
                                                        📚 Hoạt động Hình thành kiến thức
                                                      </Typography>
                                                      <Chip 
                                                        label={`${details.knowLedge.duration} phút`}
                                                        size="small"
                                                        sx={{ 
                                                          bgcolor: 'rgba(25, 118, 210, 0.1)', 
                                                          color: '#1976d2',
                                                          fontWeight: 600
                                                        }}
                                                      />
                                                    </Box>
                                                    
                                                    <DetailLabel>Mục tiêu:</DetailLabel>
                                                    <DetailValue sx={{ mb: 2 }}>
                                                      {details.knowLedge.goal}
                                                    </DetailValue>

                                                    <Grid container spacing={2}>
                                                      <Grid item xs={12} md={6}>
                                                        <DetailLabel>Hoạt động của giáo viên:</DetailLabel>
                                                        <DetailValue sx={{ whiteSpace: 'pre-line' }}>
                                                          {details.knowLedge.teacherActivities}
                                                        </DetailValue>
                                                      </Grid>
                                                      <Grid item xs={12} md={6}>
                                                        <DetailLabel>Hoạt động của học sinh:</DetailLabel>
                                                        <DetailValue sx={{ whiteSpace: 'pre-line' }}>
                                                          {details.knowLedge.studentActivities}
                                                        </DetailValue>
                                                      </Grid>
                                                    </Grid>
                                                  </DetailCard>
                                                )}

                                                {/* Luyện tập */}
                                                {details.practice && (
                                                  <DetailCard sx={{ mt: 2, border: `1px solid ${theme.palette.divider}` }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                      <Typography variant="h6" sx={{ 
                                                        color: '#9c27b0',
                                                        fontWeight: 600,
                                                        mr: 2
                                                      }}>
                                                        💪 Hoạt động Luyện tập
                                                      </Typography>
                                                      <Chip 
                                                        label={`${details.practice.duration} phút`}
                                                        size="small"
                                                        sx={{ 
                                                          bgcolor: 'rgba(156, 39, 176, 0.1)', 
                                                          color: '#9c27b0',
                                                          fontWeight: 600
                                                        }}
                                                      />
                                                    </Box>
                                                    
                                                    <DetailLabel>Mục tiêu:</DetailLabel>
                                                    <DetailValue sx={{ mb: 2 }}>
                                                      {details.practice.goal}
                                                    </DetailValue>

                                                    <Grid container spacing={2}>
                                                      <Grid item xs={12} md={6}>
                                                        <DetailLabel>Hoạt động của giáo viên:</DetailLabel>
                                                        <DetailValue sx={{ whiteSpace: 'pre-line' }}>
                                                          {details.practice.teacherActivities}
                                                        </DetailValue>
                                                      </Grid>
                                                      <Grid item xs={12} md={6}>
                                                        <DetailLabel>Hoạt động của học sinh:</DetailLabel>
                                                        <DetailValue sx={{ whiteSpace: 'pre-line' }}>
                                                          {details.practice.studentActivities}
                                                        </DetailValue>
                                                      </Grid>
                                                    </Grid>
                                                  </DetailCard>
                                                )}

                                                {/* Vận dụng */}
                                                {details.apply && (
                                                  <DetailCard sx={{ mt: 2, border: `1px solid ${theme.palette.divider}` }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                      <Typography variant="h6" sx={{ 
                                                        color: '#2e7d32',
                                                        fontWeight: 600,
                                                        mr: 2
                                                      }}>
                                                        🎯 Hoạt động Vận dụng
                                                      </Typography>
                                                      <Chip 
                                                        label={`${details.apply.duration} phút`}
                                                        size="small"
                                                        sx={{ 
                                                          bgcolor: 'rgba(46, 125, 50, 0.1)', 
                                                          color: '#2e7d32',
                                                          fontWeight: 600
                                                        }}
                                                      />
                                                    </Box>
                                                    
                                                    <DetailLabel>Mục tiêu:</DetailLabel>
                                                    <DetailValue sx={{ mb: 2 }}>
                                                      {details.apply.goal}
                                                    </DetailValue>

                                                    <Grid container spacing={2}>
                                                      <Grid item xs={12} md={6}>
                                                        <DetailLabel>Hoạt động của giáo viên:</DetailLabel>
                                                        <DetailValue sx={{ whiteSpace: 'pre-line' }}>
                                                          {details.apply.teacherActivities}
                                                        </DetailValue>
                                                      </Grid>
                                                      <Grid item xs={12} md={6}>
                                                        <DetailLabel>Hoạt động của học sinh:</DetailLabel>
                                                        <DetailValue sx={{ whiteSpace: 'pre-line' }}>
                                                          {details.apply.studentActivities}
                                                        </DetailValue>
                                                      </Grid>
                                                    </Grid>
                                                  </DetailCard>
                                                )}
                                              </>
                                            )}
                                          </Box>
                                        ) : (
                                          <Typography variant="body2" sx={{ 
                                            color: theme.palette.text.secondary,
                                            textAlign: 'center',
                                            fontStyle: 'italic',
                                            py: 2,
                                          }}>
                                            Không có thông tin chi tiết cho bài học này.
                                          </Typography>
                                        )}
                                      </Box>
                                    </Collapse>
                                  </React.Fragment>
                                );
                              })}
                            </Box>
                          ) : (
                            <Typography variant="body1" sx={{ 
                              color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(25, 118, 210, 0.7)',
                              textAlign: 'center',
                              fontStyle: 'italic',
                              py: 2,
                            }}>
                              Không có bài học nào cho chủ đề này.
                            </Typography>
                          )}
                        </CollapsibleContent>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </ModernTableContainer>

        {filteredModules.length === 0 && (
          <EmptyStateContainer elevation={0}>
            <FloatingIcon sx={{ mb: 2 }}>
              <SearchIcon />
            </FloatingIcon>
            <EmptyStateText>
              Không tìm thấy chủ đề nào cho học kỳ {semester}
            </EmptyStateText>
            <Typography variant="body1" sx={{ 
              color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(25, 118, 210, 0.7)',
              fontStyle: 'italic'
            }}>
              Vui lòng thử chọn học kỳ khác hoặc kiểm tra lại dữ liệu.
            </Typography>
          </EmptyStateContainer>
        )}

        <ModernDialog 
          open={selectedLesson !== null} 
          onClose={handleCloseLessonDetails}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitleStyled>
            Chi tiết bài học
          </DialogTitleStyled>
          <DialogContent sx={{ p: 4 }}>
            {loadingLessonDetails ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <LoadingSpinner size={60} />
              </Box>
            ) : lessonDetailsError ? (
              <StyledAlert severity="error" sx={{ mt: 2 }}>
                {lessonDetailsError}
              </StyledAlert>
            ) : lessonDetails ? (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <GradientTitle variant="h5" sx={{ 
                    textAlign: 'left',
                    fontSize: '1.5rem',
                    mb: 3,
                  }}>
                    {lessonDetails.name}
                  </GradientTitle>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailCard>
                    <DetailLabel>Mô tả bài học</DetailLabel>
                    <DetailValue>{lessonDetails.description}</DetailValue>
                  </DetailCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailCard>
                    <DetailLabel>Loại bài học</DetailLabel>
                    <DetailValue>{lessonDetails.lessonType}</DetailValue>
                  </DetailCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailCard>
                    <DetailLabel>Tổng số tiết</DetailLabel>
                    <DetailValue>{lessonDetails.totalPeriods} tiết</DetailValue>
                  </DetailCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailCard>
                    <DetailLabel>Chủ đề</DetailLabel>
                    <DetailValue>{lessonDetails.module}</DetailValue>
                  </DetailCard>
                </Grid>
                <Grid item xs={12}>
                  <DetailCard>
                    <DetailLabel>Ghi chú bổ sung</DetailLabel>
                    <DetailValue>
                      {lessonDetails.note || 'Không có ghi chú bổ sung'}
                    </DetailValue>
                  </DetailCard>
                </Grid>
              </Grid>
            ) : null}
          </DialogContent>
          <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
            <ActionButton 
              onClick={handleCloseLessonDetails}
              sx={{ minWidth: 120 }}
            >
              Đóng
            </ActionButton>
          </DialogActions>
        </ModernDialog>
      </StyledContainer>
    </MainContainer>
  );
};

export default TeacherCurriculumm;
