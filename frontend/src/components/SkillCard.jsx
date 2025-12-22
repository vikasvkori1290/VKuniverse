
import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import { FaReact, FaNodeJs } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiHtml5, SiCss3, SiJavascript } from 'react-icons/si';
import styles from '../styles/components/SkillCard.module.css';

const SkillCard = ({ name, icon, iconUrl, level, description, percentage }) => {

    const renderIcon = () => {
        // Normalize name for checking
        const lowerName = name?.toLowerCase() || '';

        // Specific Mapping for "MERN Stack"
        if (lowerName.includes('mern')) {
            return (
                <div className={styles.compositeIcon}>
                    <SiMongodb title="MongoDB" />
                    <SiExpress title="Express" />
                    <FaReact title="React" />
                    <FaNodeJs title="Node.js" />
                </div>
            );
        }

        // Specific Mapping for "Html , Css , JavaScript"
        if (lowerName.includes('html') && lowerName.includes('css')) {
            return (
                <div className={styles.compositeIcon}>
                    <SiHtml5 title="HTML5" />
                    <SiCss3 title="CSS3" />
                    <SiJavascript title="JavaScript" />
                </div>
            );
        }

        // Single mappings
        if (lowerName === 'react') return <FaReact />;
        if (lowerName === 'node.js' || lowerName === 'node') return <FaNodeJs />;
        if (lowerName.includes('mongo')) return <SiMongodb />;
        if (lowerName.includes('express')) return <SiExpress />;
        if (lowerName.includes('html')) return <SiHtml5 />;
        if (lowerName.includes('css')) return <SiCss3 />;
        if (lowerName.includes('javascript') || lowerName.includes('js')) return <SiJavascript />;

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
            <div className={styles.header}>
                <div className={styles.icon}>
                    {renderIcon()}
                </div>
                <div className={styles.titleInfo}>
                    <h3 className={styles.name}>{name}</h3>
                    <span className={styles.level}>{level || 'Intermediate'}</span>
                </div>
            </div>

            <p className={styles.description}>{description || `${name} development`}</p>

            <div className={styles.progressContainer}>
                <div className={styles.progressLabel}>
                    <span>Proficiency</span>
                    <span>{percentage}%</span>
                </div>
                <div className={styles.progressBarTrack}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${percentage || 50}% ` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default SkillCard;
