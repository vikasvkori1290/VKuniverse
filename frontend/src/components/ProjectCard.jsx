import React from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import styles from '../styles/components/ProjectCard.module.css';

const ProjectCard = ({ project }) => {
    return (
        <div className={styles.projectCard}>
            <div className={styles.imageContainer}>
                {project.images && project.images.length > 0 ? (
                    <img
                        src={project.images[0].startsWith('http') ? project.images[0] : `http://localhost:5000${project.images[0]}`}
                        alt={project.title}
                        className={styles.projectImage}
                    />
                ) : (
                    <div className={styles.placeholderImage}></div>
                )}
                <div className={`${styles.statusBadge} ${project.status === 'completed' ? styles.statusCompleted : styles.statusInProgress}`}>
                    {project.status === 'completed' ? 'Completed' : 'In Progress'}
                </div>
            </div>

            <div className={styles.cardContent}>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>

                <div className={styles.techStack}>
                    {project.techStack && project.techStack.map((tech, index) => (
                        <span key={index} className={styles.techBadge}>{tech}</span>
                    ))}
                </div>

                <div className={styles.actions}>
                    {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className={`${styles.actionButton} ${styles.liveButton}`}>
                            <FaExternalLinkAlt style={{ marginRight: '5px' }} /> Live Demo
                        </a>
                    )}
                    {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className={`${styles.actionButton} ${styles.githubButton}`}>
                            <FaGithub style={{ marginRight: '5px' }} /> GitHub
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
