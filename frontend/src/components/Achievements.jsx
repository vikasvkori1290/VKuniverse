import React, { useState, useEffect } from 'react';
import styles from '../styles/components/Achievements.module.css';
import { FaTimes, FaChevronLeft, FaChevronRight, FaTrophy, FaCode, FaCertificate, FaMedal, FaStar, FaCalendarAlt } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import { getFileURL, FALLBACK_IMAGE } from '../utils/urlHelper';

const Achievements = () => {
    const { achievements } = useData();
    const [activeFilter, setActiveFilter] = useState('All');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentImages, setCurrentImages] = useState([]);

    // Sort strictly in DESCENDING order of date (latest / most recent -> earliest)
    const sortedAchievements = [...achievements]
        .filter(item => activeFilter === 'All' ? true : item.category === activeFilter)
        .sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));

    // Handle keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateImage(-1);
            } else if (e.key === 'ArrowRight') {
                navigateImage(1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, currentImageIndex, currentImages]);

    const openLightbox = (images, index) => {
        const processedImages = images.map(img => ({
            ...img,
            url: getFileURL(img.url)
        }));
        setCurrentImages(processedImages);
        setCurrentImageIndex(index);
        setCurrentImage(processedImages[index]);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setCurrentImage(null);
        setCurrentImages([]);
        setCurrentImageIndex(0);
        document.body.style.overflow = 'auto';
    };

    const navigateImage = (direction) => {
        const newIndex = (currentImageIndex + direction + currentImages.length) % currentImages.length;
        setCurrentImageIndex(newIndex);
        setCurrentImage(currentImages[newIndex]);
    };

    const getCategoryIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'hackathon':
                return <FaTrophy />;
            case 'leetcode':
                return <FaCode />;
            case 'certification':
                return <FaCertificate />;
            case 'award':
                return <FaMedal />;
            default:
                return <FaStar />;
        }
    };

    return (
        <section className={styles.achievementsSection} id="achievements">
            <div className={styles.container}>
                {/* Clean Aesthetic Header */}
                <div className={`${styles.sectionHeader} animate-on-scroll`}>
                    <h2 className={styles.title}>Achievements & Milestones</h2>
                    <p className={styles.subtitle}>
                        Chronological journey through competitions, coding milestones, and recognitions.
                    </p>
                </div>

                {/* Filter Controls */}
                <div className={styles.filterContainer}>
                    {['All', 'Hackathon', 'LeetCode', 'Certification', 'Award'].map(filter => (
                        <button
                            key={filter}
                            className={`${styles.filterBtn} ${activeFilter === filter ? styles.active : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Minimalist Achievements List */}
                <div className={styles.achievementsList}>
                    {sortedAchievements.map((item, index) => {
                        const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                        });

                        const cleanDescription = (item.description || '')
                            .replace(/^Winning certificate will be uploaded soon!?\s*/i, '')
                            .replace(/Winning certificate will be uploaded soon!?\s*/gi, '')
                            .trim();

                        return (
                            <div
                                key={item._id || index}
                                className={`${styles.achievementCard} animate-on-scroll`}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.cardMeta}>
                                        <span className={styles.categoryBadge}>
                                            {getCategoryIcon(item.category)} {item.category || 'Achievement'}
                                        </span>
                                    </div>
                                    <div className={styles.cardDate}>
                                        <FaCalendarAlt className={styles.dateIcon} /> {formattedDate}
                                    </div>
                                </div>

                                <h3 className={styles.cardTitle}>{item.title}</h3>
                                <p className={styles.cardDesc}>{cleanDescription}</p>

                                {/* Certificate / Image preview collage */}
                                {item.images && item.images.length > 0 && (
                                    <div className={styles.collageGrid}>
                                        {item.images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className={styles.collageThumb}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openLightbox(item.images, idx);
                                                }}
                                                title="Click to view full certificate"
                                            >
                                                <img
                                                    src={getFileURL(img.url)}
                                                    alt={`Certificate ${idx + 1}`}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = FALLBACK_IMAGE;
                                                    }}
                                                />
                                                <div className={styles.thumbOverlay}>
                                                    <span>Preview 🔍</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div className={styles.lightbox} onClick={closeLightbox}>
                    <button className={styles.closeBtn} onClick={closeLightbox} aria-label="Close Lightbox">
                        <FaTimes />
                    </button>

                    {currentImages.length > 1 && (
                        <>
                            <button
                                className={`${styles.navBtn} ${styles.prevBtn}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateImage(-1);
                                }}
                                aria-label="Previous image"
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                className={`${styles.navBtn} ${styles.nextBtn}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateImage(1);
                                }}
                                aria-label="Next image"
                            >
                                <FaChevronRight />
                            </button>
                        </>
                    )}

                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        {currentImage && (
                            <img
                                src={currentImage.url}
                                alt="Certificate"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = FALLBACK_IMAGE;
                                }}
                            />
                        )}
                        {currentImages.length > 1 && (
                            <div className={styles.imageCounter}>
                                {currentImageIndex + 1} / {currentImages.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Achievements;
