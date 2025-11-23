import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import ScrollProgress from '../components/ScrollProgress';
import ScrollToTop from '../components/ScrollToTop';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/pages/Home.module.css';

const Home = () => {
    useScrollAnimation({ threshold: 0.15, triggerOnce: true });

    return (
        <div className={styles.home}>
            <ParticleBackground />
            <ScrollProgress />
            <Navbar />
            <main>
                <Hero />
                <section id="contact" className={styles.contactSection}>
                    <div className="container">
                        <div className="animate-on-scroll">
                            <h2 className={styles.contactTitle}>Get In Touch</h2>
                            <p className={styles.contactSubtitle}>
                                Have a project in mind or just want to say hi? I'd love to hear from you.
                            </p>
                            <a href="mailto:vikas@example.com" className="btn btn-primary btn-lg">Say Hello</a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default Home;
