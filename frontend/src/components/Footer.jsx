import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import styles from '../styles/components/Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer} id="contact">
            <div className={styles.gradientOverlay}></div>
            <div className="container">
                {/* Contact Section */}
                <div className={styles.contactSection}>
                    <div className="animate-on-scroll">
                        <h2 className={styles.contactTitle}>Get In Touch</h2>
                        <p className={styles.contactSubtitle}>
                            Have a project in mind or just want to say hi? I'd love to hear from you.
                        </p>
                        <a href="mailto:vikasvkori129@gmail.com" className="btn btn-primary btn-lg">Say Hello</a>
                    </div>
                </div>


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
