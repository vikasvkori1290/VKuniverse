import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';
import ResumeBuilder from './pages/ResumeBuilder';
import SkillsPage from './pages/SkillsPage';
import AchievementsPage from './pages/AchievementsPage';
import ContactPage from './pages/ContactPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './utils/PrivateRoute';


import StarBackground from './components/StarBackground';
import ScrollToTopOnMount from './components/ScrollToTopOnMount';
// import BlogPage from './pages/BlogPage';
// import BlogPostPage from './pages/BlogPostPage';
import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <StarBackground />
        <Router>
          <ScrollToTopOnMount />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} /> {/* Added route */}
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* <Route path="/blog" element={<BlogPage />} /> */}
            {/* <Route path="/blog/:slug" element={<BlogPostPage />} /> */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;