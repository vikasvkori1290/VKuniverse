import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt, FaImages, FaVideo } from 'react-icons/fa';
import styles from '../styles/components/ProjectCard.module.css';

const ProjectCard = ({ project }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Get thumbnail image
    const getThumbnailUrl = () => {
        if (!project.images || project.images.length === 0) return null;

        // Check for new format (array of objects)
        if (typeof project.images[0] === 'object') {
            const thumbnail = project.images.find(img => img.isThumbnail) || project.images[0];
            const url = thumbnail.url;
            return url.startsWith('http') ? url : `http://localhost:5000${url}`;
        }

        // Fallback for old format (array of strings)
        const url = project.images[0];
        return url.startsWith('http') ? url : `http://localhost:5000${url}`;
    };

    const thumbnailUrl = getThumbnailUrl();
    const imageCount = project.images?.length || 0;

    return (
        <Link
            to={`/projects/${project._id}`}
            className={`${styles.projectCard} animate-on-scroll`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={styles.imageContainer}>
                {project.video ? (
                    <video
                        src={project.video.startsWith('http') ? project.video : `http://localhost:5000${project.video}`}
                        className={styles.projectImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ objectFit: 'cover' }}
                    />
                ) : thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={project.title}
                        className={styles.projectImage}
                    />
                ) : (
                    <div className={styles.placeholderImage}>
                        <span>{project.title.charAt(0)}</span>
                    </div>
                )}

                {/* Overlay on hover - Only show for images, not videos */}
                {!project.video && (
                    <div className={`${styles.overlay} ${isHovered ? styles.visible : ''}`}>
                        <div className={styles.overlayContent}>
                            <p className={styles.overlayText}>{project.description}</p>
                        </div>
                    </div>
                )}

                {/* Status Badge */}
                <div className={`${styles.statusBadge} ${project.status === 'completed' ? styles.statusCompleted : styles.statusInProgress}`}>
                    {project.status === 'completed' ? '✓ Completed' : '⏱ In Progress'}
                </div>

                {/* Multiple Images Indicator */}
                {imageCount > 1 && !project.video && (
                    <div className={styles.imageCountBadge}>
                        <FaImages /> {imageCount}
                    </div>
                )}

                {/* Video Indicator */}
                {project.video && (
                    <div className={styles.imageCountBadge}>
                        <FaVideo />
                    </div>
                )}
            </div>

            <div className={styles.cardContent}>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>

                {/* Tech Stack with enhanced styling */}
                <div className={styles.techStack}>
                    {project.techStack && project.techStack.map((tech, index) => (
                        <span
                            key={index}
                            className={styles.techBadge}
                            title={tech}
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    {project.liveLink && (
                        <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.actionButton} ${styles.liveButton}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaExternalLinkAlt />
                            <span>Live Demo</span>
                        </a>
                    )}
                    {project.githubLink && (
                        <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.actionButton} ${styles.githubButton}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FaGithub />
                            <span>GitHub</span>
                        </a>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;
