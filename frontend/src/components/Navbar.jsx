import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/components/Navbar.module.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

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

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className="container">
                <div className={styles.navContent}>
                    <Link to="/" className={styles.logo}>
                        <span className={styles.logoText}>VK</span>
                        <span className={styles.logoSubtext}>Portfolio</span>
                    </Link>

                    <div className={`${styles.navLinks} ${menuOpen ? styles.active : ''}`}>
                        <Link
                            to="/"
                            className={isActive('/') ? styles.activeLink : ''}
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/projects"
                            className={isActive('/projects') ? styles.activeLink : ''}
                            onClick={() => setMenuOpen(false)}
                        >
                            Projects
                        </Link>
                        <Link
                            to="/skills"
                            className={isActive('/skills') ? styles.activeLink : ''}
                            onClick={() => setMenuOpen(false)}
                        >
                            Skills
                        </Link>
                        <Link
                            to="/achievements"
                            className={isActive('/achievements') ? styles.activeLink : ''}
                            onClick={() => setMenuOpen(false)}
                        >
                            Achievements
                        </Link>
                        <a
                            href="#contact"
                            onClick={() => setMenuOpen(false)}
                        >
                            Contact
                        </a>
                    </div>

                    <div className={styles.navActions}>
                        <button
                            className={styles.themeToggle}
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <FaMoon /> : <FaSun />}
                        </button>

                        <Link
                            to="/admin/login"
                            className={`btn btn-sm btn-primary ${styles.adminBtn}`}
                        >
                            Admin
                        </Link>

                        <div
                            className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
