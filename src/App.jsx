import './App.css';
import React from 'react';
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

function App() {
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
                <Route path="/LessonDetail/:id" element={<LessonDetail/>} />
                <Route path="/AdminSignUp" element={<AdminSignUp />} />
                <Route path="/ChoiceChatorClick" element={<ChoiceChatorClick />} />
                <Route path="/signup-manager" element={<SignUpManager />} />
                <Route path="/signup-teacher" element={<SignUpTeacher />} />
                <Route path="/admin-signup" element={<AdminSignUp />} />
                <Route path="/toan-so" element={<LessonList />} />
                <Route path="/de-on-thi" element={<ExamList />} />
                <Route path="/de-on-thi/:id" element={<ExamDetail />} />
                <Route path="/support" element={<Support />} />
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
