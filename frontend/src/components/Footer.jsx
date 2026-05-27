import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';
import styles from '../styles/components/Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer} id="contact">
            <div className={styles.gradientOverlay}></div>
            <div className="container">



                {/* Footer Content */}
                <div className={styles.footerContent}>
                    <div className={styles.footerInfo}>
                        <h3 className={styles.footerLogo}>VKuniverse</h3>
                        <p className={styles.footerText}>
                            Building digital experiences with passion and precision.
                        </p>
                    </div>

                    <div className={styles.socialLinks}>
                        <a href="https://github.com/vikasvkori1290" className={styles.socialIcon} aria-label="GitHub"><FaGithub /></a>
                        <a href="https://www.linkedin.com/in/vikas-v-4a4749330/" className={styles.socialIcon} aria-label="LinkedIn"><FaLinkedin /></a>
                        <a href="https://www.instagram.com/_vikas_129_?igsh=MTAwb2w1cjRrdWZ1MQ==" className={styles.socialIcon} aria-label="Instagram"><FaInstagram /></a>
                        <a href="mailto:vikasvkori129@gmail.com" className={styles.socialIcon} aria-label="Email"><FaEnvelope /></a>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <div className={styles.footerBottomLinks}>
                        <p>&copy; {new Date().getFullYear()} Vikas v. All rights reserved.</p>
                        <Link to="/admin/login" className={styles.adminLink}>Admin Area</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
