import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import useTypingEffect from '../hooks/useTypingEffect';
import styles from '../styles/components/Hero.module.css';

const Hero = () => {
    const titles = [
        'Full Stack Developer',
        'Problem Solver',
        'UI/UX Enthusiast',
        'Tech Innovator'
    ];

    const { text: typingText, cursor } = useTypingEffect(titles, 80, 40, 2000);

    return (
        <section className={styles.heroSection} id="about">
            <div className="container">
                <div className={styles.heroContainer}>
                    <div className={`${styles.heroContent} animate-on-scroll`}>
                        <p className={styles.greeting}>Hello, I'm</p>
                        <h1 className={styles.title}>
                            Vikas <span className={styles.highlight}>V</span>
                        </h1>
                        <h2 className={styles.subtitle}>
                            <span className={styles.typingText}>
                                {typingText}
                                <span className={styles.cursor}>{cursor}</span>
                            </span>
                        </h2>
                        <p className={styles.description}>
                            I build exceptional digital experiences that are fast, accessible, visually appealing, and responsive.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="#projects" className="btn btn-primary btn-lg">View Projects</a>
                            <a href="#contact" className="btn btn-secondary btn-lg">Contact Me</a>
                        </div>

                        <div className={styles.socialLinks}>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub">
                                <FaGithub />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="mailto:vikas@example.com" className={styles.socialIcon} aria-label="Email">
                                <FaEnvelope />
                            </a>
                        </div>
                    </div>

                    <div className={`${styles.heroVisual} animate-on-scroll animate-delay-2`}>
                        <div className={styles.visualPlaceholder}>
                            {/* Front of the card (Initial View) */}
                            <div className={styles.flipCardFront}>
                                {/* USER: Replace with your front image */}
                                {/* <img src="/front-photo.jpg" alt="Front View" className={styles.userPhoto} /> */}
                            </div>

                            {/* Back of the card (Revealed on Hover) */}
                            <div className={styles.flipCardBack}>
                                <img src="/my-photo.jpg" alt="Vikas V" className={styles.userPhoto} />
                            </div>
                        </div>
                        <div className={`${styles.blob} ${styles.blob1}`}></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
