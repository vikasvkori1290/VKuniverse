import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import ScrollToTop from '../components/ScrollToTop';
import styles from '../styles/pages/Home.module.css'; // Reusing Home styles for layout

const ContactPage = () => {
    return (
        <div className={styles.home}>
            <Navbar />
            <main style={{ paddingTop: '80px', minHeight: 'calc(100vh - 300px)' }}>
                <ContactForm />
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default ContactPage;
