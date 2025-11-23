import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/LoadingScreen.module.css';

const LoadingScreen = () => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade out after 3 seconds
        const timer = setTimeout(() => {
            setFadeOut(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`${styles.loadingScreen} ${fadeOut ? styles.fadeOut : ''}`}>
            <video
                src="/loading.mp4"
                autoPlay
                muted
                playsInline
                style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
            />
        </div>
    );
};

export default LoadingScreen;
