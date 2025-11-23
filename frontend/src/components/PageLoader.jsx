import React, { useState, useEffect } from 'react';
import LoadingScreen from '../pages/LoadingScreen';
import styles from '../styles/pages/PageLoader.module.css';

const PageLoader = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading && (
                <div className={styles.overlay}>
                    <LoadingScreen />
                </div>
            )}
            {/* Render children after loading finishes */}
            <div className={loading ? styles.hidden : ''}>{children}</div>
        </>
    );
};

export default PageLoader;
