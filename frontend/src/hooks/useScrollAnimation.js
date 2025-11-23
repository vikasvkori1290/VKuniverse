import { useEffect } from 'react';

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * @param {Object} options - Configuration options
 * @param {string} options.threshold - Intersection threshold (0 to 1)
 * @param {string} options.rootMargin - Root margin for intersection
 * @param {boolean} options.triggerOnce - Whether to trigger animation only once
 */
const useScrollAnimation = (options = {}) => {
    const {
        threshold = 0.1,
        rootMargin = '0px',
        triggerOnce = true
    } = options;

    useEffect(() => {
        const elements = document.querySelectorAll('.animate-on-scroll');

        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';

                        if (triggerOnce) {
                            observer.unobserve(entry.target);
                        }
                    } else if (!triggerOnce) {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateY(30px)';
                    }
                });
            },
            {
                threshold,
                rootMargin
            }
        );

        elements.forEach((el) => {
            observer.observe(el);
        });

        return () => {
            elements.forEach((el) => {
                observer.unobserve(el);
            });
        };
    }, [threshold, rootMargin, triggerOnce]);
};

export default useScrollAnimation;
