import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import styles from '../styles/pages/AdminDashboard.module.css';

const AdminDashboard = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [message, setMessage] = useState('');

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
    link: '',
    github: ''
  });
  const [skillForm, setSkillForm] = useState({
    name: '',
    icon: '',
    level: 'Beginner',
    percentage: ''
  });
  const [achievementForm, setAchievementForm] = useState({
    title: '',
    date: '',
    description: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard');
    }
  }, [admin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleImageUpload = async (e, setForm) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(prev => ({ ...prev, image: data }));
      setMessage('Image uploaded successfully!');
    } catch (error) {
      console.error(error);
      setMessage('Image upload failed');
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', {
        ...projectForm,
        techStack: projectForm.tags.split(',').map(tag => tag.trim()),
        images: projectForm.image ? [projectForm.image] : []
      });
      setMessage('Project added successfully!');
      setProjectForm({ title: '', description: '', image: '', tags: '', link: '', github: '' });
    } catch (error) {
      setMessage('Failed to add project');
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/skills', {
        ...skillForm,
        category: 'General',
        proficiency: Number(skillForm.percentage)
      });
      setMessage('Skill added successfully!');
      setSkillForm({ name: '', icon: '', level: 'Beginner', percentage: '' });
    } catch (error) {
      setMessage('Failed to add skill');
    }
  };

  const handleAchievementSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/achievements', achievementForm);
      setMessage('Achievement added successfully!');
      setAchievementForm({ title: '', date: '', description: '' });
    } catch (error) {
      setMessage('Failed to add achievement');
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <h1>Admin Dashboard</h1>
            <div className={styles.userInfo}>
              <span>Welcome, {admin?.username}</span>
              <button onClick={handleLogout} className="btn btn-sm btn-secondary">Logout</button>
            </div>
          </div>
        </div>
      </header>
      <main className="container">
        <div className={styles.content}>
          {message && <div className={styles.message}>{message}</div>}
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${activeTab === 'projects' ? styles.active : ''}`} onClick={() => setActiveTab('projects')}>Projects</button>
            <button className={`${styles.tab} ${activeTab === 'skills' ? styles.active : ''}`} onClick={() => setActiveTab('skills')}>Skills</button>
            <button className={`${styles.tab} ${activeTab === 'achievements' ? styles.active : ''}`} onClick={() => setActiveTab('achievements')}>Achievements</button>
          </div>
          <div className={styles.tabContent}>
            {activeTab === 'projects' && (
              <div className={styles.section}>
                <h2>Add New Project</h2>
                <form className={styles.form} onSubmit={handleProjectSubmit}>
                  <div className={styles.formGroup}>
                    <label>Title</label>
                    <input type="text" className={styles.input} placeholder="Project Title" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea className={styles.textarea} placeholder="Project Description" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Project Image</label>
                    <input type="file" className={styles.input} onChange={e => handleImageUpload(e, setProjectForm)} />
                    {projectForm.image && <p className={styles.successText}>Image uploaded: {projectForm.image}</p>}
                  </div>
                  <div className={styles.formGroup}>
                    <label>Tags (comma separated)</label>
                    <input type="text" className={styles.input} placeholder="React, Node.js, MongoDB" value={projectForm.tags} onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Live Link</label>
                    <input type="text" className={styles.input} placeholder="https://example.com" value={projectForm.link} onChange={e => setProjectForm({ ...projectForm, link: e.target.value })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>GitHub Link</label>
                    <input type="text" className={styles.input} placeholder="https://github.com/user/repo" value={projectForm.github} onChange={e => setProjectForm({ ...projectForm, github: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-primary">Add Project</button>
                </form>
              </div>
            )}
            {activeTab === 'skills' && (
              <div className={styles.section}>
                <h2>Add New Skill</h2>
                <form className={styles.form} onSubmit={handleSkillSubmit}>
                  <div className={styles.formGroup}>
                    <label>Skill Name</label>
                    <input type="text" className={styles.input} placeholder="e.g. React" value={skillForm.name} onChange={e => setSkillForm({ ...skillForm, name: e.target.value })} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Icon Class (e.g. FaReact)</label>
                    <input type="text" className={styles.input} placeholder="FaReact" value={skillForm.icon} onChange={e => setSkillForm({ ...skillForm, icon: e.target.value })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Level</label>
                    <select className={styles.input} value={skillForm.level} onChange={e => setSkillForm({ ...skillForm, level: e.target.value })}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Proficiency (%)</label>
                    <input type="number" className={styles.input} placeholder="85" min="0" max="100" value={skillForm.percentage} onChange={e => setSkillForm({ ...skillForm, percentage: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-primary">Add Skill</button>
                </form>
              </div>
            )}
            {activeTab === 'achievements' && (
              <div className={styles.section}>
                <h2>Add New Achievement</h2>
                <form className={styles.form} onSubmit={handleAchievementSubmit}>
                  <div className={styles.formGroup}>
                    <label>Title</label>
                    <input type="text" className={styles.input} placeholder="Achievement Title" value={achievementForm.title} onChange={e => setAchievementForm({ ...achievementForm, title: e.target.value })} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Date</label>
                    <input type="text" className={styles.input} placeholder="e.g. Jan 2023" value={achievementForm.date} onChange={e => setAchievementForm({ ...achievementForm, date: e.target.value })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea className={styles.textarea} placeholder="Details about the achievement" value={achievementForm.description} onChange={e => setAchievementForm({ ...achievementForm, description: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn btn-primary">Add Achievement</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
