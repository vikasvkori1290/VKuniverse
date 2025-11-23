import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Skills from '../components/Skills';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import ScrollToTop from '../components/ScrollToTop';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/pages/SkillsPage.module.css';

const SkillsPage = () => {
    useScrollAnimation({ threshold: 0.15, triggerOnce: true });

    return (
        <div className={styles.skillsPage}>
            <ScrollProgress />
            <Navbar />
            <main className={styles.mainContent}>
                <Skills />
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default SkillsPage;
