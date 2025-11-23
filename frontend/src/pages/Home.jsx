import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import ScrollToTop from '../components/ScrollToTop';
import useScrollAnimation from '../hooks/useScrollAnimation';
import About from '../components/About';
// import FeaturedProjects from '../components/FeaturedProjects';
// import RecentAchievements from '../components/RecentAchievements';
// import GitHubStats from '../components/GitHubStats';
import ContactForm from '../components/ContactForm';
import styles from '../styles/pages/Home.module.css';

const Home = () => {
    useScrollAnimation({ threshold: 0.15, triggerOnce: true });

    return (
        <div className={styles.home}>
            <ScrollProgress />
            <Navbar />
            <main>
                <Hero />
                <About />
                {/* <FeaturedProjects /> */}
                {/* <RecentAchievements /> */}
                {/* <GitHubStats /> */}
                <ContactForm />
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default Home;
