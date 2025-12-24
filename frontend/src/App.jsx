import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './utils/PrivateRoute';
import LoadingScreen from './pages/LoadingScreen';
import StarBackground from './components/StarBackground';
import ScrollToTopOnMount from './components/ScrollToTopOnMount';
// import BlogPage from './pages/BlogPage';
// import BlogPostPage from './pages/BlogPostPage';
import './styles/index.css';

const Home = React.lazy(() => import('./pages/Home'));
const ProjectsPage = React.lazy(() => import('./pages/ProjectsPage'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const ResumeBuilder = React.lazy(() => import('./pages/ResumeBuilder'));
const SkillsPage = React.lazy(() => import('./pages/SkillsPage'));
const AchievementsPage = React.lazy(() => import('./pages/AchievementsPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

function App() {
  // const [isLoading, setIsLoading] = useState(false); // Forced false for debugging
  const [isLoading, setIsLoading] = useState(() => {
    // Check if we've already shown the loading screen in this session
    return !sessionStorage.getItem('loadingComplete');
  });

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('loadingComplete', 'true');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <AuthProvider>
      <ThemeProvider>
        <StarBackground />
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <Router>
            <ScrollToTopOnMount />
            <React.Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/resume-builder" element={<ResumeBuilder />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/contact" element={<ContactPage />} />
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
            </React.Suspense>
          </Router>
        )}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;