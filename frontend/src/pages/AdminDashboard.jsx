import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/pages/AdminDashboard.module.css';

const AdminDashboard = () => {
    const { admin, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
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
                    <p>Dashboard content goes here. (Projects, Achievements, Skills management)</p>
                    {/* Add Tabs or Sections for managing different content */}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
