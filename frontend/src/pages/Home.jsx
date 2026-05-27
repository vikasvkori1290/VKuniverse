import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import ScrollToTop from '../components/ScrollToTop';
import useScrollAnimation from '../hooks/useScrollAnimation';
import About from '../components/About';
import RecentBlogs from '../components/RecentBlogs';
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
                <RecentBlogs />
                <About />
                <ContactForm />
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default Home;
