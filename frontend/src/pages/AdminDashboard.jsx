import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import styles from '../styles/pages/AdminDashboard.module.css';
import ImageUploader from '../components/admin/ImageUploader';
import VideoUploader from '../components/admin/VideoUploader';
import SkillIconPicker from '../components/admin/SkillIconPicker';
import RecentlyUploaded from '../components/admin/RecentlyUploaded';
import Messages from '../components/admin/Messages';

const AdminDashboard = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);

  // Fetch stats
  useEffect(() => {
    if (activeTab === 'overview') {
      const fetchStats = async () => {
        try {
          const { data } = await api.get('/analytics/dashboard');
          setDashboardStats(data);
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      };
      fetchStats();
    }
  }, [activeTab]);

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    images: [], // Array of { url, isThumbnail, order }
    video: '', // Video URL
    tags: '',
    liveLink: '',
    githubLink: '',
    status: 'completed'
  });

  const [skillForm, setSkillForm] = useState({
    name: '',
    icon: '', // This will store the URL or class
    iconSource: 'none',
    category: 'Frontend',
    proficiency: ''
  });

  const [editingId, setEditingId] = useState(null);

  const [achievementForm, setAchievementForm] = useState({
    title: '',
    date: '',
    description: '',
    category: 'Certification',
    images: [],
    collageLayout: 'grid'
  });

  // Handle Edit from History
  const handleEdit = (item, type) => {
    setEditingId(item._id);

    if (type === 'projects') {
      setProjectForm({
        title: item.title,
        description: item.description,
        images: item.images || [],
        video: item.video || '',
        tags: item.techStack ? item.techStack.join(', ') : '',
        liveLink: item.liveLink || '',
        githubLink: item.githubLink || '',
        status: item.status || 'completed'
      });
      setActiveTab('projects');
    } else if (type === 'skills') {
      setSkillForm({
        name: item.name,
        icon: item.icon || item.iconUrl || '',
        iconSource: item.iconSource || 'none',
        category: item.category || 'Frontend',
        proficiency: item.proficiency || ''
      });
      setActiveTab('skills');
    } else if (type === 'achievements') {
      setAchievementForm({
        title: item.title,
        date: item.date || '',
        description: item.description || '',
        category: item.category || 'Certification',
        images: item.images || [],
        collageLayout: item.collageLayout || 'grid'
      });
      setActiveTab('achievements');
    }
  };

  // Redirect if not logged in


  const handleLogout = () => {
    // Navigate first, then logout to avoid PrivateRoute redirecting to login
    navigate('/');
    setTimeout(() => {
      logout();
    }, 100);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...projectForm,
        techStack: projectForm.tags.split(',').map(tag => tag.trim()),
        images: projectForm.images
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
        setMessage('Project updated successfully!');
      } else {
        await api.post('/projects', payload);
        setMessage('Project added successfully!');
      }

      setProjectForm({
        title: '',
        description: '',
        images: [],
        video: '',
        tags: '',
        liveLink: '',
        githubLink: '',
        status: 'completed'
      });
      setEditingId(null);
    } catch (error) {
      console.error(error);
      setMessage(editingId ? 'Failed to update project' : 'Failed to add project');
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: skillForm.name,
        category: skillForm.category,
        proficiency: Number(skillForm.proficiency),
        icon: skillForm.icon,
        iconUrl: skillForm.icon,
        iconSource: skillForm.iconSource
      };

      if (editingId) {
        await api.put(`/skills/${editingId}`, payload);
        setMessage('Skill updated successfully!');
      } else {
        await api.post('/skills', payload);
        setMessage('Skill added successfully!');
      }

      setSkillForm({
        name: '',
        icon: '',
        iconSource: 'none',
        category: 'Frontend',
        proficiency: ''
      });
      setEditingId(null);
    } catch (error) {
      console.error(error);
      setMessage(editingId ? 'Failed to update skill' : 'Failed to add skill');
    }
  };

  const handleAchievementSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...achievementForm,
        images: achievementForm.images
      };

      if (editingId) {
        await api.put(`/achievements/${editingId}`, payload);
        setMessage('Achievement updated successfully!');
      } else {
        await api.post('/achievements', payload);
        setMessage('Achievement added successfully!');
      }

      setAchievementForm({
        title: '',
        date: '',
        description: '',
        category: 'Certification',
        images: [],
        collageLayout: 'grid'
      });
      setEditingId(null);
    } catch (error) {
      console.error('Achievement submission error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save achievement';
      setMessage(errorMessage);
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
            <button className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={`${styles.tab} ${activeTab === 'projects' ? styles.active : ''}`} onClick={() => setActiveTab('projects')}>Projects</button>
            <button className={`${styles.tab} ${activeTab === 'skills' ? styles.active : ''}`} onClick={() => setActiveTab('skills')}>Skills</button>
            <button className={`${styles.tab} ${activeTab === 'achievements' ? styles.active : ''}`} onClick={() => setActiveTab('achievements')}>Achievements</button>
            <button className={`${styles.tab} ${activeTab === 'messages' ? styles.active : ''}`} onClick={() => setActiveTab('messages')}>Messages</button>
            <button className={`${styles.tab} ${activeTab === 'recent' ? styles.active : ''}`} onClick={() => setActiveTab('recent')}>History</button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && dashboardStats && (
              <div className={styles.section}>
                <h2>Dashboard Overview</h2>
                <div className={styles.statsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#888' }}>Total Projects</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{dashboardStats.stats.projects}</p>
                  </div>
                  <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#888' }}>Total Messages</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{dashboardStats.stats.messages}</p>
                  </div>
                  <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#888' }}>Unread Messages</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: dashboardStats.stats.unreadMessages > 0 ? '#ff4d4d' : 'inherit' }}>
                      {dashboardStats.stats.unreadMessages}
                    </p>
                  </div>
                </div>

                <div className={styles.recentActivity} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <h3>Recent Messages</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {dashboardStats.recentActivity.messages.map(msg => (
                        <div key={msg._id} style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', borderLeft: `4px solid ${msg.isRead ? '#4caf50' : '#ff9800'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong>{msg.name}</strong>
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.subject}</p>
                        </div>
                      ))}
                      {dashboardStats.recentActivity.messages.length === 0 && <p style={{ color: '#666' }}>No messages yet.</p>}
                    </div>
                  </div>
                  <div>
                    <h3>Recent Projects</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {dashboardStats.recentActivity.projects.map(proj => (
                        <div key={proj._id} style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          {proj.images && proj.images.length > 0 && (
                            <img src={proj.images.find(img => img.isThumbnail)?.url || proj.images[0].url} alt={proj.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                          )}
                          <div>
                            <strong>{proj.title}</strong>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(proj.createdAt).toLocaleDateString()} • <span style={{ textTransform: 'capitalize', color: proj.status === 'completed' ? '#4caf50' : '#2196f3' }}>{proj.status}</span></div>
                          </div>
                        </div>
                      ))}
                      {dashboardStats.recentActivity.projects.length === 0 && <p style={{ color: '#666' }}>No projects yet.</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className={styles.section}>
                <h2>{editingId ? 'Edit Project' : 'Add New Project'}</h2>
                <form className={styles.form} onSubmit={handleProjectSubmit}>
                  {/* ... inputs ... */}
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
                    <label>Project Video (Optional - Auto plays in project card)</label>
                    <VideoUploader
                      video={projectForm.video}
                      onVideoChange={vid => setProjectForm({ ...projectForm, video: vid })}
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
                      <input type="text" className={styles.input} placeholder="https://example.com" value={projectForm.liveLink} onChange={e => setProjectForm({ ...projectForm, liveLink: e.target.value })} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>GitHub Link</label>
                      <input type="text" className={styles.input} placeholder="https://github.com/user/repo" value={projectForm.githubLink} onChange={e => setProjectForm({ ...projectForm, githubLink: e.target.value })} />
                    </div>
                  </div>

                  <div className={styles.buttonGroup}>
                    <button type="submit" className="btn btn-primary">{editingId ? 'Update Project' : 'Add Project'}</button>
                    {editingId && (
                      <button type="button" className="btn btn-secondary" onClick={() => {
                        setEditingId(null);
                        setProjectForm({
                          title: '', description: '', images: [], video: '', tags: '', liveLink: '', githubLink: '', status: 'completed'
                        });
                      }}>Cancel Edit</button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className={styles.section}>
                <h2>{editingId ? 'Edit Skill' : 'Add New Skill'}</h2>
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

                  <div className={styles.buttonGroup}>
                    <button type="submit" className="btn btn-primary">{editingId ? 'Update Skill' : 'Add Skill'}</button>
                    {editingId && (
                      <button type="button" className="btn btn-secondary" onClick={() => {
                        setEditingId(null);
                        setSkillForm({ name: '', icon: '', iconSource: 'none', category: 'Frontend', proficiency: '' });
                      }}>Cancel Edit</button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className={styles.section}>
                <h2>{editingId ? 'Edit Achievement' : 'Add New Achievement'}</h2>
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

                  <div className={styles.buttonGroup}>
                    <button type="submit" className="btn btn-primary">{editingId ? 'Update Achievement' : 'Add Achievement'}</button>
                    {editingId && (
                      <button type="button" className="btn btn-secondary" onClick={() => {
                        setEditingId(null);
                        setAchievementForm({ title: '', date: '', description: '', category: 'Certification', images: [], collageLayout: 'grid' });
                      }}>Cancel Edit</button>
                    )}
                  </div>
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
                <RecentlyUploaded onEdit={handleEdit} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
