import React from 'react';
import styles from '../styles/components/SkillCard.module.css';

const SkillCard = ({ name, icon, level, description, percentage }) => {
    return (
        <div className={styles.skillCard}>
            <div className={styles.inner}>
                {/* Front Side */}
                <div className={styles.front}>
                    <div className={styles.icon}>{icon}</div>
                    <h3 className={styles.name}>{name}</h3>
                </div>

                {/* Back Side */}
                <div className={styles.back}>
                    <div className={styles.level}>{level}</div>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.progressContainer}>
                        <div
                            className={styles.progressBar}
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillCard;
