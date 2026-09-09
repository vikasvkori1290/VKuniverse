import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import useScrollAnimation from '../hooks/useScrollAnimation';
import About from '../components/About';
import FeaturedAchievement from '../components/FeaturedAchievement';
import RecentBlogs from '../components/RecentBlogs';
import ContactForm from '../components/ContactForm';
import styles from '../styles/pages/Home.module.css';

const Home = () => {
    useScrollAnimation({ threshold: 0.15, triggerOnce: true });

    return (
        <div className={styles.home}>
            <Navbar />
            <main>
                <Hero />
                <FeaturedAchievement />
                <About />
                <RecentBlogs />
                <ContactForm />
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default Home;
