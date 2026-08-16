import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styles from '../styles/components/ScrollToTop.module.css';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.pageYOffset;
            
            if (totalScroll > 0) {
                setScrollProgress(Math.min(100, Math.round((currentScroll / totalScroll) * 100)));
            }

            if (currentScroll > 250) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            className={`${styles.scrollToTop} ${isVisible ? styles.visible : ''}`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            title={`Scroll to top (${scrollProgress}%)`}
        >
            <div className={styles.glowRing} />
            <FaArrowUp className={styles.arrowIcon} />
        </button>
    );
};

export default ScrollToTop;
