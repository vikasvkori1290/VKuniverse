import React from 'react';
import { Link } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/components/About.module.css';

const About = () => {
    useScrollAnimation({ threshold: 0.1 });

    const timelineData = [
        {
            year: '2025 – Present',
            title: 'Aspiring MERN Stack Engineer',
            institution: 'Building Future-ready Web Solutions',
            description: 'Fueled by a passion for solving real-world problems, currently mastering Data Structures & Algorithms in Python while specializing in developing robust APIs and scalable web applications. Eager to innovate and contribute to impactful projects as a full-stack developer, combining technical expertise with strong problem-solving abilities.'
        },
        {
            year: 'October 2025 – Present',
            title: 'DSA & MERN Stack Enthusiast',
            institution: 'Deep Dive into Advanced Concepts',
            description: 'Started an intensive journey into Data Structures and Algorithms along with the MERN stack, focusing on hands-on projects and practical applications. Striving to bridge the gap between core programming concepts and the complexities of modern web development.'
        },
        {
            year: '2024 – 2025',
            title: 'Explored Diverse Development Domains',
            institution: 'First Year, Infinite Possibilities',
            description: 'Embraced and explored every major area of software development—from frontend interfaces to backend logic, mobile apps to hardware projects. Enjoyed a dynamic first year of experimentation, laying the foundation for a well-rounded developer mindset.'
        },
        {
            year: '2024',
            title: 'B.Tech Computer Science Engineer',
            institution: 'CMR University, Bangalore',
            description: 'Embarked on a transformative journey at CMR University, Bangalore, as a B.Tech student specializing in Computer Science. Developing skills through academic rigor, practical projects, and active participation in the tech community.'
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
                <Link
                    to="/resume-builder"
                    className={`btn btn-lg ${styles.aiResumeBtn}`}
                >
                    ✨ Build Resume with AI
                </Link>
            </div>
        </section>
    );
};

export default About;
