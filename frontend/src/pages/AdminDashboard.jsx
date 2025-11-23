import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import styles from '../styles/pages/AdminDashboard.module.css';
import ImageUploader from '../components/admin/ImageUploader';
import SkillIconPicker from '../components/admin/SkillIconPicker';
import RecentlyUploaded from '../components/admin/RecentlyUploaded';
import Messages from '../components/admin/Messages';

const AdminDashboard = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [message, setMessage] = useState('');

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    images: [], // Array of { url, isThumbnail, order }
    tags: '',
    link: '',
    github: '',
    status: 'completed'
  });

  const [skillForm, setSkillForm] = useState({
    name: '',
    icon: '', // This will store the URL or class
    iconSource: 'none',
    category: 'Frontend',
    proficiency: ''
  });

  const [achievementForm, setAchievementForm] = useState({
    title: '',
    date: '',
    description: '',
    category: 'Certification',
    images: [],
    collageLayout: 'grid'
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
    }
  }, [admin, navigate]);

  const handleLogout = () => {
    navigate('/');
    // Use setTimeout to allow navigation to start before logout clears state
    setTimeout(() => {
      logout();
    }, 0);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', {
        ...projectForm,
        techStack: projectForm.tags.split(',').map(tag => tag.trim()),
        // Backend expects images array with { url, isThumbnail, order }
        images: projectForm.images
      });
      setMessage('Project added successfully!');
      setProjectForm({
        title: '',
        description: '',
        images: [],
        tags: '',
        link: '',
        github: '',
        status: 'completed'
      });
    } catch (error) {
      console.error(error);
      setMessage('Failed to add project');
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/skills', {
        name: skillForm.name,
        category: skillForm.category,
        proficiency: Number(skillForm.proficiency),
        icon: skillForm.icon, // This field is used for custom/legacy
        iconUrl: skillForm.icon, // We use the same for now or separate if backend distinguishes
        iconSource: skillForm.iconSource
      });
      setMessage('Skill added successfully!');
      setSkillForm({
        name: '',
        icon: '',
        iconSource: 'none',
        category: 'Frontend',
        proficiency: ''
      });
    } catch (error) {
      console.error(error);
      setMessage('Failed to add skill');
    }
  };

  const handleAchievementSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/achievements', {
        ...achievementForm,
        // Backend expects images array
        images: achievementForm.images
      });
      setMessage('Achievement added successfully!');
      setAchievementForm({
        title: '',
        date: '',
        description: '',
        category: 'Certification',
        images: [],
        collageLayout: 'grid'
      });
    } catch (error) {
      console.error(error);
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
            <button className={`${styles.tab} ${activeTab === 'messages' ? styles.active : ''}`} onClick={() => setActiveTab('messages')}>Messages</button>
            <button className={`${styles.tab} ${activeTab === 'recent' ? styles.active : ''}`} onClick={() => setActiveTab('recent')}>History</button>
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
                    <label>Project Images (Drag & Drop, Star to set thumbnail)</label>
                    <ImageUploader
                      images={projectForm.images}
                      onImagesChange={imgs => setProjectForm({ ...projectForm, images: imgs })}
                      maxFiles={10}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea className={styles.textarea} placeholder="Project Description" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} required />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label>Status</label>
                      <select className={styles.input} value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value })}>
                        <option value="completed">Completed</option>
                        <option value="in-progress">In Progress</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Tags (comma separated)</label>
                      <input type="text" className={styles.input} placeholder="React, Node.js, MongoDB" value={projectForm.tags} onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })} />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label>Live Link</label>
                      <input type="text" className={styles.input} placeholder="https://example.com" value={projectForm.link} onChange={e => setProjectForm({ ...projectForm, link: e.target.value })} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>GitHub Link</label>
                      <input type="text" className={styles.input} placeholder="https://github.com/user/repo" value={projectForm.github} onChange={e => setProjectForm({ ...projectForm, github: e.target.value })} />
                    </div>
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
                    <label>Skill Icon</label>
                    <SkillIconPicker
                      value={skillForm.icon}
                      onChange={url => setSkillForm({ ...skillForm, icon: url })}
                      onSourceChange={source => setSkillForm({ ...skillForm, iconSource: source })}
                    />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label>Category</label>
                      <select className={styles.input} value={skillForm.category} onChange={e => setSkillForm({ ...skillForm, category: e.target.value })}>
                        <option>Frontend</option>
                        <option>Backend</option>
                        <option>Database</option>
                        <option>Tools</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Proficiency (%)</label>
                      <input type="number" className={styles.input} placeholder="85" min="0" max="100" value={skillForm.proficiency} onChange={e => setSkillForm({ ...skillForm, proficiency: e.target.value })} />
                    </div>
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
                    <label>Achievement Images (Collage)</label>
                    <ImageUploader
                      images={achievementForm.images}
                      onImagesChange={imgs => setAchievementForm({ ...achievementForm, images: imgs })}
                      maxFiles={6}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Collage Layout</label>
                    <select className={styles.input} value={achievementForm.collageLayout} onChange={e => setAchievementForm({ ...achievementForm, collageLayout: e.target.value })}>
                      <option value="grid">Grid (Standard)</option>
                      <option value="masonry">Masonry (Dynamic)</option>
                      <option value="single">Single (Carousel)</option>
                    </select>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label>Date</label>
                      <input type="text" className={styles.input} placeholder="e.g. Jan 2023" value={achievementForm.date} onChange={e => setAchievementForm({ ...achievementForm, date: e.target.value })} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Category</label>
                      <select className={styles.input} value={achievementForm.category} onChange={e => setAchievementForm({ ...achievementForm, category: e.target.value })}>
                        <option>Certification</option>
                        <option>Award</option>
                        <option>Hackathon</option>
                        <option>LeetCode</option>
                        <option>Certification</option>
                        <option>Award</option>
                        <option>Education</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea className={styles.textarea} placeholder="Details about the achievement" value={achievementForm.description} onChange={e => setAchievementForm({ ...achievementForm, description: e.target.value })} required />
                  </div>

                  <button type="submit" className="btn btn-primary">Add Achievement</button>
                </form>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className={styles.section}>
                <Messages />
              </div>
            )}

            {activeTab === 'recent' && (
              <div className={styles.section}>
                <h2>Recently Uploaded</h2>
                <RecentlyUploaded />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
