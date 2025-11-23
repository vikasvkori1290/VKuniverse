import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import styles from '../styles/components/Projects.module.css';
import api from '../services/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    // Mock data
    const mockProjects = [
        {
            _id: '1',
            title: 'E-Commerce Dashboard',
            description: 'A comprehensive dashboard for managing online stores with real-time analytics and inventory management.',
            techStack: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
            status: 'completed',
            liveLink: '#',
            githubLink: '#',
            images: []
        },
        {
            _id: '2',
            title: 'AI Image Generator',
            description: 'An application that uses OpenAI API to generate images from text prompts with a gallery showcase.',
            techStack: ['React', 'OpenAI API', 'Express', 'Tailwind'],
            status: 'in-progress',
            liveLink: '#',
            githubLink: '#',
            images: []
        },
        {
            _id: '3',
            title: 'Task Management App',
            description: 'A collaborative task manager with real-time updates, drag-and-drop interface, and team features.',
            techStack: ['Vue.js', 'Firebase', 'Vuex'],
            status: 'completed',
            liveLink: '#',
            githubLink: '#',
            images: []
        }
    ];

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setProjects(mockProjects);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjects(mockProjects);
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
