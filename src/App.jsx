import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './Components/Landing/Navbar';
import Footer from './Components/Landing/Footer';
import Home from './Components/Landing/Home';
import CreateLesson from './page/CreateLesson';
import Login from './page/Login';
import PopularLesson from './Components/Landing/PopularLesson';
import CreateLessonBYChat from './page/CreateLessonByChat';
import AIRender from './page/AIRender';
import AdminSignUp from './page/AdminSignUp';
import ChoiceSignUp from './page/ChoiceSignUp';
import ChoiceChatorClick from './page/ChoiceChatorClick';
import SignUpTeacher from './page/SignUpTeacher';
import LessonList from './Components/LessonList/LessonList';
import LessonDetail from './Components/LessonList/LessonDetail';
import ExamPrep from './Components/ExamPrep/ExamPrep';
import ExamList from './Components/ExamPrep/ExamList';
import ExamDetail from './Components/ExamPrep/ExamDetail';
import Support from './Components/Support/Support';
import SignUpManager from './page/SignUpManager';
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
import ForgotPassword from './Components/SubjectSpecialistManager/ForgotPassword';
import Notification from './Components/SubjectSpecialistManager/Notification';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PrivateRoute from './Components/PrivateRoute';

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
        <Route path="/profile" element={<Profile sidebarOpen={sidebarOpen} />} />
        <Route path="/dashboard" element={<Dashboard sidebarOpen={sidebarOpen} />} />
        <Route path="/lesson-review" element={<LessonReview sidebarOpen={sidebarOpen} />} />
        <Route path="/content-approval" element={<ContentApproval sidebarOpen={sidebarOpen} />} />
        <Route path="/lesson-export" element={<LessonExport sidebarOpen={sidebarOpen} />} />
        <Route path="/curriculum-analysis" element={<CurriculumAnalysis sidebarOpen={sidebarOpen} />} />
        <Route path="/curriculum-framework" element={<CurriculumFramework sidebarOpen={sidebarOpen} />} />
        <Route path="/edit-profile" element={<EditProfile sidebarOpen={sidebarOpen} />} />
        <Route path="/change-password" element={<ChangePassword sidebarOpen={sidebarOpen} />} />
        <Route path="/forgot-password" element={<ForgotPassword sidebarOpen={sidebarOpen} />} />
        <Route path="/notifications" element={<Notification sidebarOpen={sidebarOpen} />} />
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
                <Route path="/CreateLessonByChat" element={<CreateLessonBYChat />} />
                <Route path="/AIRender" element={<AIRender />} />
                <Route path="/LessonDetail/:id" element={<LessonDetail />} />
                <Route path="/AdminSignUp" element={<AdminSignUp />} />
                <Route path="/ChoiceChatorClick" element={<ChoiceChatorClick />} />
                <Route path="/signup-manager" element={<SignUpManager />} />
                <Route path="/signup-teacher" element={<SignUpTeacher />} />
                <Route path="/admin-signup" element={<AdminSignUp />} />
                <Route path="/toan-so" element={<LessonList />} />
                <Route path="/de-on-thi" element={<ExamList />} />
                <Route path="/de-on-thi/:id" element={<ExamDetail />} />
                <Route path="/support" element={<Support />} />
                <Route path="/manager/*" element={
                  <PrivateRoute>
                    <ManagerRoutes sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                  </PrivateRoute>
                } />
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
