import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/components/About.module.css';

const About = () => {
    useScrollAnimation({ threshold: 0.1 });

    const timelineData = [
        {
            year: '2023 - Present',
            title: 'Senior Full Stack Developer',
            institution: 'Tech Solutions Inc.',
            description: 'Leading a team of developers in building scalable web applications using MERN stack. Implemented CI/CD pipelines and improved application performance by 40%.'
        },
        {
            year: '2021 - 2023',
            title: 'Full Stack Developer',
            institution: 'Digital Innovations',
            description: 'Developed and maintained multiple client projects. Specialized in React frontend architecture and Node.js backend services.'
        },
        {
            year: '2019 - 2021',
            title: 'Frontend Developer',
            institution: 'Creative Web Agency',
            description: 'Collaborated with designers to translate UI/UX wireframes into high-quality code. Built responsive and interactive websites.'
        },
        {
            year: '2015 - 2019',
            title: 'B.Tech in Computer Science',
            institution: 'University of Technology',
            description: 'Graduated with Honors. Focused on Data Structures, Algorithms, and Web Technologies. Led the university coding club.'
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

            <div className={`${styles.buttonContainer} animate-on-scroll`}>
                <a
                    href="/resume.pdf"
                    download="Vikas_V_Resume.pdf"
                    className={`btn btn-lg ${styles.resumeBtn}`}
                >
                    📄 Download Resume
                </a>
            </div>
        </section>
    );
};

export default About;
