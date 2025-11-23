import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Achievements from '../components/Achievements';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import ScrollProgress from '../components/ScrollProgress';
import ScrollToTop from '../components/ScrollToTop';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/pages/AchievementsPage.module.css';

const AchievementsPage = () => {
    useScrollAnimation({ threshold: 0.15, triggerOnce: true });

    return (
        <div className={styles.achievementsPage}>
            <ParticleBackground />
            <ScrollProgress />
            <Navbar />
            <main className={styles.mainContent}>
                <Achievements />
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default AchievementsPage;
