import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import styles from '../styles/pages/ProjectDetail.module.css';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/projects/${id}`);
                setProject(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching project:', error);
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

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
                <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
        );
    }

    // Helper function to format image URLs
    const formatImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `http://localhost:5000${url}`;
    };

    // Get screenshots - either from screenshots array or from images array
    const displayScreenshots = project.screenshots?.length > 0
        ? project.screenshots.map(formatImageUrl)
        : project.images?.map(img => formatImageUrl(typeof img === 'object' ? img.url : img)) || [];

    // Debug logging
    console.log('Project:', project);
    console.log('Screenshots:', displayScreenshots);

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
                    <h1 className={styles.title}>{project.title}</h1>
                    <p className={styles.status}>
                        <span className={`${styles.badge} ${styles[project.status]}`}>
                            {project.status}
                        </span>
                    </p>
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
                                    className={styles.carouselImage}
                                />
                                {displayScreenshots.length > 1 && (
                                    <>
                                        <button
                                            className={`${styles.carouselButton} ${styles.prev}`}
                                            onClick={prevImage}
                                            aria-label="Previous image"
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        <button
                                            className={`${styles.carouselButton} ${styles.next}`}
                                            onClick={nextImage}
                                            aria-label="Next image"
                                        >
                                            <FaChevronRight />
                                        </button>
                                        <div className={styles.carouselIndicators}>
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
        </div>
    );
};

export default ProjectDetail;
