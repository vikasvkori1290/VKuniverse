import React from 'react';
import styles from '../styles/components/Skills.module.css';

const Skills = () => {
    const skillCategories = [
        {
            title: 'Frontend',
            skills: [
                { name: 'React', level: 90 },
                { name: 'JavaScript (ES6+)', level: 85 },
                { name: 'HTML5/CSS3', level: 95 },
                { name: 'Redux', level: 80 },
                { name: 'Next.js', level: 75 }
            ]
        },
        {
            title: 'Backend',
            skills: [
                { name: 'Node.js', level: 85 },
                { name: 'Express', level: 85 },
                { name: 'MongoDB', level: 80 },
                { name: 'REST APIs', level: 90 },
                { name: 'GraphQL', level: 70 }
            ]
        },
        {
            title: 'Tools & Others',
            skills: [
                { name: 'Git/GitHub', level: 90 },
                { name: 'Docker', level: 65 },
                { name: 'AWS', level: 60 },
                { name: 'Figma', level: 75 },
                { name: 'Agile/Scrum', level: 85 }
            ]
        }
    ];

    return (
        <section className={styles.skillsSection} id="skills">
            <div className="container">
                <div className={`${styles.sectionHeader} animate-on-scroll`}>
                    <h2 className={styles.title}>Technical Skills</h2>
                    <p className={styles.subtitle}>My proficiency in various technologies and tools.</p>
                </div>

                <div className={styles.skillsGrid}>
                    {skillCategories.map((category, index) => (
                        <div key={index} className={`${styles.skillCategory} animate-on-scroll animate-delay-${index + 1}`}>
                            <h3 className={styles.categoryTitle}>{category.title}</h3>
                            <div className={styles.skillList}>
                                {category.skills.map((skill, idx) => (
                                    <div key={idx} className={styles.skillItem}>
                                        <div className={styles.skillInfo}>
                                            <span className={styles.skillName}>{skill.name}</span>
                                            <span className={styles.skillLevel}>{skill.level}%</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${skill.level}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
