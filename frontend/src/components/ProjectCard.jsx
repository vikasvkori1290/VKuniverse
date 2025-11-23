import React, { useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import styles from '../styles/components/ProjectCard.module.css';

const ProjectCard = ({ project }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`${styles.projectCard} animate-on-scroll`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={styles.imageContainer}>
                {project.images && project.images.length > 0 ? (
                    <img
                        src={project.images[0].startsWith('http') ? project.images[0] : `http://localhost:5000${project.images[0]}`}
                        alt={project.title}
                        className={styles.projectImage}
                    />
                ) : (
                    <div className={styles.placeholderImage}>
                        <span>{project.title.charAt(0)}</span>
                    </div>
                )}

                {/* Overlay on hover */}
                <div className={`${styles.overlay} ${isHovered ? styles.visible : ''}`}>
                    <div className={styles.overlayContent}>
                        <p className={styles.overlayText}>{project.description}</p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`${styles.statusBadge} ${project.status === 'completed' ? styles.statusCompleted : styles.statusInProgress}`}>
                    {project.status === 'completed' ? '✓ Completed' : '⏱ In Progress'}
                </div>
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
                        >
                            <FaGithub />
                            <span>GitHub</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
