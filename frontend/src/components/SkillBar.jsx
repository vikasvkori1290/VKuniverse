import React, { useState, useEffect } from 'react';
import styles from '../styles/components/SkillBar.module.css';

const SkillBar = ({ skillName, percentage, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [animatedPercentage, setAnimatedPercentage] = useState(0);

    useEffect(() => {
        // Trigger animation after component mounts with optional delay
        const timer = setTimeout(() => {
            setIsVisible(true);
            // Animate the percentage
            let current = 0;
            const increment = percentage / 50; // 50 steps for smooth animation
            const interval = setInterval(() => {
                current += increment;
                if (current >= percentage) {
                    setAnimatedPercentage(percentage);
                    clearInterval(interval);
                } else {
                    setAnimatedPercentage(Math.floor(current));
                }
            }, 20);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timer);
    }, [percentage, delay]);

    return (
        <div className={styles.skillBarContainer}>
            <div className={styles.skillHeader}>
                <span className={styles.skillName}>{skillName}</span>
                <span className={styles.skillPercentage}>{animatedPercentage}%</span>
            </div>
            <div className={styles.skillBarTrack}>
                <div
                    className={`${styles.skillBarFill} ${isVisible ? styles.animate : ''}`}
                    style={{ width: `${isVisible ? percentage : 0}%` }}
                >
                    <div className={styles.skillBarGlow}></div>
                </div>
            </div>
        </div>
    );
};

export default SkillBar;
