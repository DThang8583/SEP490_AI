// import './App.css';
// import { React, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import CreateLesson from './page/CreateLesson';
// import Draft from './page/Draft';
// import SubmitLesson from './page/SubmitLesson';
// import Lesson from './page/Lesson';
// import Home from './page/Home';
// import Navbar from './Components/Navbar/Navbar';
// import Footer from './Components/Footer/Footer';
// import ChoiceChatorClick from './page/ChoiceChatorClick';
// import CreateLessonBYChat from './page/CreateLessonByChat';
// import AIRender from './page/AIRender';
// import LessonDetail from './Components/LessonList/LessonDetail';
// import Login from './page/Login';
// import ChoiceSignUp from './page/ChoiceSignUp';

// import Sidebar from './Components/SubjectSpecialistManager/Sidebar';
// import Dashboard from './Components/SubjectSpecialistManager/Dashboard';
// import LessonReview from './Components/SubjectSpecialistManager/LessonReview';
// import ContentApproval from './Components/SubjectSpecialistManager/ContentApproval';
// import CurriculumAnalysis from './Components/SubjectSpecialistManager/CurriculumAnalysis';
// import CurriculumFramework from './Components/SubjectSpecialistManager/CurriculumFramework';
// import LessonExport from './Components/SubjectSpecialistManager/LessonExport';
// import Profile from './Components/SubjectSpecialistManager/Profile';
// import ForgotPassword from './Components/SubjectSpecialistManager/ForgotPassword';
// import Notification from './Components/SubjectSpecialistManager/Notification';
// import { api } from './api';

// function App() {

//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const handleLoginSuccess = (email, password) => {
//     api.login(email, password).then((res) => {
//       if (res.success) {
//         setIsAuthenticated(true);
//       } else {
//         alert('Email hoặc mật khẩu không đúng');
//       }
//     });
//   };

//   const PrivateRoute = ({ children }) => {
//     return isAuthenticated ? children : <Navigate to="/login" />;
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navbar />}>
//           <Route path="/" element={<Home />} />
//           <Route path="CreateLesson" element={<CreateLesson />} />
//           <Route path="CreateLessonByChat" element={<CreateLessonBYChat />} />
//           <Route path="AIRender" element={<AIRender />} />
//           <Route path="Choice" element={<ChoiceChatorClick />} />
//           <Route path="Draft" element={<Draft />} />
//           <Route path="Lesson" element={<Lesson />} />
//           <Route path="Lesson/:id" element={<LessonDetail />} />
//           <Route path="SubmitLesson" element={<SubmitLesson />} />
//           <Route path="Signup" element={<ChoiceSignUp />} />
//           <Route path="login" element={<Login />} />
//         </Route>

//         <Route
//           path="/manager/*"
//           element={
//             <PrivateRoute>
//               <Sidebar />
//               <Routes>
//                 <Route path="/" element={<Dashboard />} />
//                 <Route path="/lesson-review" element={<LessonReview />} />
//                 <Route path="/content-approval" element={<ContentApproval />} />
//                 <Route path="/curriculum-analysis" element={<CurriculumAnalysis />} />
//                 <Route path="/curriculum-framework" element={<CurriculumFramework />} />
//                 <Route path="/lesson-export" element={<LessonExport />} />
//                 <Route path="/profile" element={<Profile />} />
//                 <Route path="/forgot-password" element={<ForgotPassword />} />
//                 <Route path="/notifications" element={<Notification />} />
//               </Routes>
//             </PrivateRoute>
//           }
//         />

//       </Routes>
//       <Footer />
//     </Router>
//   );
// }

// export default App;

// src/App.jsx
import './App.css';
import { React, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Icon 3 gạch ngang
import CreateLesson from './page/CreateLesson';
import Draft from './page/Draft';
import SubmitLesson from './page/SubmitLesson';
import Lesson from './page/Lesson';
import Home from './page/Home';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import ChoiceChatorClick from './page/ChoiceChatorClick';
import CreateLessonBYChat from './page/CreateLessonByChat';
import AIRender from './page/AIRender';
import LessonDetail from './Components/LessonList/LessonDetail';
import Login from './page/Login';
import ChoiceSignUp from './page/ChoiceSignUp';

import Sidebar from './Components/SubjectSpecialistManager/Sidebar';
import Dashboard from './Components/SubjectSpecialistManager/Dashboard';
import LessonReview from './Components/SubjectSpecialistManager/LessonReview';
import ContentApproval from './Components/SubjectSpecialistManager/ContentApproval';
import CurriculumAnalysis from './Components/SubjectSpecialistManager/CurriculumAnalysis';
import CurriculumFramework from './Components/SubjectSpecialistManager/CurriculumFramework';
import LessonExport from './Components/SubjectSpecialistManager/LessonExport';
import Profile from './Components/SubjectSpecialistManager/Profile';
import ForgotPassword from './Components/SubjectSpecialistManager/ForgotPassword';
import Notification from './Components/SubjectSpecialistManager/Notification';
import { api } from './api';

// Component bao bọc cho /manager/*
// src/App.jsx (phần ManagerRoutes)
const ManagerRoutes = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <>
      {!sidebarOpen && (
        <IconButton
          onClick={() => {
            console.log('Hamburger button clicked, current sidebarOpen:', sidebarOpen);
            toggleSidebar();
          }}
          sx={{
            position: 'fixed',
            top: 10,
            left: 10,
            zIndex: 1400,
            color: '#666',
            bgcolor: 'white',
            border: '1px solid red',
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
        <Route path="/forgot-password" element={<ForgotPassword sidebarOpen={sidebarOpen} />} />
        <Route path="/notifications" element={<Notification sidebarOpen={sidebarOpen} />} />
      </Routes>
    </>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Mặc định Sidebar mở

  const handleLoginSuccess = (email, password) => {
    return api.login(email, password).then((res) => {
      if (res.success) {
        setIsAuthenticated(true);
      } else {
        alert('Email hoặc mật khẩu không đúng');
      }
    });
  };

  const toggleSidebar = (value) => {
    const newState = value !== undefined ? value : !sidebarOpen;
    console.log('toggleSidebar called, new state:', newState); // Debug
    setSidebarOpen(newState); // Cập nhật trạng thái
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="/" element={<Home />} />
          <Route path="CreateLesson" element={<CreateLesson />} />
          <Route path="CreateLessonByChat" element={<CreateLessonBYChat />} />
          <Route path="AIRender" element={<AIRender />} />
          <Route path="Choice" element={<ChoiceChatorClick />} />
          <Route path="Draft" element={<Draft />} />
          <Route path="Lesson" element={<Lesson />} />
          <Route path="Lesson/:id" element={<LessonDetail />} />
          <Route path="SubmitLesson" element={<SubmitLesson />} />
          <Route path="Signup" element={<ChoiceSignUp />} />
          <Route path="login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        </Route>

        <Route
          path="/manager/*"
          element={
            <PrivateRoute>
              <ManagerRoutes sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;