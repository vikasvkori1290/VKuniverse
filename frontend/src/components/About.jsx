import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/components/About.module.css';

const About = () => {
    useScrollAnimation({ threshold: 0.1 });
    const [activeTab, setActiveTab] = React.useState('about');

    return (
        <section className={styles.aboutSection} id="about">
            <div className={styles.container}>
                <div className={`${styles.sectionHeader} animate-on-scroll`}>
                    <h2 className={styles.title}>About Me</h2>
                    <p className={styles.subtitle}>My background, journey, and education</p>
                </div>

                {/* Profile Bento Card */}
                <div className={`${styles.profileCard} animate-on-scroll`}>
                    <div className={styles.photoContainer}>
                        <img 
                            src="/vk%20image.jpeg" 
                            alt="Vikas V" 
                            className={styles.profilePhoto} 
                        />
                    </div>
                    <div className={styles.profileBio}>
                        <div className={styles.headerTopRow}>
                            <div className={styles.statusBadge}>
                                <span className={styles.statusDot}></span>
                                <span>Available for Opportunities</span>
                            </div>

                            {/* Slider Switch */}
                            <div className={styles.sliderSwitch}>
                                <button
                                    type="button"
                                    className={`${styles.sliderBtn} ${activeTab === 'about' ? styles.sliderBtnActive : ''}`}
                                    onClick={() => setActiveTab('about')}
                                >
                                    About Me
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.sliderBtn} ${activeTab === 'education' ? styles.sliderBtnActive : ''}`}
                                    onClick={() => setActiveTab('education')}
                                >
                                    Education
                                </button>
                            </div>
                        </div>

                        {activeTab === 'about' ? (
                            <div className={styles.tabContentFade}>
                                <h3 className={styles.profileName}>Vikas V</h3>
                                <p className={styles.profileRole}>Full-Stack Developer & Problem Solver</p>
                                <p className={styles.profileSummary}>
                                    I build full-stack web applications with the MERN stack, design reliable REST APIs, and solve algorithmic problems with a focus on clean, efficient code. I enjoy turning ideas into real-world products and continuously improving my skills through hands-on projects and problem solving.
                                </p>
                                <div className={styles.tagList}>
                                    <span className={styles.tag}>Full-Stack</span>
                                    <span className={styles.tag}>MERN Stack</span>
                                    <span className={styles.tag}>Python & DSA</span>
                                    <span className={styles.tag}>REST APIs</span>
                                    <span className={styles.tag}>Bangalore, IN</span>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.tabContentFade}>
                                <h3 className={styles.profileName}>Academic Performance</h3>
                                
                                <div className={styles.semGrid}>
                                    <div className={styles.semCard}>
                                        <span className={styles.semLabel}>1st Sem</span>
                                        <span className={styles.semValue}>8.2</span>
                                    </div>
                                    <div className={styles.semCard}>
                                        <span className={styles.semLabel}>2nd Sem</span>
                                        <span className={styles.semValue}>8.8</span>
                                    </div>
                                    <div className={styles.semCard}>
                                        <span className={styles.semLabel}>3rd Sem</span>
                                        <span className={styles.semValue}>8.7</span>
                                    </div>
                                    <div className={styles.semCard}>
                                        <span className={styles.semLabel}>4th Sem</span>
                                        <span className={styles.semValue}>9.0</span>
                                    </div>
                                    <div className={`${styles.semCard} ${styles.semCardAvg}`}>
                                        <span className={styles.semLabel}>Average CGPA</span>
                                        <span className={styles.semValueAvg}>8.68</span>
                                    </div>
                                </div>

                                <div className={styles.pucCard}>
                                    <div className={styles.pucHeader}>
                                        <span className={styles.pucTitle}>Pre-University Course (PUC) – Science</span>
                                        <span className={styles.pucScore}>89.33%</span>
                                    </div>
                                </div>

                                <div className={styles.tagList}>
                                    <span className={styles.tag}>8.68 CGPA</span>
                                    <span className={styles.tag}>PUC 89.33%</span>
                                    <span className={styles.tag}>Computer Science</span>
                                    <span className={styles.tag}>Bangalore, IN</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
