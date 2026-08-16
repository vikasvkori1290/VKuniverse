import React, { useState, useEffect } from 'react';
import styles from '../styles/components/Achievements.module.css';
import { FaTimes, FaChevronLeft, FaChevronRight, FaTrophy, FaCode, FaCertificate, FaMedal, FaStar, FaRocket } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import { getFileURL, FALLBACK_IMAGE } from '../utils/urlHelper';

const Achievements = () => {
    const { achievements } = useData();
    const [activeFilter, setActiveFilter] = useState('All');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentImages, setCurrentImages] = useState([]);
    const [activeNodeId, setActiveNodeId] = useState(null);

    // Sort strictly in ASCENDING order of date (earliest -> latest)
    const sortedAchievements = [...achievements]
        .filter(item => activeFilter === 'All' ? true : item.category === activeFilter)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

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

    // Calculate winding S-curve position: Left, Center-Left, Center-Right, Right
    const getNodePositionClass = (index) => {
        const pattern = ['posLeft', 'posCenterLeft', 'posRight', 'posCenterRight'];
        return styles[pattern[index % pattern.length]];
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

                {/* Aesthetic Level Map Road */}
                <div className={styles.levelMapContainer}>
                    {/* Glowing Track Line in Background */}
                    <div className={styles.roadTrackLine} />

                    <div className={styles.roadMapNodes}>
                        {sortedAchievements.map((item, index) => {
                            const levelNumber = String(index + 1).padStart(2, '0');
                            const isLatest = index === sortedAchievements.length - 1;
                            const isSelected = activeNodeId === (item._id || index);

                            return (
                                <div
                                    key={item._id || index}
                                    className={`${styles.mapNodeRow} ${getNodePositionClass(index)} animate-on-scroll`}
                                    onClick={() => setActiveNodeId(isSelected ? null : (item._id || index))}
                                >
                                    {/* Level Node Token */}
                                    <div className={styles.nodeAnchor}>
                                        {/* Player Pin on Latest Level */}
                                        {isLatest && (
                                            <div className={styles.playerPin}>
                                                <div className={styles.playerAvatar}>
                                                    <FaRocket />
                                                </div>
                                                <div className={styles.playerTag}>Current</div>
                                            </div>
                                        )}

                                        {/* Aesthetic Frosted Glass Level Node Token */}
                                        <div className={styles.levelCircle}>
                                            <div className={styles.nodeNumber}>'{levelNumber}</div>
                                            <div className={styles.nodeIcon}>
                                                {getCategoryIcon(item.category)}
                                            </div>
                                        </div>

                                        {/* Subtle Stars */}
                                        <div className={styles.starRow}>
                                            <FaStar className={styles.starIcon} />
                                            <FaStar className={`${styles.starIcon} ${styles.starCenter}`} />
                                            <FaStar className={styles.starIcon} />
                                        </div>
                                    </div>

                                    {/* Aesthetic Level Quest Card */}
                                    <div className={`${styles.questCard} ${isSelected ? styles.cardActive : ''}`}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.cardMeta}>
                                                <span className={styles.levelBadge}>Level {levelNumber}</span>
                                                <span className={styles.categoryBadge}>{item.category || 'Achievement'}</span>
                                            </div>
                                            <div className={styles.cardDate}>
                                                {new Date(item.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>

                                        <h3 className={styles.questTitle}>{item.title}</h3>
                                        <p className={styles.questDesc}>{item.description}</p>

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
                                </div>
                            );
                        })}
                    </div>
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
                        <img 
                            src={currentImage?.url} 
                            alt="Achievement Lightbox" 
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = FALLBACK_IMAGE;
                            }}
                        />
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
