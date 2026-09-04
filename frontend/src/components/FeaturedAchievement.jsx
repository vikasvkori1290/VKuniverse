import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaArrowRight, FaRocket, FaAward, FaCalendarAlt, FaTimes, FaCoins, FaUsers } from 'react-icons/fa';
import { useData } from '../context/DataContext';
import { getFileURL, FALLBACK_IMAGE } from '../utils/urlHelper';
import styles from '../styles/components/FeaturedAchievement.module.css';

const DEFAULT_FEATURED = {
    _id: "6a9970ecb5ae6853738b7318",
    title: "Comeback 2026 ~Codefury-9.0",
    description: "Last year in CodeFury 8.0, our team reached the second round (participation certificate is in the Achievements section). In CodeFury 9.0, we as ZENFORGE made a strong comeback and secured 2nd Runner-Up with a ₹10,000 cash prize through hard work, consistency, and dedication. Special thanks to my teammates Yashwanth and Gagana. Our winning project FORGE is showcased in the Projects section.",
    category: "Hackathon",
    date: "2026-07-31T18:30:00.000Z",
    images: [
        {
            url: "https://res.cloudinary.com/dyt3yinho/image/upload/v1788440383/vk_portfolio/images/coypqzsll76lo7g2hodv.png",
            isThumbnail: true
        },
        {
            url: "https://res.cloudinary.com/dyt3yinho/image/upload/v1788440473/vk_portfolio/images/oqshvn7zm5pn8bgacmho.jpg",
            isThumbnail: false
        }
    ]
};

const FeaturedAchievement = () => {
    const { achievements, loadingAchievements } = useData();
    const [lightboxImg, setLightboxImg] = useState(null);

    const item = (achievements && achievements.find(a =>
        a.title?.toLowerCase().includes('codefury-9.0') ||
        a.title?.toLowerCase().includes('comeback 2026')
    )) || DEFAULT_FEATURED;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setLightboxImg(null);
        };
        if (lightboxImg) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [lightboxImg]);

    if (loadingAchievements && !item) return null;

    const formattedDate = new Date(item.date || '2026-08-01').toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });

    const cleanDescription = (item.description || '')
        .replace(/^Winning certificate will be uploaded soon!?\s*/i, '')
        .replace(/Winning certificate will be uploaded soon!?\s*/gi, '')
        .trim();

    return (
        <section className={styles.featuredSection} id="featured-achievement">
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.title}>
                        <FaTrophy className={styles.titleIcon} /> Featured Milestone
                    </h2>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardContent}>
                        {/* Meta Tags */}
                        <div className={styles.metaRow}>
                            <span className={styles.categoryBadge}>
                                <FaAward /> {item.category || 'Hackathon'}
                            </span>
                            <span className={styles.prizeBadge}>
                                <FaCoins /> 2nd Runner Up (₹10,000 Prize)
                            </span>
                            <span className={styles.teamBadge}>
                                <FaUsers /> ZENFORGE
                            </span>
                            <span className={styles.dateBadge}>
                                <FaCalendarAlt /> {formattedDate}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className={styles.cardTitle}>{item.title}</h3>

                        {/* Description */}
                        <p className={styles.description}>
                            {cleanDescription}
                        </p>

                        {/* Actions */}
                        <div className={styles.actions}>
                            <Link to="/projects" className={styles.primaryBtn}>
                                <FaRocket /> View Project FORGE
                            </Link>
                            <Link to="/achievements" className={styles.secondaryBtn}>
                                All Achievements <FaArrowRight />
                            </Link>
                        </div>
                    </div>

                    {/* Image Thumbnails */}
                    {item.images && item.images.length > 0 && (
                        <div className={styles.cardImages}>
                            {item.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={styles.thumbWrapper}
                                    onClick={() => setLightboxImg(getFileURL(img.url))}
                                    title="Click to zoom certificate"
                                >
                                    <img
                                        src={getFileURL(img.url)}
                                        alt={`Milestone ${idx + 1}`}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = FALLBACK_IMAGE;
                                        }}
                                    />
                                    <div className={styles.thumbOverlay}>Preview 🔍</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Full-size Lightbox */}
            {lightboxImg && (
                <div className={styles.lightboxOverlay} onClick={() => setLightboxImg(null)}>
                    <button className={styles.lightboxClose} onClick={() => setLightboxImg(null)}>
                        <FaTimes />
                    </button>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <img src={lightboxImg} alt="Enlarged" className={styles.lightboxImage} />
                    </div>
                </div>
            )}
        </section>
    );
};

export default FeaturedAchievement;
