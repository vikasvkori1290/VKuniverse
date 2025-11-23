import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Skills from '../components/Skills';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import ScrollProgress from '../components/ScrollProgress';
import ScrollToTop from '../components/ScrollToTop';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/pages/SkillsPage.module.css';

const SkillsPage = () => {
    useScrollAnimation({ threshold: 0.15, triggerOnce: true });

    return (
        <div className={styles.skillsPage}>
            <ParticleBackground />
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
