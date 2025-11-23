import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import styles from '../styles/components/SkillCard.module.css';

const SkillCard = ({ name, icon, iconUrl, level, description, percentage }) => {

    const renderIcon = () => {
        // 1. Prefer iconUrl (SVG from CDN)
        if (iconUrl) {
            return <img src={iconUrl} alt={name} className={styles.iconImage} />;
        }

        // 2. Fallback to icon string (e.g. "FaReact")
        if (icon && typeof icon === 'string') {
            // Check if it's a URL (custom upload)
            if (icon.startsWith('http') || icon.startsWith('/')) {
                return <img src={icon} alt={name} className={styles.iconImage} />;
            }

            // Check if it's a react-icon class name
            if (icon.startsWith('Fa') && FaIcons[icon]) {
                const IconComponent = FaIcons[icon];
                return <IconComponent />;
            }
            if (icon.startsWith('Si') && SiIcons[icon]) {
                const IconComponent = SiIcons[icon];
                return <IconComponent />;
            }
        }

        // 3. Last resort fallback (first letter)
        return <span className={styles.fallbackIcon}>{name?.charAt(0)}</span>;
    };

    return (
        <div className={styles.skillCard}>
            <div className={styles.inner}>
                {/* Front Side */}
                <div className={styles.front}>
                    <div className={styles.icon}>
                        {renderIcon()}
                    </div>
                    <h3 className={styles.name}>{name}</h3>
                </div>

                {/* Back Side */}
                <div className={styles.back}>
                    <div className={styles.level}>{level || 'Intermediate'}</div>
                    <p className={styles.description}>{description || `${name} development`}</p>
                    <div className={styles.progressContainer}>
                        <div
                            className={styles.progressBar}
                            style={{ width: `${percentage || 50}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillCard;
