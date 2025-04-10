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
import PopularLesson from './Components/Landing/PopularLesson';
import CreateLessonByChat from './page/CreateLessonByChat';
import AIRender from './page/AIRender';
import ChoiceSignUp from './page/ChoiceSignUp';
import ChoiceChatorClick from './page/ChoiceChatorClick';
import LessonList from './Components/LessonList/LessonList';
import ExamPrep from './Components/ExamPrep/ExamPrep';
import ExamList from './Components/ExamPrep/ExamList';
import ExamDetail from './Components/ExamPrep/ExamDetail';
import Support from './Components/Support/Support';
import Sidebar from './Components/SubjectSpecialistManager/Sidebar';
import Dashboard from './Components/SubjectSpecialistManager/Dashboard';
import LessonReview from './Components/SubjectSpecialistManager/LessonReview';
import ContentApproval from './Components/SubjectSpecialistManager/ContentApproval';
import CurriculumAnalysis from './Components/SubjectSpecialistManager/CurriculumAnalysis';
import CurriculumFramework from './Components/SubjectSpecialistManager/CurriculumFramework';
import LessonExport from './Components/SubjectSpecialistManager/LessonExport';
import Profile from './Components/SubjectSpecialistManager/Profile';
import EditProfile from './Components/SubjectSpecialistManager/EditProfile';
import ChangePassword from './Components/SubjectSpecialistManager/ChangePassword';
import ForgotPassword from './page/ForgotPassword';
import Notification from './Components/SubjectSpecialistManager/Notification';
import TeacherProfile from './Components/Teacher/Profile';
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
import LessonUpload from './page/LessonUpload';
import CreateAccount from './pages/Admin/Dashboard/CreateAccount';
import VerifyOTP from './page/VerifyOTP';
const ManagerRoutes = ({ sidebarOpen, toggleSidebar }) => {
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
        <Route path="/lesson-export" element={<LessonExport sidebarOpen={sidebarOpen} />} />
        <Route path="/profile" element={<Profile sidebarOpen={sidebarOpen} />} />
        <Route path="/edit-profile" element={<EditProfile sidebarOpen={sidebarOpen} />} />
        <Route path="/change-password" element={<ChangePassword sidebarOpen={sidebarOpen} />} />
        <Route path="/forgot-password" element={<ForgotPassword sidebarOpen={sidebarOpen} />} />
        <Route path="/notifications" element={<Notification sidebarOpen={sidebarOpen} />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/accounts"
          element={
            <PrivateRoute>
              <TotalAccounts />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/lessons"
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
                <Route path="/popular-lessons" element={<PopularLesson />} />
                <Route path="/CreateLessonByChat" element={<CreateLessonByChat />} />
                <Route path="/AIRender" element={<AIRender />} />
                <Route path="/ChoiceChatorClick" element={<ChoiceChatorClick />} />
                <Route path="/cac-bai-hoc" element={<LessonList />}/>
                <Route path="/các-bài-giảng" element={<PrivateRoute><AllLessons /></PrivateRoute>} />
                <Route path="/Đăng-bài-giảng" element={<PrivateRoute><LessonUpload /></PrivateRoute>} />
                <Route path="/rejected-lessons" element={<PrivateRoute><RejectedLessons /></PrivateRoute>} />
                <Route path="/pending-lessons" element={<PrivateRoute><PendingLessons /></PrivateRoute>} />
                <Route path="/approved-lessons" element={<PrivateRoute><ApprovedLessons /></PrivateRoute>} />
                <Route path="/draft-lessons" element={<PrivateRoute><DraftLessons /></PrivateRoute>} />
                <Route path="/Bài-giảng-đang-chờ/:lessonId" element={<PrivateRoute><PendingLessonDetail/></PrivateRoute>} />
                <Route path="/Bài-giảng-đã-chấp-nhận/:lessonId" element={<PrivateRoute><ApprovedLessonDetail/></PrivateRoute>} />
                <Route path="/Bài-giảng-đã-từ-chối/:lessonId" element={<PrivateRoute><RejectedLessonDetail/></PrivateRoute>} />
                <Route path="/Bài-giảng-nháp/:lessonId" element={<PrivateRoute><DraftLessonDetail/></PrivateRoute>} />
                <Route path="/de-on" element={<ExamList />} />
                <Route path="/de-on-thi/:id" element={<ExamDetail />} />
                <Route path="/support" element={<Support />} />
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
                <Route path="/Bài-giảng-đang-chờ/:lessonId" element={<PrivateRoute><PendingLessonDetail/></PrivateRoute>} />
                <Route path="/Bài-giảng-đã-chấp-nhận/:lessonId" element={<PrivateRoute><ApprovedLessonDetail/></PrivateRoute>} />
                <Route path="/Bài-giảng-đã-từ-chối/:lessonId" element={<PrivateRoute><RejectedLessonDetail/></PrivateRoute>} />
                <Route path="/Bài-giảng-nháp/:lessonId" element={<PrivateRoute><DraftLessonDetail/></PrivateRoute>} />
                <Route
                  path="/admin/*"
                  element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
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
