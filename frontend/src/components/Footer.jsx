import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import styles from '../styles/components/Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer} id="contact">
            <div className={styles.gradientOverlay}></div>
            <div className="container">



                {/* Footer Content */}
                <div className={styles.footerContent}>
                    <div className={styles.footerInfo}>
                        <h3 className={styles.footerLogo}>Portfolio.</h3>
                        <p className={styles.footerText}>
                            Building digital experiences with passion and precision.
                        </p>
                    </div>

                    <div className={styles.socialLinks}>
                        <a href="#" className={styles.socialIcon} aria-label="GitHub"><FaGithub /></a>
                        <a href="#" className={styles.socialIcon} aria-label="LinkedIn"><FaLinkedin /></a>
                        <a href="#" className={styles.socialIcon} aria-label="Twitter"><FaTwitter /></a>
                        <a href="mailto:vikasvkori129@gmail.com" className={styles.socialIcon} aria-label="Email"><FaEnvelope /></a>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>&copy; {new Date().getFullYear()} Vikas v. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
