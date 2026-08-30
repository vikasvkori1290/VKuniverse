import React, { useEffect } from 'react';
import ProjectCard from './ProjectCard';
import styles from '../styles/components/Projects.module.css';
import { useData } from '../context/DataContext';

const Projects = () => {
    const { projects, refreshProjects } = useData();

    useEffect(() => {
        if (refreshProjects) {
            refreshProjects();
        }
    }, [refreshProjects]);

    return (
        <section className={styles.projectsSection} id="projects">
            <div className={styles.container}>
                <div className={`${styles.sectionHeader} animate-on-scroll`}>
                    <h2 className={styles.title}>Featured Projects</h2>
                    <p className={styles.subtitle}>A curated showcase of applications, systems, and creative engineering.</p>
                </div>

                <div className={styles.projectsGrid}>
                    {projects.map((project, index) => (
                        <div key={project._id || index} className={`animate-on-scroll animate-delay-${(index % 3) + 1}`}>
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
