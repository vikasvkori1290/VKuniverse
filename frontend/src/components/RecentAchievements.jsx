import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaTrophy } from 'react-icons/fa';
import api from '../services/api';
import styles from '../styles/components/RecentAchievements.module.css';

const RecentAchievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const { data } = await api.get('/achievements');
                // Get latest 2 achievements
                setAchievements(data.slice(0, 2));
            } catch (error) {
                console.error('Error fetching achievements:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading achievements...</div>;
    }

    return (
        <section className={styles.achievementsSection}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <h2 className={styles.title}>
                        <FaTrophy /> Recent Achievements
                    </h2>
                    <p className={styles.subtitle}>Latest milestones and recognitions</p>
                </div>

                <div className={styles.achievementsGrid}>
                    {achievements.map((achievement, index) => (
                        <div key={achievement._id || index} className={styles.achievementCard}>
                            <div className={styles.dateTag}>
                                {new Date(achievement.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short'
                                })}
                            </div>
                            <div className={styles.content}>
                                <span className={styles.category}>{achievement.category}</span>
                                <h3 className={styles.achievementTitle}>{achievement.title}</h3>
                                <p className={styles.description}>{achievement.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.viewAllContainer}>
                    <Link to="/achievements" className="btn btn-secondary">
                        View All Achievements <FaArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default RecentAchievements;
