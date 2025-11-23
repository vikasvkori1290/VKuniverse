import React, { useState, useEffect } from 'react';
import styles from '../styles/components/ScrollProgress.module.css';

const ScrollProgress = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const calculateScrollProgress = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            const totalScroll = documentHeight - windowHeight;
            const progress = (scrollTop / totalScroll) * 100;

            setScrollProgress(Math.min(progress, 100));
        };

        window.addEventListener('scroll', calculateScrollProgress);
        calculateScrollProgress(); // Initial calculation

        return () => window.removeEventListener('scroll', calculateScrollProgress);
    }, []);

    return (
        <div className={styles.scrollProgress}>
            <div
                className={styles.progressBar}
                style={{ width: `${scrollProgress}%` }}
            />
        </div>
    );
};

export default ScrollProgress;
