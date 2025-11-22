import React from 'react';
import styles from '../styles/components/Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.heroSection} id="about">
            <div className="container">
                <div className={styles.heroContainer}>
                    <div className={`${styles.heroContent} animate-on-scroll`}>
                        <p className={styles.greeting}>Hello, I'm</p>
                        <h1 className={styles.title}>
                            Vikas <span className={styles.highlight}>Kumar</span>
                        </h1>
                        <h2 className={styles.subtitle}>
                            Full Stack Developer & <br />
                            Problem Solver
                        </h2>
                        <p className={styles.description}>
                            I build exceptional digital experiences that are fast, accessible, visually appealing, and responsive.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="#projects" className="btn btn-primary btn-lg">View Projects</a>
                            <a href="#contact" className="btn btn-secondary btn-lg">Contact Me</a>
                        </div>
                    </div>
                    <div className={`${styles.heroVisual} animate-on-scroll animate-delay-2`}>
                        {/* Placeholder for 3D element or illustration */}
                        <div className={styles.visualPlaceholder}>
                            <div className={styles.blob}></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
