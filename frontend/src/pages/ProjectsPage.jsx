import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import ScrollProgress from '../components/ScrollProgress';
import ScrollToTop from '../components/ScrollToTop';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/pages/ProjectsPage.module.css';

const ProjectsPage = () => {
    useScrollAnimation({ threshold: 0.15, triggerOnce: true });

    return (
        <div className={styles.projectsPage}>
            <ParticleBackground />
            <ScrollProgress />
            <Navbar />
            <main className={styles.mainContent}>
                <Projects />
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default ProjectsPage;
