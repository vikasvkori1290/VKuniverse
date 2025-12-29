import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useScrollAnimation from '../hooks/useScrollAnimation';

const ScrollToTopOnMount = () => {
    const { pathname } = useLocation();
    useScrollAnimation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTopOnMount;
