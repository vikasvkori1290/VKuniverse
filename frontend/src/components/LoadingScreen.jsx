import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsVisible(false);
                        // Call onComplete after transition finishes
                        setTimeout(() => {
                            if (onComplete) onComplete();
                        }, 500);
                    }, 500);
                    return 100;
                }
                return prev + Math.random() * 10;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []); // Empty dependency array to prevent restart

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            transition: 'opacity 0.5s ease-out',
            opacity: isVisible ? 1 : 0,
            pointerEvents: isVisible ? 'all' : 'none' // Disable interactions when hidden
        }}>
            <div style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '20px',
                fontFamily: 'var(--font-display)',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                VK
            </div>
            <div style={{
                width: '200px',
                height: '4px',
                background: 'var(--bg-tertiary)',
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'var(--accent-primary)',
                    transition: 'width 0.1s ease-out'
                }}></div>
            </div>
            <div style={{
                marginTop: '10px',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
            }}>
                {Math.round(progress)}%
            </div>
        </div>
    );
};

export default LoadingScreen;
