import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './Components/Landing/Navbar';
import Footer from './Components/Landing/Footer';
import Home from './Components/Landing/Home';
import CreateLesson from '../src/page/CreateLesson';
import Login from './page/Login';
import CreateBlog from './page/CreateBlog';
import AIRender from './page/AIRender';
import ChoiceSignUp from './page/ChoiceSignUp';
import ChoiceChatorClick from './page/ChoiceChatorClick';
import LessonList from './Components/LessonList/LessonList';
import ExamPrep from './Components/ExamPrep/ExamPrep';
import ExamList from './Components/ExamPrep/ExamList';
import ExamDetail from './Components/ExamPrep/ExamDetail';
import Sidebar from './Components/SubjectSpecialistManager/Sidebar';
import Dashboard from './Components/SubjectSpecialistManager/Dashboard';
import LessonReview from './Components/SubjectSpecialistManager/Lesson/LessonReview';
import ContentApproval from './Components/SubjectSpecialistManager/Lesson/ContentApproval';
import CurriculumAnalysis from './Components/SubjectSpecialistManager/Curriculum/CurriculumAnalysis';
import CurriculumFramework from './Components/SubjectSpecialistManager/Curriculum/CurriculumFramework';
import CurriculumDetail from './Components/SubjectSpecialistManager/Curriculum/CurriculumDetail';
import LessonExport from './Components/SubjectSpecialistManager/Lesson/LessonExport';
import Profile from './Components/SubjectSpecialistManager/Profile';
import ChangePassword from './Components/SubjectSpecialistManager/ChangePassword';
import ForgotPassword from './page/ForgotPassword';
import TeacherProfile from './Components/Teacher/TeacherProfile';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PrivateRoute from './Components/PrivateRoute';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import TotalAccounts from './pages/Admin/Dashboard/TotalAccounts';
import TotalLessons from './pages/Admin/Dashboard/TotalLessons';
import TotalExams from './pages/Admin/Dashboard/TotalExams';
import Reports from './pages/Admin/Dashboard/Reports';
import RejectedLessons from './page/RejectedLessons';
import PendingLessons from './page/PendingLessons';
import ApprovedLessons from './page/ApprovedLessons';
import DraftLessons from './page/DraftLessons';
import AllLessons from './page/AllLessons';
import PendingLessonDetail from './page/PendingLessonDetail';
import ApprovedLessonDetail from './page/ApprovedLessonDetail';
import RejectedLessonDetail from './page/RejectedLessonDetail';
import DraftLessonDetail from './page/DraftLessonDetail';
import BlogLessonDetail from './page/BlogLessonDetail';
import LessonUpload from './page/LessonUpload';
import CreateAccount from './pages/Admin/Dashboard/CreateAccount';
import SlidePreview from './page/SlidePreview';
import GeneratedQuiz from './page/GeneratedQuiz';
import QuizDetail from './pages/Admin/Dashboard/QuizDetail';
import CommandManager from './page/CommandManager';
import { useNavigate, useLocation } from 'react-router-dom';

import TeacherCurriculumm from './page/TeacherCurriculumm';
import TeacherRequirements from './page/TeacherRequirements';

const ManagerRoutes = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <>
      {!sidebarOpen && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: 'fixed',
            top: 10,
            left: 10,
            zIndex: 1400,
            color: '#666',
            bgcolor: 'white',
            '&:hover': {
              bgcolor: '#e0e0e0',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Routes>
        <Route path="/dashboard" element={<Dashboard sidebarOpen={sidebarOpen} />} />
        <Route path="/xemxet" element={<LessonReview sidebarOpen={sidebarOpen} />} />
        <Route path="/pheduyet" element={<ContentApproval sidebarOpen={sidebarOpen} />} />
        <Route path="/phantichchuongtrinh" element={<CurriculumAnalysis sidebarOpen={sidebarOpen} />} />
        <Route path="/khungchuongtrinh" element={<CurriculumFramework sidebarOpen={sidebarOpen} />} />
        <Route path="/chuongtrinh" element={<CurriculumFramework sidebarOpen={sidebarOpen} />} />
        <Route path="/thongtinchuongtrinh/:id" element={<CurriculumDetail sidebarOpen={sidebarOpen} />} />
        <Route path="/xuatgiaoan" element={<LessonExport sidebarOpen={sidebarOpen} />} />
        <Route path="/trangcanhan" element={<Profile sidebarOpen={sidebarOpen} />} />
        <Route path="/doimatkhau" element={<ChangePassword sidebarOpen={sidebarOpen} />} />
        <Route path="/quenmatkhau" element={<ForgotPassword sidebarOpen={sidebarOpen} />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/quan-ly-tai-khoan"
          element={
            <PrivateRoute>
              <TotalAccounts />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/Quản lý giáo án"
          element={
            <PrivateRoute>
              <TotalLessons />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <PrivateRoute>
              <TotalExams />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/schools"
          element={
            <PrivateRoute>
              <TotalExams />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/create-account"
          element={
            <PrivateRoute>
              <CreateAccount />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/exams/:quizId"
          element={
            <PrivateRoute>
              <QuizDetail />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const isManagerRoute = location.pathname.startsWith('/quanly');
  const isAdminRoute = location.pathname.startsWith('/admin');

  const toggleSidebar = (value) => {
    const newState = value !== undefined ? value : !sidebarOpen;
    setSidebarOpen(newState);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isManagerRoute && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tao-giao-an" element={<CreateLesson />} />
          <Route path="/register" element={<ChoiceSignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/giao-an-da-tao" element={<AIRender />} />
          <Route path="/ChoiceChatorClick" element={<ChoiceChatorClick />} />
          <Route path="/cac-bai-hoc" element={<LessonList />} />
          <Route path="/danh-sach-bai-dang" element={<PrivateRoute><AllLessons /></PrivateRoute>} />
          <Route path="/chi-tiet-bai-dang/:blogId" element={<PrivateRoute><BlogLessonDetail /></PrivateRoute>} />
          <Route path="/Đăng-giáo-án" element={<PrivateRoute><LessonUpload /></PrivateRoute>} />
          <Route path="/giao-an-bi-tu-choi" element={<PrivateRoute><RejectedLessons /></PrivateRoute>} />
          <Route path="/giao-an-cho-duyet" element={<PrivateRoute><PendingLessons /></PrivateRoute>} />
          <Route path="/giao-an-da-duyet" element={<PrivateRoute><ApprovedLessons /></PrivateRoute>} />
          <Route path="/giao-an-nhap" element={<PrivateRoute><DraftLessons /></PrivateRoute>} />
          <Route path="/Giáo-án-đang-chờ/:lessonId" element={<PrivateRoute><PendingLessonDetail /></PrivateRoute>} />
          <Route path="/Giáo-án-đã-chấp-nhận/:lessonId" element={<PrivateRoute><ApprovedLessonDetail /></PrivateRoute>} />
          <Route path="/Giáo-án-đã-từ-chối/:lessonId" element={<PrivateRoute><RejectedLessonDetail /></PrivateRoute>} />
          <Route path="/Giáo-án-nháp/:lessonId" element={<PrivateRoute><DraftLessonDetail /></PrivateRoute>} />
          <Route path="/bai-tap" element={<ExamList />} />
          <Route path="/bai-tap/:id" element={<ExamDetail />} />
          <Route path="/khung-chuong-trinh" element={<TeacherCurriculumm />} />
          <Route path="/command-management" element={<PrivateRoute><CommandManager /></PrivateRoute>} />
          <Route path="/bai-tap-AI-tao" element={<PrivateRoute><GeneratedQuiz /></PrivateRoute>} />
          <Route path="/tao-bai-dang" element={<PrivateRoute><CreateBlog /></PrivateRoute>} />
          <Route path="/yeu-cau-can-dat" element={<TeacherRequirements />} />
          <Route path="/quanly/*" element={
            <PrivateRoute>
              <ManagerRoutes sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </PrivateRoute>
          } />
          <Route path="/ho-so" element={
            <PrivateRoute>
              <TeacherProfile />
            </PrivateRoute>
          } />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/slide-preview" element={<SlidePreview />} />
        </Routes>
      </main>
      {!isManagerRoute && !isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
