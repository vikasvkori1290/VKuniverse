import React, { useEffect, useState } from 'react';

const AnimatedCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hidden, setHidden] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [linkHovered, setLinkHovered] = useState(false);

    useEffect(() => {
        const addEventListeners = () => {
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseenter", onMouseEnter);
            document.addEventListener("mouseleave", onMouseLeave);
            document.addEventListener("mousedown", onMouseDown);
            document.addEventListener("mouseup", onMouseUp);
        };

        const removeEventListeners = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseenter", onMouseEnter);
            document.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);
        };

        const onMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const onMouseEnter = () => {
            setHidden(false);
        };

        const onMouseLeave = () => {
            setHidden(true);
        };

        const onMouseDown = () => {
            setClicked(true);
        };

        const onMouseUp = () => {
            setClicked(false);
        };

        const handleLinkHoverEvents = () => {
            document.querySelectorAll("a, button, .clickable").forEach((el) => {
                el.addEventListener("mouseover", () => setLinkHovered(true));
                el.addEventListener("mouseout", () => setLinkHovered(false));
            });
        };

        addEventListeners();
        handleLinkHoverEvents();

        return () => removeEventListeners();
    }, []);

    const cursorClasses = `
        fixed pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2
        rounded-full mix-blend-difference transition-transform duration-150 ease-out
        ${hidden ? 'opacity-0' : 'opacity-100'}
        ${clicked ? 'scale-90' : 'scale-100'}
        ${linkHovered ? 'scale-150 bg-white' : 'bg-white'}
    `;

    // Inline styles for simplicity since we're using CSS modules elsewhere
    const styles = {
        cursor: {
            width: '32px',
            height: '32px',
            border: '2px solid var(--accent-primary)',
            borderRadius: '50%',
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 9999,
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: `translate(-50%, -50%) scale(${clicked ? 0.9 : 1}) scale(${linkHovered ? 1.5 : 1})`,
            transition: 'transform 0.1s ease-out, width 0.2s, height 0.2s',
            backgroundColor: linkHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            mixBlendMode: 'difference'
        },
        dot: {
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--accent-primary)',
            borderRadius: '50%',
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 9999,
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.2s',
            opacity: linkHovered ? 0 : 1
        }
    };

    if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return null; // Don't render on mobile
    }

    return (
        <>
            <div style={styles.cursor}></div>
            <div style={styles.dot}></div>
        </>
    );
};

export default AnimatedCursor;
