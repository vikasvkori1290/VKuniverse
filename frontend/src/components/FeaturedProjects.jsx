import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import api from '../services/api';
import { getFileURL } from '../utils/urlHelper';
import styles from '../styles/components/FeaturedProjects.module.css';

const FeaturedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await api.get('/projects');
                // Get top 3 projects
                setProjects(data.slice(0, 3));
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading projects...</div>;
    }

    return (
        <section className={styles.featuredSection}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <h2 className={styles.title}>Featured Projects</h2>
                    <p className={styles.subtitle}>Some of my recent work</p>
                </div>

                <div className={styles.projectsGrid}>
                    {projects.map((project, index) => {
                        const thumbnail = project.images?.find(img => img.isThumbnail)?.url || project.images?.[0]?.url || project.images?.[0] || '';

                        return (
                            <div key={project._id || index} className={styles.projectCard}>
                                <div className={styles.imageWrapper}>
                                    {thumbnail && (
                                        <img
                                            src={getFileURL(thumbnail)}
                                            alt={project.title}
                                            className={styles.projectImage}
                                        />
                                    )}
                                    <div className={styles.overlay}>
                                        <div className={styles.links}>
                                            {project.githubLink && (
                                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                                                    <FaGithub />
                                                </a>
                                            )}
                                            {project.liveLink && (
                                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
                                                    <FaExternalLinkAlt />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.content}>
                                    <h3 className={styles.projectTitle}>{project.title}</h3>
                                    <p className={styles.description}>{project.description}</p>
                                    <div className={styles.technologies}>
                                        {project.technologies?.slice(0, 3).map((tech, i) => (
                                            <span key={i} className={styles.tech}>{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.viewAllContainer}>
                    <Link to="/projects" className="btn btn-secondary">
                        View All Projects <FaArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProjects;
