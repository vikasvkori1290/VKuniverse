import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaNodeJs, FaReact, FaPython } from 'react-icons/fa';
import { SiExpress, SiTailwindcss, SiMongodb, SiHtml5, SiCss3, SiJavascript, SiC } from 'react-icons/si';
import useTypingEffect from '../hooks/useTypingEffect';
import styles from '../styles/components/Hero.module.css';

const Hero = () => {
    const titles = [
        'Aspiring FullStack Developer',
        'Problem Solver',
        'UI/UX Enthusiast',
        'API Expert'
    ];

    const { text: typingText, cursor } = useTypingEffect(titles, 80, 40, 2000);

    const techIcons = [
        { Icon: SiHtml5, name: "HTML" },
        { Icon: SiCss3, name: "CSS" },
        { Icon: SiJavascript, name: "JavaScript" },
        { Icon: FaPython, name: "Python" },
        { Icon: SiC, name: "C" },
        { Icon: FaNodeJs, name: "Node.js" },
        { Icon: SiExpress, name: "Express.js" },
        { Icon: FaReact, name: "React" },
        { Icon: SiTailwindcss, name: "Tailwind CSS" },
        { Icon: SiMongodb, name: "MongoDB" },
    ];

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
                            Welcome to VKuniverse , I build exceptional digital experiences that are fast, accessible, visually appealing, and responsive.
                        </p>
                        <div className={styles.ctaButtons}>
                            <Link to="/projects" className="btn btn-primary btn-lg">View Projects</Link>
                            <a href="#contact" className="btn btn-secondary btn-lg">Contact Me</a>
                        </div>

                        <div className={styles.socialLinks}>
                            <a href="https://github.com/vikasvkori1290" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub">
                                <FaGithub />
                            </a>
                            <a href="https://www.linkedin.com/in/vikas-v-4a4749330/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="mailto:vikasvkori129@gmail.com" className={styles.socialIcon} aria-label="Email">
                                <FaEnvelope />
                            </a>
                        </div>
                    </div>

                    <div className={`${styles.heroVisual} animate-on-scroll animate-delay-2`}>
                        <div className={styles.visualPlaceholder}>
                            {/* Front of the card (Initial View) */}
                            <div className={styles.flipCardFront}>
                                {/* USER: Replace with your front image */}
                                <img src="/front-photo.png" alt="Front View" className={styles.userPhoto} />
                            </div>

                            {/* Back of the card (Revealed on Hover) */}
                            <div className={styles.flipCardBack}>
                                <img src="/my-photo.png" alt="Vikas V" className={styles.userPhoto} />
                            </div>
                        </div>

                        <p className={styles.techLabel}>Tech I Use</p>

                        {/* Tech Marquee */}
                        <div className={styles.techMarquee}>
                            <div className={styles.marqueeTrack}>
                                {techIcons.concat(techIcons).map((tech, index) => (
                                    <div key={index} className={styles.techIconItem}>
                                        <tech.Icon />
                                    </div>
                                ))}
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
