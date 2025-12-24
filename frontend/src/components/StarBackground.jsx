import React from 'react';
import styles from '../styles/components/StarBackground.module.css';

const StarBackground = () => {
    return (
        <div className={styles.starContainer}>
            <div className={styles.stars}></div>
            <div className={styles.stars2}></div>
            <div className={styles.stars3}></div>
        </div>
    );
};

export default StarBackground;
