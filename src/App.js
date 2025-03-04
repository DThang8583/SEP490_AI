import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar/>}>
          <Route path="/" element={<Home />} />
          <Route path="CreateLesson" element={<CreateLesson />} />
          <Route path="CreateLessonByChat" element={<CreateLessonBYChat />} />
          <Route path="AIRender" element={<AIRender/>} />
          <Route path="Choice" element={<ChoiceChatorClick />} />
          <Route path="Draft" element={<Draft />} />
          <Route path="Lesson" element={<Lesson />} />
          <Route path="Lesson/:id" element={<LessonDetail />} />
          <Route path="SubmitLesson" element={<SubmitLesson />} />
          <Route path="Signup" element={<ChoiceSignUp />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
