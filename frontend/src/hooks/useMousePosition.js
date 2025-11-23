import { useState, useEffect } from 'react';

/**
 * Custom hook to track mouse position
 * @param {number} debounceDelay - Delay for debouncing mouse movements (optional)
 */
const useMousePosition = (debounceDelay = 0) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        let timeoutId;

        const handleMouseMove = (event) => {
            if (debounceDelay > 0) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    setMousePosition({ x: event.clientX, y: event.clientY });
                }, debounceDelay);
            } else {
                setMousePosition({ x: event.clientX, y: event.clientY });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [debounceDelay]);

    return mousePosition;
};

export default useMousePosition;
