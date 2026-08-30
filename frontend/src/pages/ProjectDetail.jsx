import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useData } from '../context/DataContext';
import LikeModal from '../components/common/LikeModal';
import styles from '../styles/pages/ProjectDetail.module.css';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaChevronLeft, FaChevronRight, FaHeart } from 'react-icons/fa';
import { getFileURL, FALLBACK_IMAGE } from '../utils/urlHelper';

const ProjectDetail = () => {
    const { updateProjectLikes } = useData() || {};
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/projects/${id}`);
                setProject(response.data);

                const savedName = localStorage.getItem('viewer_name');
                if (savedName && response.data.likedBy) {
                    const already = response.data.likedBy.some(
                        (item) => item.name.toLowerCase() === savedName.toLowerCase()
                    );
                    setHasLiked(already);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching project:', error);
                setLoading(false);
            }
        };

        fetchProject();
        window.scrollTo(0, 0);
    }, [id]);

    const handleLikeClick = async () => {
        const savedName = localStorage.getItem('viewer_name');
        if (savedName && savedName.trim()) {
            try {
                await handleLikeSubmit(savedName.trim());
            } catch (err) {
                // handled in toast
            }
        } else {
            setIsLikeModalOpen(true);
        }
    };

    const handleLikeSubmit = async (name) => {
        if (!project) return;
        try {
            const res = await api.post(`/projects/${project._id}/like`, { name });
            if (res.data.likes !== undefined) {
                setProject((prev) => ({
                    ...prev,
                    likes: res.data.likes,
                    likedBy: res.data.likedBy || prev.likedBy
                }));
                setHasLiked(true);
                if (updateProjectLikes) {
                    updateProjectLikes(project._id, res.data.likes, res.data.likedBy);
                }
                setToast(`Thanks for liking, ${name}! ❤️`);
                setTimeout(() => setToast(''), 3500);
            }
        } catch (err) {
            const errMsg = err.response?.data?.error || err.message || 'Already liked or error occurred';
            setToast(errMsg);
            setTimeout(() => setToast(''), 3500);
            throw err;
        }
    };

    const nextImage = () => {
        if (displayScreenshots.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === displayScreenshots.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (displayScreenshots.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? displayScreenshots.length - 1 : prev - 1
            );
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading project...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className={styles.notFound}>
                <h2>Project Not Found</h2>
                <Link to="/projects" className="btn btn-primary">Back to Projects</Link>
            </div>
        );
    }

    // Helper function to format image URLs
    const formatImageUrl = (url) => {
        return getFileURL(url);
    };

    // Get screenshots - either from screenshots array or from images array
    const displayScreenshots = project.screenshots?.length > 0
        ? project.screenshots.map(formatImageUrl)
        : project.images?.map(img => formatImageUrl(typeof img === 'object' ? img.url : img)) || [];

    return (
        <div className={styles.projectDetail}>
            <div className="container">
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    <FaArrowLeft /> Back
                </button>
            </div>

            {/* Hero Section */}
            <div className={styles.hero}>
                <div className="container">
                    <div className={styles.heroHeader}>
                        <div>
                            <h1 className={styles.title}>{project.title}</h1>
                            <p className={styles.status}>
                                <span className={`${styles.badge} ${styles[project.status]}`}>
                                    {project.status === 'completed' ? '✓ Completed' : '⏱ In Progress'}
                                </span>
                            </p>
                        </div>

                        {/* Interactive Project Like Button */}
                        <button
                            type="button"
                            onClick={handleLikeClick}
                            className={`${styles.projectLikeBtn} ${hasLiked ? styles.likedActive : ''}`}
                            title="Like this project"
                        >
                            <FaHeart className={styles.heartIcon} />
                            <span>{project.likes || 0} {project.likes === 1 ? 'Like' : 'Likes'}</span>
                        </button>
                    </div>

                    {toast && <div className={styles.toast}>{toast}</div>}
                </div>
            </div>

            <div className="container">
                <div className={styles.content}>
                    {/* Main Image / Carousel */}
                    {displayScreenshots.length > 0 && (
                        <div className={styles.carousel}>
                            <div className={styles.carouselContainer}>
                                <img
                                    src={displayScreenshots[currentImageIndex]}
                                    alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                                    className={styles.mainImage}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = FALLBACK_IMAGE;
                                    }}
                                />

                                {displayScreenshots.length > 1 && (
                                    <>
                                        <button
                                            className={`${styles.navButton} ${styles.prevButton}`}
                                            onClick={prevImage}
                                            aria-label="Previous image"
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        <button
                                            className={`${styles.navButton} ${styles.nextButton}`}
                                            onClick={nextImage}
                                            aria-label="Next image"
                                        >
                                            <FaChevronRight />
                                        </button>

                                        <div className={styles.indicators}>
                                            {displayScreenshots.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`${styles.indicator} ${index === currentImageIndex ? styles.active : ''}`}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    aria-label={`Go to image ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className={styles.description}>
                        <h2>About This Project</h2>
                        <p>{project.description}</p>
                    </div>

                    {/* Tech Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                        <div className={styles.techStack}>
                            <h2>Tech Stack</h2>
                            <div className={styles.techBadges}>
                                {project.techStack.map((tech, index) => (
                                    <span key={index} className={styles.techBadge}>
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA Buttons */}
                    <div className={styles.actions}>
                        {(project.liveDemoUrl || project.liveLink) && (
                            <a
                                href={project.liveDemoUrl || project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`btn btn-primary ${styles.actionBtn}`}
                            >
                                <FaExternalLinkAlt /> Live Demo
                            </a>
                        )}
                        {(project.sourceCodeUrl || project.githubLink) && (
                            <a
                                href={project.sourceCodeUrl || project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`btn btn-secondary ${styles.actionBtn}`}
                            >
                                <FaGithub /> Source Code
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Like Modal Popup */}
            <LikeModal
                isOpen={isLikeModalOpen}
                onClose={() => setIsLikeModalOpen(false)}
                onLike={handleLikeSubmit}
                title="Like This Project"
                itemName={`"${project.title}"`}
            />
        </div>
    );
};

export default ProjectDetail;
