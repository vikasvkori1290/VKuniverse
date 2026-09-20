import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import styles from '../styles/pages/ResumePreviewPage.module.css';
import { FaArrowLeft, FaFileDownload, FaExternalLinkAlt, FaEye } from 'react-icons/fa';

const ResumePreviewPage = () => {
    const navigate = useNavigate();
    const resumeUrl = "/vikas%20v's%20resume.pdf";

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            
            <main className={styles.mainContent}>
                <div className="container">
                    {/* Top Action & Navigation Bar */}
                    <div className={styles.topBar}>
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)} 
                            className={styles.backBtn}
                            aria-label="Go Back"
                        >
                            <FaArrowLeft /> Back
                        </button>

                        <div className={styles.actionButtons}>
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.externalBtn}
                                title="Open in New Tab"
                            >
                                <FaExternalLinkAlt /> <span>Open in Tab</span>
                            </a>
                            <a
                                href={resumeUrl}
                                download="Vikas_V_Resume.pdf"
                                className={styles.downloadBtn}
                                title="Download PDF"
                            >
                                <FaFileDownload /> <span>Download PDF</span>
                            </a>
                        </div>
                    </div>

                    {/* Page Header */}
                    <div className={styles.header}>
                        <div className={styles.badge}>
                            <FaEye className={styles.badgeIcon} />
                            <span>Document Preview</span>
                        </div>
                        <h1 className={styles.title}>Vikas V — Resume</h1>
                        <p className={styles.subtitle}>
                            Full-Stack Developer & Problem Solver • Bangalore, India
                        </p>
                    </div>

                    {/* PDF Viewer Container */}
                    <div className={styles.viewerCard}>
                        <div className={styles.viewerHeader}>
                            <div className={styles.windowControls}>
                                <span className={`${styles.dot} ${styles.dotRed}`}></span>
                                <span className={`${styles.dot} ${styles.dotYellow}`}></span>
                                <span className={`${styles.dot} ${styles.dotGreen}`}></span>
                            </div>
                            <span className={styles.viewerTitle}>vikas_v_resume.pdf</span>
                            <div className={styles.headerSpacer}></div>
                        </div>

                        <div className={styles.pdfContainer}>
                            <object
                                data={`${resumeUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                                type="application/pdf"
                                className={styles.pdfObject}
                            >
                                <iframe
                                    src={`${resumeUrl}#toolbar=1`}
                                    title="Vikas V Resume"
                                    className={styles.pdfIframe}
                                >
                                    <div className={styles.fallbackNotice}>
                                        <p>Your browser does not support inline PDF viewing.</p>
                                        <a
                                            href={resumeUrl}
                                            download="Vikas_V_Resume.pdf"
                                            className={styles.downloadBtn}
                                        >
                                            <FaFileDownload /> Download Resume
                                        </a>
                                    </div>
                                </iframe>
                            </object>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <ScrollToTop />
        </div>
    );
};

export default ResumePreviewPage;
