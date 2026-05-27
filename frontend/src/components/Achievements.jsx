import React, { useState } from 'react';
import styles from '../styles/components/Achievements.module.css';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import { getFileURL, FALLBACK_IMAGE } from '../utils/urlHelper';

const Achievements = () => {
    const { achievements } = useData();
    const [activeFilter, setActiveFilter] = useState('All');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentImages, setCurrentImages] = useState([]);

    const filteredAchievements = achievements.filter(item =>
        activeFilter === 'All' ? true : item.category === activeFilter
    );

    // Handle keyboard navigation
    React.useEffect(() => {
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
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
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

    const renderCollage = (images, layout) => {
        if (!images || images.length === 0) return null;

        // Ensure URLs are correct
        const processedImages = images.map(img => ({
            ...img,
            url: getFileURL(img.url)
        }));

        return (
            <div className={`${styles.collage} ${styles[layout || 'grid']}`}>
                {processedImages.map((img, idx) => (
                    <div
                        key={idx}
                        className={styles.collageItem}
                        onClick={() => openLightbox(images, idx)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img 
                            src={img.url} 
                            alt={`Achievement ${idx}`} 
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = FALLBACK_IMAGE;
                            }}
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section className={styles.achievementsSection} id="achievements">
            <div className={styles.container}>
                <div className={`${styles.sectionHeader} animate-on-scroll`}>
                    <h2 className={styles.title}>Achievements</h2>
                    <p className={styles.subtitle}>Milestones and recognitions along my journey.</p>
                </div>

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

                <div className={styles.timeline}>
                    {filteredAchievements.map((item, index) => (
                        <div key={item._id || index} className={`${styles.timelineItem} animate-on-scroll animate-delay-${index + 1}`}>
                            <div className={styles.timelineDot}></div>
                            <div className={styles.timelineContent}>
                                <span className={styles.date}>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                                <h3 className={styles.itemTitle}>{item.title}</h3>
                                <span className={styles.category}>{item.category}</span>
                                <p className={styles.description}>{item.description}</p>

                                {/* Image Collage */}
                                {item.images && item.images.length > 0 && renderCollage(item.images, item.collageLayout)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div className={styles.lightbox} onClick={closeLightbox}>
                    <button className={styles.closeBtn} onClick={closeLightbox}>
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
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                className={`${styles.navBtn} ${styles.nextBtn}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateImage(1);
                                }}
                            >
                                <FaChevronRight />
                            </button>
                        </>
                    )}

                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={currentImage?.url} 
                            alt="Achievement" 
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
