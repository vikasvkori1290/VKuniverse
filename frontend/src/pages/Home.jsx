import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Achievements from '../components/Achievements';
import Footer from '../components/Footer';
import styles from '../styles/pages/Home.module.css';

const Home = () => {
    return (
        <div className={styles.home}>
            <Navbar />
            <main>
                <Hero />
                <Projects />
                <Skills />
                <Achievements />
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
        </div>
    );
};

export default Home;
