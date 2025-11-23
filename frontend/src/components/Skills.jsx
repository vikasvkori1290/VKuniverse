import React from 'react';
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJs, FaDatabase, FaGitAlt, FaDocker } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiTailwindcss, SiTypescript } from 'react-icons/si';
import SkillCard from './SkillCard';
import api from '../services/api';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/components/Skills.module.css';

const Skills = () => {
    useScrollAnimation({ threshold: 0.1 });

    const [skills, setSkills] = React.useState([]);

    React.useEffect(() => {
        const fetchSkills = async () => {
            try {
                const { data } = await api.get('/skills');
                setSkills(data);
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };
        fetchSkills();
    }, []);

    return (
        <section className={styles.skillsSection} id="skills">
            <div className="container">
                <div className={`${styles.sectionHeader} animate-on-scroll`}>
                    <h2 className={styles.title}>Technical Skills</h2>
                    <p className={styles.subtitle}>My expertise in the modern web development stack</p>
                </div>

                <div className={styles.skillsGrid}>
                    {skills.map((skill, index) => (
                        <div
                            key={index}
                            className="animate-on-scroll"
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <SkillCard {...skill} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
