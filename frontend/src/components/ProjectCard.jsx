import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt, FaImages, FaVideo, FaHeart, FaCalendarAlt, FaTag } from 'react-icons/fa';
import api from '../services/api';
import { useData } from '../context/DataContext';
import LikeModal from './common/LikeModal';
import styles from '../styles/components/ProjectCard.module.css';
import { getFileURL, FALLBACK_IMAGE } from '../utils/urlHelper';

const ProjectCard = ({ project }) => {
    const { updateProjectLikes } = useData() || {};
    const [likes, setLikes] = useState(project.likes || 0);
    const [hasLiked, setHasLiked] = useState(false);
    const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);

    useEffect(() => {
        setLikes(project.likes || 0);
        const savedName = localStorage.getItem('viewer_name');
        if (savedName && project.likedBy) {
            const already = project.likedBy.some(
                (item) => item.name.toLowerCase() === savedName.toLowerCase()
            );
            setHasLiked(already);
        }
    }, [project.likes, project.likedBy]);

    const handleLikeClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const savedName = localStorage.getItem('viewer_name');
        if (savedName && savedName.trim()) {
            try {
                await handleLikeSubmit(savedName.trim());
            } catch (err) {
                // error handled
            }
        } else {
            setIsLikeModalOpen(true);
        }
    };

    const handleLikeSubmit = async (name) => {
        try {
            const res = await api.post(`/projects/${project._id}/like`, { name });
            if (res.data.likes !== undefined) {
                setLikes(res.data.likes);
                setHasLiked(true);
                if (updateProjectLikes) {
                    updateProjectLikes(project._id, res.data.likes, res.data.likedBy);
                }
            }
        } catch (err) {
            console.error('Project like error:', err);
            throw err;
        }
    };

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

    const techList = (
        Array.isArray(project.techStack)
            ? project.techStack
            : typeof project.techStack === 'string'
            ? project.techStack.split(',')
            : Array.isArray(project.technologies)
            ? project.technologies
            : typeof project.technologies === 'string'
            ? project.technologies.split(',')
            : []
    ).map(t => t.trim()).filter(Boolean);

    const formattedDate = project.date || project.createdAt
        ? new Date(project.date || project.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        })
        : null;

    return (
        <>
            <Link
                to={`/projects/${project._id}`}
                className={`${styles.projectCard} animate-on-scroll`}
            >
                {/* Framed Inset Image/Media Container */}
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

                    {/* Status Pill (Sleek Glass chip) */}
                    <div className={`${styles.statusBadge} ${project.status === 'completed' ? styles.statusCompleted : styles.statusInProgress}`}>
                        <span className={styles.statusDot} />
                        {project.status === 'completed' ? 'Completed' : 'In Progress'}
                    </div>

                    {/* Like Pill on Image Corner */}
                    <button
                        type="button"
                        onClick={handleLikeClick}
                        className={`${styles.cardLikeBadge} ${hasLiked ? styles.cardLikeActive : ''}`}
                        title="Like this project"
                        aria-label="Like project"
                    >
                        <FaHeart className={styles.heartIcon} />
                        <span>{likes}</span>
                    </button>

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

                {/* Minimalist Card Body */}
                <div className={styles.cardContent}>
                    {/* Header: Title */}
                    <h3 className={styles.title}>{project.title}</h3>

                    {/* Meta Info Row */}
                    <div className={styles.metaRow}>
                        {formattedDate && (
                            <span className={styles.metaItem}>
                                <FaCalendarAlt className={styles.metaIcon} /> {formattedDate}
                            </span>
                        )}
                        {project.category && (
                            <span className={styles.metaItem}>
                                <FaTag className={styles.metaIcon} /> {project.category}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className={styles.description}>{project.description}</p>

                    {/* Tech Stack Pills (Reference Tag style) */}
                    {techList.length > 0 && (
                        <div className={styles.techTags}>
                            {techList.slice(0, 5).map((tech, idx) => (
                                <span
                                    key={idx}
                                    className={`${styles.techTag} ${styles[`tagColor${idx % 4}`] || ''}`}
                                >
                                    {tech}
                                </span>
                            ))}
                            {techList.length > 5 && (
                                <span className={styles.techMoreTag}>+{techList.length - 5}</span>
                            )}
                        </div>
                    )}

                    {/* Sleek Action Buttons */}
                    <div className={styles.actions}>
                        {project.liveLink && (
                            <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.actionButton} ${styles.liveButton}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FaExternalLinkAlt className={styles.btnIcon} />
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
                                <FaGithub className={styles.btnIcon} />
                                <span>GitHub</span>
                            </a>
                        )}
                    </div>
                </div>
            </Link>

            <LikeModal
                isOpen={isLikeModalOpen}
                onClose={() => setIsLikeModalOpen(false)}
                onLike={handleLikeSubmit}
                title="Like This Project"
                itemName={`"${project.title}"`}
            />
        </>
    );
};

export default ProjectCard;
