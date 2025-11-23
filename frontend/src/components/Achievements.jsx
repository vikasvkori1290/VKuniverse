import React from 'react';
import styles from '../styles/components/Achievements.module.css';
import api from '../services/api';

const Achievements = () => {
    const [achievements, setAchievements] = React.useState([]);

    React.useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const { data } = await api.get('/achievements');
                setAchievements(data);
            } catch (error) {
                console.error('Error fetching achievements:', error);
            }
        };
        fetchAchievements();
    }, []);

    return (
        <section className={styles.achievementsSection} id="achievements">
            <div className={styles.container}>
                <div className={`${styles.sectionHeader} animate-on-scroll`}>
                    <h2 className={styles.title}>Achievements</h2>
                    <p className={styles.subtitle}>Milestones and recognitions along my journey.</p>
                </div>

                <div className={styles.timeline}>
                    {achievements.map((item, index) => (
                        <div key={item.id} className={`${styles.timelineItem} animate-on-scroll animate-delay-${index + 1}`}>
                            <div className={styles.timelineDot}></div>
                            <div className={styles.timelineContent}>
                                <span className={styles.date}>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                                <h3 className={styles.itemTitle}>{item.title}</h3>
                                <span className={styles.category}>{item.category}</span>
                                <p className={styles.description}>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;
