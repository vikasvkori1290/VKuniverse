import React from 'react';
import styles from '../styles/components/ResumeTemplates.module.css';
import { FaLinkedin, FaGithub, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

// Helper to parse skills
const getSkills = (skillsString) => {
    if (!skillsString) return [];
    return skillsString.split(',').map(s => s.trim()).filter(s => s);
};

export const TemplateClassic = ({ data, accentColor }) => {
    const { personalInfo, experience, education, projects, internships, skills } = data;

    return (
        <div className={`${styles.resumeContainer} ${styles.classic}`}>
            <div className={styles.classicHeader}>
                <h1>{personalInfo.fullName || 'Your Name'}</h1>
                <div className={styles.classicContact}>
                    {personalInfo.email && <span><FaEnvelope style={{ marginRight: '5px' }} />{personalInfo.email}</span>}
                    {personalInfo.phone && <span> • <FaPhone style={{ marginRight: '5px' }} />{personalInfo.phone}</span>}
                    {personalInfo.linkedin && <span> • <FaLinkedin style={{ marginRight: '5px' }} />{personalInfo.linkedin}</span>}
                    {personalInfo.github && <span> • <FaGithub style={{ marginRight: '5px' }} />{personalInfo.github}</span>}
                    {personalInfo.website && <span> • <FaGlobe style={{ marginRight: '5px' }} />{personalInfo.website}</span>}
                </div>
            </div>

            {personalInfo.summary && (
                <div className={styles.classicSection}>
                    <h3 className={styles.classicSectionTitle} style={{ borderColor: accentColor }}>Professional Summary</h3>
                    <p>{personalInfo.summary}</p>
                </div>
            )}

            {experience && experience.length > 0 && (
                <div className={styles.classicSection}>
                    <h3 className={styles.classicSectionTitle} style={{ borderColor: accentColor }}>Experience</h3>
                    {experience.map(exp => (
                        <div key={exp.id} className={styles.item}>
                            <div className={styles.itemHeader}>
                                <span className={styles.itemRole}>{exp.role}</span>
                                <span className={styles.itemDate}>{exp.duration}</span>
                            </div>
                            <div className={styles.itemCompany}>{exp.company}</div>
                            <p>{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {internships && internships.length > 0 && (
                <div className={styles.classicSection}>
                    <h3 className={styles.classicSectionTitle} style={{ borderColor: accentColor }}>Internships</h3>
                    {internships.map(int => (
                        <div key={int.id} className={styles.item}>
                            <div className={styles.itemHeader}>
                                <span className={styles.itemRole}>{int.role}</span>
                                <span className={styles.itemDate}>{int.duration}</span>
                            </div>
                            <div className={styles.itemCompany}>{int.company}</div>
                            <p>{int.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {projects && projects.length > 0 && (
                <div className={styles.classicSection}>
                    <h3 className={styles.classicSectionTitle} style={{ borderColor: accentColor }}>Projects</h3>
                    {projects.map(proj => (
                        <div key={proj.id} className={styles.item}>
                            <div className={styles.itemHeader}>
                                <span className={styles.itemRole}>{proj.name}</span>
                                {proj.link && <span className={styles.itemDate}><a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: accentColor }}>Link</a></span>}
                            </div>
                            <div className={styles.itemCompany}>{proj.techStack}</div>
                            <p>{proj.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {education && education.length > 0 && (
                <div className={styles.classicSection}>
                    <h3 className={styles.classicSectionTitle} style={{ borderColor: accentColor }}>Education</h3>
                    {education.map(edu => (
                        <div key={edu.id} className={styles.item}>
                            <div className={styles.itemHeader}>
                                <span className={styles.itemRole}>{edu.institution}</span>
                                <span className={styles.itemDate}>{edu.year}</span>
                            </div>
                            <div className={styles.itemCompany}>{edu.degree}</div>
                        </div>
                    ))}
                </div>
            )}

            {skills && (
                <div className={styles.classicSection}>
                    <h3 className={styles.classicSectionTitle} style={{ borderColor: accentColor }}>Skills</h3>
                    <p>{skills}</p>
                </div>
            )}
        </div>
    );
};

export const TemplateModern = ({ data, accentColor }) => {
    const { personalInfo, experience, education, projects, internships, skills } = data;
    const skillList = getSkills(skills);

    return (
        <div className={`${styles.resumeContainer} ${styles.modern}`} style={{ '--accent-color': accentColor }}>
            <div className={styles.modernSidebar}>
                <div className={styles.modernSection}>
                    <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Contact</h3>
                    <div style={{ fontSize: '13px', lineHeight: '2' }}>
                        {personalInfo.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaEnvelope /> {personalInfo.email}</div>}
                        {personalInfo.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaPhone /> {personalInfo.phone}</div>}
                        {personalInfo.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaLinkedin /> {personalInfo.linkedin}</div>}
                        {personalInfo.github && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaGithub /> {personalInfo.github}</div>}
                        {personalInfo.website && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaGlobe /> {personalInfo.website}</div>}
                    </div>
                </div>

                {education && education.length > 0 && (
                    <div className={styles.modernSection} style={{ marginTop: '30px' }}>
                        <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Education</h3>
                        {education.map(edu => (
                            <div key={edu.id} style={{ marginBottom: '15px' }}>
                                <div style={{ fontWeight: 'bold' }}>{edu.degree}</div>
                                <div>{edu.institution}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{edu.year}</div>
                            </div>
                        ))}
                    </div>
                )}

                {skillList.length > 0 && (
                    <div className={styles.modernSection} style={{ marginTop: '30px' }}>
                        <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Skills</h3>
                        {skillList.map((skill, i) => (
                            <div key={i} className={styles.skillTag}>{skill}</div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.modernMain}>
                <div className={styles.modernHeader}>
                    <div className={styles.modernName} style={{ color: accentColor }}>{personalInfo.fullName || 'Your Name'}</div>
                    <div className={styles.modernRole}>Professional Title</div>
                </div>

                {personalInfo.summary && (
                    <div className={styles.modernSection}>
                        <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Profile</h3>
                        <p>{personalInfo.summary}</p>
                    </div>
                )}

                {experience && experience.length > 0 && (
                    <div className={styles.modernSection}>
                        <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Experience</h3>
                        {experience.map(exp => (
                            <div key={exp.id} className={styles.item}>
                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{exp.role}</div>
                                <div style={{ color: accentColor, fontWeight: 'bold' }}>{exp.company}</div>
                                <div className={styles.itemDate}>{exp.duration}</div>
                                <p style={{ marginTop: '5px' }}>{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {internships && internships.length > 0 && (
                    <div className={styles.modernSection}>
                        <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Internships</h3>
                        {internships.map(int => (
                            <div key={int.id} className={styles.item}>
                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{int.role}</div>
                                <div style={{ color: accentColor, fontWeight: 'bold' }}>{int.company}</div>
                                <div className={styles.itemDate}>{int.duration}</div>
                                <p style={{ marginTop: '5px' }}>{int.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {projects && projects.length > 0 && (
                    <div className={styles.modernSection}>
                        <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Projects</h3>
                        {projects.map(proj => (
                            <div key={proj.id} className={styles.item}>
                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{proj.name}</div>
                                <div style={{ fontStyle: 'italic', fontSize: '14px' }}>{proj.techStack}</div>
                                <p style={{ marginTop: '5px' }}>{proj.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const TemplateMinimalist = ({ data, accentColor }) => {
    const { personalInfo, experience, education, projects, internships, skills } = data;

    return (
        <div className={`${styles.resumeContainer} ${styles.minimalist}`}>
            <div className={styles.minimalistHeader}>
                <div className={styles.minimalistName} style={{ color: accentColor }}>{personalInfo.fullName || 'Your Name'}</div>
                <div className={styles.minimalistContact}>
                    {personalInfo.email} | {personalInfo.phone} | {personalInfo.linkedin}
                </div>
            </div>

            {personalInfo.summary && (
                <div className={styles.minimalistSection}>
                    <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{personalInfo.summary}</p>
                </div>
            )}

            {experience && experience.length > 0 && (
                <div className={styles.minimalistSection}>
                    <h3 className={styles.minimalistSectionTitle} style={{ letterSpacing: '3px' }}>EXPERIENCE</h3>
                    {experience.map(exp => (
                        <div key={exp.id} className={styles.item} style={{ marginBottom: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontWeight: 'bold' }}>{exp.company}</span>
                                <span style={{ color: '#888' }}>{exp.duration}</span>
                            </div>
                            <div style={{ fontStyle: 'italic', marginBottom: '5px' }}>{exp.role}</div>
                            <p style={{ color: '#555' }}>{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {internships && internships.length > 0 && (
                <div className={styles.minimalistSection}>
                    <h3 className={styles.minimalistSectionTitle} style={{ letterSpacing: '3px' }}>INTERNSHIPS</h3>
                    {internships.map(int => (
                        <div key={int.id} className={styles.item} style={{ marginBottom: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontWeight: 'bold' }}>{int.company}</span>
                                <span style={{ color: '#888' }}>{int.duration}</span>
                            </div>
                            <div style={{ fontStyle: 'italic', marginBottom: '5px' }}>{int.role}</div>
                            <p style={{ color: '#555' }}>{int.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {projects && projects.length > 0 && (
                <div className={styles.minimalistSection}>
                    <h3 className={styles.minimalistSectionTitle} style={{ letterSpacing: '3px' }}>PROJECTS</h3>
                    {projects.map(proj => (
                        <div key={proj.id} className={styles.item} style={{ marginBottom: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontWeight: 'bold' }}>{proj.name}</span>
                                {proj.link && <span style={{ color: accentColor }}>Link</span>}
                            </div>
                            <div style={{ fontStyle: 'italic', marginBottom: '5px' }}>{proj.techStack}</div>
                            <p style={{ color: '#555' }}>{proj.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {education && education.length > 0 && (
                <div className={styles.minimalistSection}>
                    <h3 className={styles.minimalistSectionTitle} style={{ letterSpacing: '3px' }}>EDUCATION</h3>
                    {education.map(edu => (
                        <div key={edu.id} className={styles.item} style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold' }}>{edu.institution}</span>
                                <span style={{ color: '#888' }}>{edu.year}</span>
                            </div>
                            <div>{edu.degree}</div>
                        </div>
                    ))}
                </div>
            )}

            {skills && (
                <div className={styles.minimalistSection}>
                    <h3 className={styles.minimalistSectionTitle} style={{ letterSpacing: '3px' }}>SKILLS</h3>
                    <p>{skills}</p>
                </div>
            )}
        </div>
    );
};

export const TemplateCreative = ({ data, accentColor }) => {
    const { personalInfo, experience, education, projects, internships, skills } = data;
    const skillList = getSkills(skills);

    return (
        <div className={`${styles.resumeContainer} ${styles.creative}`} style={{ '--accent-color': accentColor }}>
            <div className={styles.creativeHeader} style={{ backgroundColor: accentColor }}>
                <div className={styles.creativeName}>{personalInfo.fullName || 'Your Name'}</div>
                <div className={styles.creativeContact}>
                    {personalInfo.email && <div><FaEnvelope /> {personalInfo.email}</div>}
                    {personalInfo.phone && <div><FaPhone /> {personalInfo.phone}</div>}
                    {personalInfo.linkedin && <div><FaLinkedin /> {personalInfo.linkedin}</div>}
                </div>
            </div>

            <div className={styles.creativeBody}>
                <div className="main-col">
                    {personalInfo.summary && (
                        <div className={styles.item}>
                            <h3 className={styles.creativeSectionTitle} style={{ color: accentColor }}>About Me</h3>
                            <p>{personalInfo.summary}</p>
                        </div>
                    )}

                    {experience && experience.length > 0 && (
                        <div className={styles.item}>
                            <h3 className={styles.creativeSectionTitle} style={{ color: accentColor }}>Experience</h3>
                            {experience.map(exp => (
                                <div key={exp.id} style={{ marginBottom: '20px', borderLeft: `2px solid ${accentColor}`, paddingLeft: '15px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{exp.role}</div>
                                    <div style={{ opacity: 0.7 }}>{exp.company} | {exp.duration}</div>
                                    <p style={{ marginTop: '5px' }}>{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {internships && internships.length > 0 && (
                        <div className={styles.item}>
                            <h3 className={styles.creativeSectionTitle} style={{ color: accentColor }}>Internships</h3>
                            {internships.map(int => (
                                <div key={int.id} style={{ marginBottom: '20px', borderLeft: `2px solid ${accentColor}`, paddingLeft: '15px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{int.role}</div>
                                    <div style={{ opacity: 0.7 }}>{int.company} | {int.duration}</div>
                                    <p style={{ marginTop: '5px' }}>{int.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {projects && projects.length > 0 && (
                        <div className={styles.item}>
                            <h3 className={styles.creativeSectionTitle} style={{ color: accentColor }}>Projects</h3>
                            {projects.map(proj => (
                                <div key={proj.id} style={{ marginBottom: '20px', borderLeft: `2px solid ${accentColor}`, paddingLeft: '15px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{proj.name}</div>
                                    <div style={{ opacity: 0.7 }}>{proj.techStack}</div>
                                    <p style={{ marginTop: '5px' }}>{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="side-col">
                    {education && education.length > 0 && (
                        <div style={{ marginBottom: '30px' }}>
                            <h3 className={styles.creativeSectionTitle} style={{ color: accentColor }}>Education</h3>
                            {education.map(edu => (
                                <div key={edu.id} style={{ marginBottom: '15px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{edu.degree}</div>
                                    <div>{edu.institution}</div>
                                    <div style={{ fontSize: '12px' }}>{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {skillList.length > 0 && (
                        <div>
                            <h3 className={styles.creativeSectionTitle} style={{ color: accentColor }}>Skills</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {skillList.map((skill, i) => (
                                    <span key={i} style={{ background: accentColor, color: 'white', padding: '4px 10px', borderRadius: '15px', fontSize: '12px' }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const TemplateProfessional = ({ data, accentColor }) => {
    const { personalInfo, experience, education, projects, internships, skills } = data;

    return (
        <div className={`${styles.resumeContainer} ${styles.professional}`} style={{ '--accent-color': accentColor }}>
            <div className={styles.professionalHeader} style={{ borderBottomColor: accentColor }}>
                <div className={styles.professionalName} style={{ color: accentColor }}>{personalInfo.fullName || 'Your Name'}</div>
                <div className={styles.professionalContact}>
                    {personalInfo.email && <div><FaEnvelope style={{ marginRight: '5px' }} /> {personalInfo.email}</div>}
                    {personalInfo.phone && <div><FaPhone style={{ marginRight: '5px' }} /> {personalInfo.phone}</div>}
                </div>
            </div>

            <div className={styles.professionalGrid}>
                {personalInfo.summary && (
                    <div>
                        <div className={styles.professionalSectionTitle} style={{ borderLeftColor: accentColor }}>Professional Summary</div>
                        <p>{personalInfo.summary}</p>
                    </div>
                )}

                {experience && experience.length > 0 && (
                    <div>
                        <div className={styles.professionalSectionTitle} style={{ borderLeftColor: accentColor }}>Work Experience</div>
                        {experience.map(exp => (
                            <div key={exp.id} className={styles.item}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>{exp.company}</span>
                                    <span>{exp.duration}</span>
                                </div>
                                <div style={{ fontStyle: 'italic', marginBottom: '5px', color: accentColor }}>{exp.role}</div>
                                <p>{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {internships && internships.length > 0 && (
                    <div>
                        <div className={styles.professionalSectionTitle} style={{ borderLeftColor: accentColor }}>Internships</div>
                        {internships.map(int => (
                            <div key={int.id} className={styles.item}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>{int.company}</span>
                                    <span>{int.duration}</span>
                                </div>
                                <div style={{ fontStyle: 'italic', marginBottom: '5px', color: accentColor }}>{int.role}</div>
                                <p>{int.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {projects && projects.length > 0 && (
                    <div>
                        <div className={styles.professionalSectionTitle} style={{ borderLeftColor: accentColor }}>Projects</div>
                        {projects.map(proj => (
                            <div key={proj.id} className={styles.item}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>{proj.name}</span>
                                    {proj.link && <span style={{ fontSize: '12px' }}><a href={proj.link} style={{ color: accentColor }}>Link</a></span>}
                                </div>
                                <div style={{ fontStyle: 'italic', marginBottom: '5px' }}>{proj.techStack}</div>
                                <p>{proj.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {education && education.length > 0 && (
                    <div>
                        <div className={styles.professionalSectionTitle} style={{ borderLeftColor: accentColor }}>Education</div>
                        {education.map(edu => (
                            <div key={edu.id} className={styles.item}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>{edu.institution}</span>
                                    <span>{edu.year}</span>
                                </div>
                                <div style={{ fontStyle: 'italic', color: accentColor }}>{edu.degree}</div>
                            </div>
                        ))}
                    </div>
                )}

                {skills && (
                    <div>
                        <div className={styles.professionalSectionTitle} style={{ borderLeftColor: accentColor }}>Skills</div>
                        <p>{skills}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const TemplateClassicPhoto = ({ data, accentColor }) => {
    const { personalInfo, experience, education, projects, internships, skills } = data;

    return (
        <div className={`${styles.resumeContainer} ${styles.classic}`}>
            <div className={styles.classicPhotoHeader}>
                {personalInfo.photo && (
                    <div className={styles.photoContainer} style={{ borderColor: accentColor }}>
                        <img src={personalInfo.photo} alt={personalInfo.fullName} />
                    </div>
                )}
                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: 0 }}>{personalInfo.fullName || 'Your Name'}</h1>
                    <div className={styles.classicContact} style={{ marginTop: '10px', justifyContent: 'flex-start' }}>
                        {personalInfo.email && <span><FaEnvelope style={{ marginRight: '5px' }} />{personalInfo.email}</span>}
                        {personalInfo.phone && <span> • <FaPhone style={{ marginRight: '5px' }} />{personalInfo.phone}</span>}
                        {personalInfo.linkedin && <span> • <FaLinkedin style={{ marginRight: '5px' }} />{personalInfo.linkedin}</span>}
                    </div>
                </div>
            </div>

            {personalInfo.summary && (
                <div className={styles.classicSection}>
                    <h3 className={styles.classicSectionTitle} style={{ borderColor: accentColor }}>Professional Summary</h3>
                    <p>{personalInfo.summary}</p>
                </div>
            )}

            {experience && experience.length > 0 && (
                <div className={styles.classicSection}>
                    <h3 className={styles.classicSectionTitle} style={{ borderColor: accentColor }}>Experience</h3>
                    {experience.map(exp => (
                        <div key={exp.id} className={styles.item}>
                            <div className={styles.itemHeader}>
                                <span className={styles.itemRole}>{exp.role}</span>
                                <span className={styles.itemDate}>{exp.duration}</span>
                            </div>
                            <div className={styles.itemCompany}>{exp.company}</div>
                            <p>{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {internships && internships.length > 0 && (
                <div className={styles.classicSection}>
                    <h3 className={styles.classicSectionTitle} style={{ borderColor: accentColor }}>Internships</h3>
                    {internships.map(int => (
                        <div key={int.id} className={styles.item}>
                            <div className={styles.itemHeader}>
                                <span className={styles.itemRole}>{int.role}</span>
                                <span className={styles.itemDate}>{int.duration}</span>
                            </div>
                            <div className={styles.itemCompany}>{int.company}</div>
                            <p>{int.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {projects && projects.length > 0 && (
                <div className={styles.classicSection}>
                    <h3 className={styles.classicSectionTitle} style={{ borderColor: accentColor }}>Projects</h3>
                    {projects.map(proj => (
                        <div key={proj.id} className={styles.item}>
                            <div className={styles.itemHeader}>
                                <span className={styles.itemRole}>{proj.name}</span>
                                {proj.link && <span className={styles.itemDate}><a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: accentColor }}>Link</a></span>}
                            </div>
                            <div className={styles.itemCompany}>{proj.techStack}</div>
                            <p>{proj.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {education && education.length > 0 && (
                <div className={styles.classicSection}>
                    <h3 className={styles.classicSectionTitle} style={{ borderColor: accentColor }}>Education</h3>
                    {education.map(edu => (
                        <div key={edu.id} className={styles.item}>
                            <div className={styles.itemHeader}>
                                <span className={styles.itemRole}>{edu.institution}</span>
                                <span className={styles.itemDate}>{edu.year}</span>
                            </div>
                            <div className={styles.itemCompany}>{edu.degree}</div>
                        </div>
                    ))}
                </div>
            )}

            {skills && (
                <div className={styles.classicSection}>
                    <h3 className={styles.classicSectionTitle} style={{ borderColor: accentColor }}>Skills</h3>
                    <p>{skills}</p>
                </div>
            )}
        </div>
    );
};

export const TemplateModernPhoto = ({ data, accentColor }) => {
    const { personalInfo, experience, education, projects, internships, skills } = data;
    const skillList = getSkills(skills);

    return (
        <div className={`${styles.resumeContainer} ${styles.modern}`} style={{ '--accent-color': accentColor }}>
            <div className={`${styles.modernSidebar} ${styles.modernPhotoSidebar}`}>
                {personalInfo.photo && (
                    <div className={styles.photoContainer}>
                        <img src={personalInfo.photo} alt={personalInfo.fullName} />
                    </div>
                )}

                <div className={styles.modernSection}>
                    <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Contact</h3>
                    <div style={{ fontSize: '13px', lineHeight: '2', textAlign: 'left' }}>
                        {personalInfo.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaEnvelope /> {personalInfo.email}</div>}
                        {personalInfo.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaPhone /> {personalInfo.phone}</div>}
                        {personalInfo.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaLinkedin /> {personalInfo.linkedin}</div>}
                        {personalInfo.github && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaGithub /> {personalInfo.github}</div>}
                        {personalInfo.website && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaGlobe /> {personalInfo.website}</div>}
                    </div>
                </div>

                {education && education.length > 0 && (
                    <div className={styles.modernSection} style={{ marginTop: '30px', textAlign: 'left' }}>
                        <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Education</h3>
                        {education.map(edu => (
                            <div key={edu.id} style={{ marginBottom: '15px' }}>
                                <div style={{ fontWeight: 'bold' }}>{edu.degree}</div>
                                <div>{edu.institution}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{edu.year}</div>
                            </div>
                        ))}
                    </div>
                )}

                {skillList.length > 0 && (
                    <div className={styles.modernSection} style={{ marginTop: '30px', textAlign: 'left' }}>
                        <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Skills</h3>
                        {skillList.map((skill, i) => (
                            <div key={i} className={styles.skillTag}>{skill}</div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.modernMain}>
                <div className={styles.modernHeader}>
                    <div className={styles.modernName} style={{ color: accentColor }}>{personalInfo.fullName || 'Your Name'}</div>
                    <div className={styles.modernRole}>Professional Title</div>
                </div>

                {personalInfo.summary && (
                    <div className={styles.modernSection}>
                        <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Profile</h3>
                        <p>{personalInfo.summary}</p>
                    </div>
                )}

                {experience && experience.length > 0 && (
                    <div className={styles.modernSection}>
                        <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Experience</h3>
                        {experience.map(exp => (
                            <div key={exp.id} className={styles.item}>
                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{exp.role}</div>
                                <div style={{ color: accentColor, fontWeight: 'bold' }}>{exp.company}</div>
                                <div className={styles.itemDate}>{exp.duration}</div>
                                <p style={{ marginTop: '5px' }}>{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {internships && internships.length > 0 && (
                    <div className={styles.modernSection}>
                        <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Internships</h3>
                        {internships.map(int => (
                            <div key={int.id} className={styles.item}>
                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{int.role}</div>
                                <div style={{ color: accentColor, fontWeight: 'bold' }}>{int.company}</div>
                                <div className={styles.itemDate}>{int.duration}</div>
                                <p style={{ marginTop: '5px' }}>{int.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {projects && projects.length > 0 && (
                    <div className={styles.modernSection}>
                        <h3 className={styles.modernSectionTitle} style={{ color: accentColor }}>Projects</h3>
                        {projects.map(proj => (
                            <div key={proj.id} className={styles.item}>
                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{proj.name}</div>
                                <div style={{ fontStyle: 'italic', fontSize: '14px' }}>{proj.techStack}</div>
                                <p style={{ marginTop: '5px' }}>{proj.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const TemplateMinimalistPhoto = ({ data, accentColor }) => {
    const { personalInfo, experience, education, projects, internships, skills } = data;

    return (
        <div className={`${styles.resumeContainer} ${styles.minimalist}`}>
            <div className={styles.minimalistPhotoHeader}>
                <div>
                    <div className={styles.minimalistName} style={{ color: accentColor }}>{personalInfo.fullName || 'Your Name'}</div>
                    <div className={styles.minimalistContact} style={{ marginTop: '10px' }}>
                        {personalInfo.email} | {personalInfo.phone}
                    </div>
                </div>
                {personalInfo.photo && (
                    <div className={styles.photoContainer}>
                        <img src={personalInfo.photo} alt={personalInfo.fullName} />
                    </div>
                )}
            </div>

            {personalInfo.summary && (
                <div className={styles.minimalistSection}>
                    <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{personalInfo.summary}</p>
                </div>
            )}

            {experience && experience.length > 0 && (
                <div className={styles.minimalistSection}>
                    <h3 className={styles.minimalistSectionTitle} style={{ letterSpacing: '3px' }}>EXPERIENCE</h3>
                    {experience.map(exp => (
                        <div key={exp.id} className={styles.item} style={{ marginBottom: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontWeight: 'bold' }}>{exp.company}</span>
                                <span style={{ color: '#888' }}>{exp.duration}</span>
                            </div>
                            <div style={{ fontStyle: 'italic', marginBottom: '5px' }}>{exp.role}</div>
                            <p style={{ color: '#555' }}>{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {internships && internships.length > 0 && (
                <div className={styles.minimalistSection}>
                    <h3 className={styles.minimalistSectionTitle} style={{ letterSpacing: '3px' }}>INTERNSHIPS</h3>
                    {internships.map(int => (
                        <div key={int.id} className={styles.item} style={{ marginBottom: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontWeight: 'bold' }}>{int.company}</span>
                                <span style={{ color: '#888' }}>{int.duration}</span>
                            </div>
                            <div style={{ fontStyle: 'italic', marginBottom: '5px' }}>{int.role}</div>
                            <p style={{ color: '#555' }}>{int.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {projects && projects.length > 0 && (
                <div className={styles.minimalistSection}>
                    <h3 className={styles.minimalistSectionTitle} style={{ letterSpacing: '3px' }}>PROJECTS</h3>
                    {projects.map(proj => (
                        <div key={proj.id} className={styles.item} style={{ marginBottom: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontWeight: 'bold' }}>{proj.name}</span>
                                {proj.link && <span style={{ color: accentColor }}>Link</span>}
                            </div>
                            <div style={{ fontStyle: 'italic', marginBottom: '5px' }}>{proj.techStack}</div>
                            <p style={{ color: '#555' }}>{proj.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {education && education.length > 0 && (
                <div className={styles.minimalistSection}>
                    <h3 className={styles.minimalistSectionTitle} style={{ letterSpacing: '3px' }}>EDUCATION</h3>
                    {education.map(edu => (
                        <div key={edu.id} className={styles.item} style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold' }}>{edu.institution}</span>
                                <span style={{ color: '#888' }}>{edu.year}</span>
                            </div>
                            <div>{edu.degree}</div>
                        </div>
                    ))}
                </div>
            )}

            {skills && (
                <div className={styles.minimalistSection}>
                    <h3 className={styles.minimalistSectionTitle} style={{ letterSpacing: '3px' }}>SKILLS</h3>
                    <p>{skills}</p>
                </div>
            )}
        </div>
    );
};

export const TemplateCreativePhoto = ({ data, accentColor }) => {
    const { personalInfo, experience, education, projects, internships, skills } = data;
    const skillList = getSkills(skills);

    return (
        <div className={`${styles.resumeContainer} ${styles.creative}`} style={{ '--accent-color': accentColor }}>
            <div className={styles.creativePhotoHeader} style={{ backgroundColor: accentColor }}>
                {personalInfo.photo && (
                    <div className={styles.photoContainer}>
                        <img src={personalInfo.photo} alt={personalInfo.fullName} />
                    </div>
                )}
                <div>
                    <div className={styles.creativeName}>{personalInfo.fullName || 'Your Name'}</div>
                    <div className={styles.creativeContact} style={{ marginTop: '10px' }}>
                        {personalInfo.email && <div><FaEnvelope /> {personalInfo.email}</div>}
                        {personalInfo.phone && <div><FaPhone /> {personalInfo.phone}</div>}
                        {personalInfo.linkedin && <div><FaLinkedin /> {personalInfo.linkedin}</div>}
                    </div>
                </div>
            </div>

            <div className={styles.creativeBody}>
                <div className="main-col">
                    {personalInfo.summary && (
                        <div className={styles.item}>
                            <h3 className={styles.creativeSectionTitle} style={{ color: accentColor }}>About Me</h3>
                            <p>{personalInfo.summary}</p>
                        </div>
                    )}

                    {experience && experience.length > 0 && (
                        <div className={styles.item}>
                            <h3 className={styles.creativeSectionTitle} style={{ color: accentColor }}>Experience</h3>
                            {experience.map(exp => (
                                <div key={exp.id} style={{ marginBottom: '20px', borderLeft: `2px solid ${accentColor}`, paddingLeft: '15px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{exp.role}</div>
                                    <div style={{ opacity: 0.7 }}>{exp.company} | {exp.duration}</div>
                                    <p style={{ marginTop: '5px' }}>{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {internships && internships.length > 0 && (
                        <div className={styles.item}>
                            <h3 className={styles.creativeSectionTitle} style={{ color: accentColor }}>Internships</h3>
                            {internships.map(int => (
                                <div key={int.id} style={{ marginBottom: '20px', borderLeft: `2px solid ${accentColor}`, paddingLeft: '15px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{int.role}</div>
                                    <div style={{ opacity: 0.7 }}>{int.company} | {int.duration}</div>
                                    <p style={{ marginTop: '5px' }}>{int.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {projects && projects.length > 0 && (
                        <div className={styles.item}>
                            <h3 className={styles.creativeSectionTitle} style={{ color: accentColor }}>Projects</h3>
                            {projects.map(proj => (
                                <div key={proj.id} style={{ marginBottom: '20px', borderLeft: `2px solid ${accentColor}`, paddingLeft: '15px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{proj.name}</div>
                                    <div style={{ opacity: 0.7 }}>{proj.techStack}</div>
                                    <p style={{ marginTop: '5px' }}>{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="side-col">
                    {education && education.length > 0 && (
                        <div style={{ marginBottom: '30px' }}>
                            <h3 className={styles.creativeSectionTitle} style={{ color: accentColor }}>Education</h3>
                            {education.map(edu => (
                                <div key={edu.id} style={{ marginBottom: '15px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{edu.degree}</div>
                                    <div>{edu.institution}</div>
                                    <div style={{ fontSize: '12px' }}>{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {skillList.length > 0 && (
                        <div>
                            <h3 className={styles.creativeSectionTitle} style={{ color: accentColor }}>Skills</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {skillList.map((skill, i) => (
                                    <span key={i} style={{ background: accentColor, color: 'white', padding: '4px 10px', borderRadius: '15px', fontSize: '12px' }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const TemplateProfessionalPhoto = ({ data, accentColor }) => {
    const { personalInfo, experience, education, projects, internships, skills } = data;

    return (
        <div className={`${styles.resumeContainer} ${styles.professional}`} style={{ '--accent-color': accentColor }}>
            <div className={styles.professionalPhotoHeader} style={{ borderBottomColor: accentColor }}>
                <div>
                    <div className={styles.professionalName} style={{ color: accentColor }}>{personalInfo.fullName || 'Your Name'}</div>
                    <div className={styles.professionalContact} style={{ marginTop: '10px' }}>
                        {personalInfo.email && <div><FaEnvelope style={{ marginRight: '5px' }} /> {personalInfo.email}</div>}
                        {personalInfo.phone && <div><FaPhone style={{ marginRight: '5px' }} /> {personalInfo.phone}</div>}
                    </div>
                </div>
                {personalInfo.photo && (
                    <div className={styles.photoContainer}>
                        <img src={personalInfo.photo} alt={personalInfo.fullName} />
                    </div>
                )}
            </div>

            <div className={styles.professionalGrid}>
                {personalInfo.summary && (
                    <div>
                        <div className={styles.professionalSectionTitle} style={{ borderLeftColor: accentColor }}>Professional Summary</div>
                        <p>{personalInfo.summary}</p>
                    </div>
                )}

                {experience && experience.length > 0 && (
                    <div>
                        <div className={styles.professionalSectionTitle} style={{ borderLeftColor: accentColor }}>Work Experience</div>
                        {experience.map(exp => (
                            <div key={exp.id} className={styles.item}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>{exp.company}</span>
                                    <span>{exp.duration}</span>
                                </div>
                                <div style={{ fontStyle: 'italic', marginBottom: '5px', color: accentColor }}>{exp.role}</div>
                                <p>{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {internships && internships.length > 0 && (
                    <div>
                        <div className={styles.professionalSectionTitle} style={{ borderLeftColor: accentColor }}>Internships</div>
                        {internships.map(int => (
                            <div key={int.id} className={styles.item}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>{int.company}</span>
                                    <span>{int.duration}</span>
                                </div>
                                <div style={{ fontStyle: 'italic', marginBottom: '5px', color: accentColor }}>{int.role}</div>
                                <p>{int.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {projects && projects.length > 0 && (
                    <div>
                        <div className={styles.professionalSectionTitle} style={{ borderLeftColor: accentColor }}>Projects</div>
                        {projects.map(proj => (
                            <div key={proj.id} className={styles.item}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>{proj.name}</span>
                                    {proj.link && <span style={{ fontSize: '12px' }}><a href={proj.link} style={{ color: accentColor }}>Link</a></span>}
                                </div>
                                <div style={{ fontStyle: 'italic', marginBottom: '5px' }}>{proj.techStack}</div>
                                <p>{proj.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {education && education.length > 0 && (
                    <div>
                        <div className={styles.professionalSectionTitle} style={{ borderLeftColor: accentColor }}>Education</div>
                        {education.map(edu => (
                            <div key={edu.id} className={styles.item}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>{edu.institution}</span>
                                    <span>{edu.year}</span>
                                </div>
                                <div style={{ fontStyle: 'italic', color: accentColor }}>{edu.degree}</div>
                            </div>
                        ))}
                    </div>
                )}

                {skills && (
                    <div>
                        <div className={styles.professionalSectionTitle} style={{ borderLeftColor: accentColor }}>Skills</div>
                        <p>{skills}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
