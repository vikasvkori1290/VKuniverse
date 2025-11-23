import React from 'react';
import styles from '../styles/components/Achievements.module.css';

const Achievements = () => {
    const achievements = [
        {
            id: 1,
            title: 'Hackathon Winner',
            description: 'Secured 1st place in the National Coding Hackathon 2024 solving complex algorithmic problems.',
            date: '2024-03-15',
            category: 'Competition'
        },
        {
            id: 2,
            title: 'Open Source Contributor',
            description: 'Merged 5+ PRs to major React libraries including bug fixes and performance improvements.',
            date: '2023-11-20',
            category: 'Open Source'
        },
        {
            id: 3,
            title: 'AWS Certified Developer',
            description: 'Achieved AWS Certified Developer - Associate certification with a score of 950/1000.',
            date: '2023-08-10',
            category: 'Certification'
        }
    ];

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
