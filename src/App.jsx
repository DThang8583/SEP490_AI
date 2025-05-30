import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './Components/Landing/Navbar';
import Footer from './Components/Landing/Footer';
import Home from './Components/Landing/Home';
import CreateLesson from './page/CreateLesson';
import Login from './page/Login';
import CreateLessonByChat from './page/CreateLessonByChat';
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
import EditProfile from './Components/SubjectSpecialistManager/EditProfile';
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
import { MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreateAI from './page/CreateAI';
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
        <Route path="/lesson-review" element={<LessonReview sidebarOpen={sidebarOpen} />} />
        <Route path="/content-approval" element={<ContentApproval sidebarOpen={sidebarOpen} />} />
        <Route path="/curriculum-analysis" element={<CurriculumAnalysis sidebarOpen={sidebarOpen} />} />
        <Route path="/curriculum-framework" element={<CurriculumFramework sidebarOpen={sidebarOpen} />} />
        <Route path="/curriculum" element={<CurriculumFramework sidebarOpen={sidebarOpen} />} />
        <Route path="/curriculum-detail/:id" element={<CurriculumDetail sidebarOpen={sidebarOpen} />} />
        <Route path="/lesson-export" element={<LessonExport sidebarOpen={sidebarOpen} />} />
        <Route path="/profile" element={<Profile sidebarOpen={sidebarOpen} />} />
        <Route path="/edit-profile" element={<EditProfile sidebarOpen={sidebarOpen} />} />
        <Route path="/change-password" element={<ChangePassword sidebarOpen={sidebarOpen} />} />
        <Route path="/forgot-password" element={<ForgotPassword sidebarOpen={sidebarOpen} />} />
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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = (value) => {
    const newState = value !== undefined ? value : !sidebarOpen;
    setSidebarOpen(newState);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/CreateLesson" element={<CreateLesson />} />
                <Route path="/register" element={<ChoiceSignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/CreateLessonByChat" element={<CreateLessonByChat />} />
                <Route path="/AIRender" element={<AIRender />} />
                <Route path="/ChoiceChatorClick" element={<ChoiceChatorClick />} />
                <Route path="/cac-bai-hoc" element={<LessonList />} />
                <Route path="/các-giáo-án" element={<PrivateRoute><AllLessons /></PrivateRoute>} />
                <Route path="/blog-lesson/:blogId" element={<PrivateRoute><BlogLessonDetail /></PrivateRoute>} />
                <Route path="/Đăng-Giáo-án" element={<PrivateRoute><LessonUpload /></PrivateRoute>} />
                <Route path="/rejected-lessons" element={<PrivateRoute><RejectedLessons /></PrivateRoute>} />
                <Route path="/pending-lessons" element={<PrivateRoute><PendingLessons /></PrivateRoute>} />
                <Route path="/approved-lessons" element={<PrivateRoute><ApprovedLessons /></PrivateRoute>} />
                <Route path="/draft-lessons" element={<PrivateRoute><DraftLessons /></PrivateRoute>} />
                <Route path="/Giáo-án-đang-chờ/:lessonId" element={<PrivateRoute><PendingLessonDetail /></PrivateRoute>} />
                <Route path="/Giáo-án-đã-chấp-nhận/:lessonId" element={<PrivateRoute><ApprovedLessonDetail /></PrivateRoute>} />
                <Route path="/Giáo-án-đã-từ-chối/:lessonId" element={<PrivateRoute><RejectedLessonDetail /></PrivateRoute>} />
                <Route path="/Giáo-án-nháp/:lessonId" element={<PrivateRoute><DraftLessonDetail /></PrivateRoute>} />
                <Route path="/bai-tap" element={<ExamList />} />
                <Route path="/bai-tap/:id" element={<ExamDetail />} />
                <Route path="/khung-chuong-trinh" element={<TeacherCurriculumm />} />
                <Route path="/command-management" element={<PrivateRoute><CommandManager /></PrivateRoute>} />
                <Route path="/create-ai" element={<CreateAI />} />
                <Route path="/yeu-cau-can-dat" element={<TeacherRequirements />} />
                <Route path="/manager/*" element={
                  <PrivateRoute>
                    <ManagerRoutes sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                  </PrivateRoute>
                } />
                <Route path="/teacher/profile" element={
                  <PrivateRoute>
                    <TeacherProfile />
                  </PrivateRoute>
                } />
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/teacher/profile" element={<PrivateRoute><TeacherProfile /></PrivateRoute>} />
                <Route path="/ChoiceChatorClick" element={<PrivateRoute><ChoiceChatorClick /></PrivateRoute>} />
                <Route path="/CreateLesson" element={<PrivateRoute><CreateLesson /></PrivateRoute>} />
                <Route path="/AIRender" element={<PrivateRoute><AIRender /></PrivateRoute>} />
                <Route path="/rejected-lessons" element={<PrivateRoute><RejectedLessons /></PrivateRoute>} />
                <Route path="/pending-lessons" element={<PrivateRoute><PendingLessons /></PrivateRoute>} />
                <Route path="/approved-lessons" element={<PrivateRoute><ApprovedLessons /></PrivateRoute>} />
                <Route path="/draft-lessons" element={<PrivateRoute><DraftLessons /></PrivateRoute>} />
                <Route path="/Giáo-án-đang-chờ/:lessonId" element={<PrivateRoute><PendingLessonDetail /></PrivateRoute>} />
                <Route path="/Giáo-án-đã-chấp-nhận/:lessonId" element={<PrivateRoute><ApprovedLessonDetail /></PrivateRoute>} />
                <Route path="/Giáo-án-đã-từ-chối/:lessonId" element={<PrivateRoute><RejectedLessonDetail /></PrivateRoute>} />
                <Route path="/Giáo-án-nháp/:lessonId" element={<PrivateRoute><DraftLessonDetail /></PrivateRoute>} />
                <Route path="/generated-quiz" element={<PrivateRoute><GeneratedQuiz /></PrivateRoute>} />
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
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
