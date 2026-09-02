import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/components/About.module.css';

const About = () => {
    useScrollAnimation({ threshold: 0.1 });

    const timelineData = [
        {
            year: '2026 – Present',
            title: 'Aspiring Full-Stack Developer',
            institution: 'Building with the MERN Stack',
            description: 'Currently focused on becoming a strong full-stack developer by building real-world web applications using MongoDB, Express.js, React, and Node.js. Continuously improving problem-solving skills, backend development, APIs, and modern web development practices while working on practical projects.'
        },
        {
            year: 'October 2025 – Present',
            title: 'DSA & MERN Stack Journey',
            institution: 'Strengthening Core & Development Skills',
            description: 'Started an intensive journey into Data Structures and Algorithms alongside full-stack web development. Practicing DSA with Python while learning the MERN stack through hands-on projects, focusing on writing efficient solutions and building scalable web applications.'
        },
        {
            year: '2024 – 2025',
            title: 'Explored Software Development',
            institution: 'First Year, Exploring Possibilities',
            description: 'Used my first year of college to explore different areas of technology and software development. Experimented with frontend development, backend programming, databases, APIs, and other development domains to understand my interests and build a strong foundation in programming.'
        },
        {
            year: '2024',
            title: 'B.Tech Computer Science & Engineering',
            institution: 'CMR University, Bangalore',
            description: 'Began my B.Tech journey in Computer Science and Engineering at CMR University, Bangalore. Started building a strong foundation in programming, computer science fundamentals, and problem-solving while exploring different areas of technology through academics and personal projects.'
        },
        {
            year: '2024',
            title: 'PUC – Science',
            institution: 'Completed with 89.33%',
            description: 'Completed my Pre-University Course in the Science stream with 89.33%. This phase strengthened my foundation in mathematics, science, and analytical thinking and motivated me to pursue Computer Science and explore the world of technology.'
        }
    ];

    return (
        <section className={styles.aboutSection} id="about">
            <div className={styles.container}>
                <div className={`${styles.sectionHeader} animate-on-scroll`}>
                    <h2 className={styles.title}>About Me</h2>
                    <p className={styles.subtitle}>My professional journey and education</p>
                </div>

                <div className={styles.timeline}>
                    {timelineData.map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.timelineItem} animate-on-scroll`}
                            style={{ transitionDelay: `${index * 200}ms` }}
                        >
                            <div className={styles.timelineDot}></div>
                            <div className={styles.timelineContent}>
                                <span className={styles.date}>{item.year}</span>
                                <h3 className={styles.itemTitle}>{item.title}</h3>
                                <div className={styles.institution}>{item.institution}</div>
                                <p className={styles.description}>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
