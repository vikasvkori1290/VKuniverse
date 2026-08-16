import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt, FaImages, FaVideo } from 'react-icons/fa';
import styles from '../styles/components/ProjectCard.module.css';
import { getFileURL, FALLBACK_IMAGE } from '../utils/urlHelper';

const ProjectCard = ({ project }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getThumbnailUrl = () => {
        if (!project.images || project.images.length === 0) return null;

        if (typeof project.images[0] === 'object') {
            const thumbnail = project.images.find(img => img.isThumbnail) || project.images[0];
            return getFileURL(thumbnail.url);
        }

        return getFileURL(project.images[0]);
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
                        src={getFileURL(project.video)}
                        className={styles.projectImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="none"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                ) : thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={project.title}
                        className={styles.projectImage}
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                        }}
                    />
                ) : (
                    <div className={styles.placeholderImage}>
                        <span>{project.title.charAt(0)}</span>
                    </div>
                )}

                {/* Subtle Status Pill */}
                <div className={`${styles.statusBadge} ${project.status === 'completed' ? styles.statusCompleted : styles.statusInProgress}`}>
                    {project.status === 'completed' ? '✓ Completed' : '⏱ In Progress'}
                </div>

                {/* Media Indicator */}
                {imageCount > 1 && !project.video && (
                    <div className={styles.mediaBadge}>
                        <FaImages /> {imageCount}
                    </div>
                )}

                {project.video && (
                    <div className={styles.mediaBadge}>
                        <FaVideo />
                    </div>
                )}
            </div>

            <div className={styles.cardContent}>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>

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
