import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/components/Navbar.module.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className="container">
                <div className={styles.navContent}>
                    <Link to="/" className={styles.logo}>
                        Portfolio<span className={styles.dot}>.</span>
                    </Link>

                    <div className={`${styles.navLinks} ${menuOpen ? styles.active : ''}`}>
                        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
                        <a href="#skills" onClick={() => setMenuOpen(false)}>Skills</a>
                        <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
                        <a href="#achievements" onClick={() => setMenuOpen(false)}>Achievements</a>
                        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
                        <Link to="/admin/login" className="btn btn-sm btn-primary" onClick={() => setMenuOpen(false)}>Admin</Link>
                    </div>

                    <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                        <span className={menuOpen ? styles.barOpen : ''}></span>
                        <span className={menuOpen ? styles.barOpen : ''}></span>
                        <span className={menuOpen ? styles.barOpen : ''}></span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
