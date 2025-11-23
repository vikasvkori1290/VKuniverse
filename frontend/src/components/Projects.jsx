import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import styles from '../styles/components/Projects.module.css';
import api from '../services/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await api.get('/projects');
                setProjects(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(project => project.techStack.includes(filter) || project.status === filter.toLowerCase());

    const allTechs = ['All', 'React', 'Node.js', 'MongoDB', 'Completed', 'In-Progress'];

    return (
        <section className={styles.projectsSection} id="projects">
            <div className={styles.container}>
                <div className={`${styles.sectionHeader} animate-on-scroll`}>
                    <h2 className={styles.title}>Featured Projects</h2>
                    <p className={styles.subtitle}>A selection of my recent work and side projects.</p>
                </div>

                <div className={`${styles.filters} animate-on-scroll animate-delay-1`}>
                    {allTechs.map(tech => (
                        <button
                            key={tech}
                            className={`${styles.filterButton} ${filter === tech ? styles.active : ''}`}
                            onClick={() => setFilter(tech)}
                        >
                            {tech}
                        </button>
                    ))}
                </div>

                <div className={styles.projectsGrid}>
                    {filteredProjects.map((project, index) => (
                        <div key={project._id} className={`animate-on-scroll animate-delay-${(index % 3) + 1}`}>
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
