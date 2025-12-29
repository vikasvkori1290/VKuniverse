import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollAnimation = () => {
    const location = useLocation();

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once visible to persist state
                }
            });
        }, observerOptions);

        // Add a small delay to ensure DOM elements are rendered
        const timeoutId = setTimeout(() => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach((el) => observer.observe(el));
        }, 300);

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, [location]); // Re-run effect when location changes
};

export default useScrollAnimation;
