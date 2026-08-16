import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaCopy, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';
import styles from '../styles/components/ContactForm.module.css';

const ContactForm = () => {
    const [copiedField, setCopiedField] = useState('');

    const phone = '7022181456';
    const formattedPhone = '+91 7022181456';
    const email = 'vikasvkori129@gmail.com';

    const handleCopy = (text, fieldName) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(''), 2000);
    };

    return (
        <section className={styles.contactSection} id="contact">
            <div className={styles.container}>
                {/* Header */}
                <div className={`${styles.sectionHeader} animate-on-scroll`}>
                    <div className={styles.badge}>
                        <span className={styles.liveDot}></span> DIRECT REACH
                    </div>
                    <h2 className={styles.title}>Let's Connect</h2>
                    <p className={styles.subtitle}>
                        Have an opportunity, collaboration idea, or question? Reach out directly.
                    </p>
                </div>

                {/* Aesthetic Master Contact Hub */}
                <div className={`${styles.contactHub} animate-on-scroll`}>
                    {/* Top Status Bar */}
                    <div className={styles.hubTopBar}>
                        <div className={styles.locationTag}>
                            <FaMapMarkerAlt className={styles.mapIcon} />
                            <span>Bangalore, Karnataka, India</span>
                        </div>
                        <div className={styles.statusBadge}>
                            <span className={styles.pulseDot}></span>
                            <span>Open for Opportunities</span>
                        </div>
                    </div>

                    {/* Contact Channels Grid */}
                    <div className={styles.channelsGrid}>
                        {/* Phone & WhatsApp Channel */}
                        <div className={styles.channelCard}>
                            <div className={styles.channelHeader}>
                                <div className={`${styles.channelIconBox} ${styles.phoneIconBox}`}>
                                    <FaPhoneAlt />
                                </div>
                                <div className={styles.channelMeta}>
                                    <span className={styles.channelLabel}>Phone & WhatsApp</span>
                                    <a href={`tel:${phone}`} className={styles.channelValue}>
                                        {formattedPhone}
                                    </a>
                                </div>
                            </div>

                            <div className={styles.channelActions}>
                                <a href={`tel:${phone}`} className={styles.actionBtnPrimary}>
                                    <FaPhoneAlt /> Call
                                </a>
                                <a
                                    href={`https://wa.me/91${phone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.actionBtnWhatsapp}
                                >
                                    <FaWhatsapp /> WhatsApp
                                </a>
                                <button
                                    className={`${styles.actionBtnCopy} ${copiedField === 'phone' ? styles.copied : ''}`}
                                    onClick={() => handleCopy(phone, 'phone')}
                                    title="Copy Number"
                                >
                                    {copiedField === 'phone' ? (
                                        <>
                                            <FaCheck style={{ color: '#4ade80' }} /> <span>Copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaCopy /> <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Email Channel */}
                        <div className={styles.channelCard}>
                            <div className={styles.channelHeader}>
                                <div className={`${styles.channelIconBox} ${styles.emailIconBox}`}>
                                    <FaEnvelope />
                                </div>
                                <div className={styles.channelMeta}>
                                    <span className={styles.channelLabel}>Email Address</span>
                                    <a href={`mailto:${email}`} className={styles.channelValue}>
                                        {email}
                                    </a>
                                </div>
                            </div>

                            <div className={styles.channelActions}>
                                <a href={`mailto:${email}`} className={styles.actionBtnPrimary}>
                                    <FaEnvelope /> Send Email
                                </a>
                                <button
                                    className={`${styles.actionBtnCopy} ${copiedField === 'email' ? styles.copied : ''}`}
                                    onClick={() => handleCopy(email, 'email')}
                                    title="Copy Email"
                                >
                                    {copiedField === 'email' ? (
                                        <>
                                            <FaCheck style={{ color: '#4ade80' }} /> <span>Copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaCopy /> <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
