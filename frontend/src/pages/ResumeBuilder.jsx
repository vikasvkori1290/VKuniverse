import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/pages/ResumeBuilder.module.css';
import { FaMagic, FaDownload, FaPlus, FaTrash, FaPalette, FaArrowRight, FaArrowLeft, FaCheck, FaUpload, FaSpinner, FaSave, FaLink } from 'react-icons/fa';
import {
    TemplateClassic, TemplateModern, TemplateMinimalist, TemplateCreative, TemplateProfessional,
    TemplateClassicPhoto, TemplateModernPhoto, TemplateMinimalistPhoto, TemplateCreativePhoto, TemplateProfessionalPhoto
} from '../components/ResumeTemplates';
import { useReactToPrint } from 'react-to-print';
import { removeBackground } from "@imgly/background-removal";
import axios from 'axios';

const ResumeBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [accentColor, setAccentColor] = useState('#3b82f6'); // Default blue
    const [isRemovingBg, setIsRemovingBg] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [savedResumeId, setSavedResumeId] = useState(id || null);
    const [showShareLink, setShowShareLink] = useState(false);
    const [aiLoading, setAiLoading] = useState({});


    const componentRef = useRef();

    const [resumeData, setResumeData] = useState({
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            linkedin: '',
            github: '',
            website: '',
            summary: '',
            photo: null
        },
        experience: [
            { id: 1, company: '', role: '', duration: '', description: '' }
        ],
        education: [
            { id: 1, institution: '', degree: '', year: '' }
        ],
        projects: [
            { id: 1, name: '', techStack: '', link: '', description: '' }
        ],
        internships: [
            { id: 1, company: '', role: '', duration: '', description: '' }
        ],
        skills: ''
    });

    const mockResumeData = {
        personalInfo: {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 234 567 890',
            linkedin: 'linkedin.com/in/johndoe',
            github: 'github.com/johndoe',
            website: 'johndoe.com',
            summary: 'Innovative Software Engineer with 5+ years of experience in building scalable web applications. Proficient in React, Node.js, and cloud technologies. Passionate about creating intuitive user experiences and optimizing backend performance.',
            photo: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        experience: [
            { id: 1, company: 'Tech Solutions Inc.', role: 'Senior Developer', duration: '2021 - Present', description: 'Led a team of 5 developers to rebuild the company\'s core product, improving load times by 40%. Implemented CI/CD pipelines and automated testing.' },
            { id: 2, company: 'WebCreate Agency', role: 'Full Stack Developer', duration: '2018 - 2021', description: 'Developed custom e-commerce solutions for diverse clients. Integrated payment gateways and managed database migrations.' }
        ],
        education: [
            { id: 1, institution: 'State University', degree: 'B.S. Computer Science', year: '2014 - 2018' }
        ],
        projects: [
            { id: 1, name: 'E-Commerce Platform', techStack: 'React, Redux, Node.js', link: 'github.com/project', description: 'A full-featured online store with real-time inventory management.' }
        ],
        internships: [
            { id: 1, company: 'Startup Hub', role: 'Frontend Intern', duration: 'Summer 2017', description: 'Assisted in designing UI components and fixing cross-browser compatibility issues.' }
        ],
        skills: 'JavaScript, React, Node.js, Python, AWS, Docker, GraphQL, TypeScript, SQL, Git'
    };

    const templates = [
        { id: 'classic', name: 'Classic', component: TemplateClassic },
        { id: 'modern', name: 'Modern', component: TemplateModern },
        { id: 'minimalist', name: 'Minimalist', component: TemplateMinimalist },
        { id: 'creative', name: 'Creative', component: TemplateCreative },
        { id: 'professional', name: 'Professional', component: TemplateProfessional },
        { id: 'classic-photo', name: 'Classic w/ Photo', component: TemplateClassicPhoto },
        { id: 'modern-photo', name: 'Modern w/ Photo', component: TemplateModernPhoto },
        { id: 'minimalist-photo', name: 'Minimalist w/ Photo', component: TemplateMinimalistPhoto },
        { id: 'creative-photo', name: 'Creative w/ Photo', component: TemplateCreativePhoto },
        { id: 'professional-photo', name: 'Professional w/ Photo', component: TemplateProfessionalPhoto }
    ];
    const colors = [
        '#3b82f6', // Blue
        '#ef4444', // Red
        '#10b981', // Green
        '#8b5cf6', // Purple
        '#f97316', // Orange
        '#14b8a6', // Teal
        '#6366f1', // Indigo
        '#ec4899', // Pink
        '#64748b', // Slate
        '#059669', // Emerald
        '#06b6d4', // Cyan
        '#f43f5e', // Rose
        '#f59e0b', // Amber
        '#7c3aed', // Violet
        '#d946ef', // Fuchsia
        '#1e3a8a', // Navy
        '#1f2937', // Dark Gray
        '#000000', // Black
    ];

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `${resumeData.personalInfo.fullName || 'Resume'}_Resume`,
    });

    const handlePersonalInfoChange = (e) => {
        setResumeData({
            ...resumeData,
            personalInfo: { ...resumeData.personalInfo, [e.target.name]: e.target.value }
        });
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setResumeData({
                    ...resumeData,
                    personalInfo: { ...resumeData.personalInfo, photo: reader.result }
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBackground = async () => {
        if (!resumeData.personalInfo.photo) return;

        setIsRemovingBg(true);
        try {
            // Convert data URL to blob if needed, but imgly accepts data URLs
            const imageBlob = await removeBackground(resumeData.personalInfo.photo);
            const url = URL.createObjectURL(imageBlob);
            setResumeData({
                ...resumeData,
                personalInfo: { ...resumeData.personalInfo, photo: url }
            });
        } catch (error) {
            console.error("Background removal failed:", error);
            alert("Failed to remove background. Please try again.");
        } finally {
            setIsRemovingBg(false);
        }
    };

    // Experience Handlers
    const handleExperienceChange = (id, e) => {
        const newExperience = resumeData.experience.map(exp =>
            exp.id === id ? { ...exp, [e.target.name]: e.target.value } : exp
        );
        setResumeData({ ...resumeData, experience: newExperience });
    };

    const addExperience = () => {
        setResumeData({
            ...resumeData,
            experience: [...resumeData.experience, { id: Date.now(), company: '', role: '', duration: '', description: '' }]
        });
    };

    const removeExperience = (id) => {
        setResumeData({
            ...resumeData,
            experience: resumeData.experience.filter(exp => exp.id !== id)
        });
    };

    // Education Handlers
    const handleEducationChange = (id, e) => {
        const newEducation = resumeData.education.map(edu =>
            edu.id === id ? { ...edu, [e.target.name]: e.target.value } : edu
        );
        setResumeData({ ...resumeData, education: newEducation });
    };

    const addEducation = () => {
        setResumeData({
            ...resumeData,
            education: [...resumeData.education, { id: Date.now(), institution: '', degree: '', year: '' }]
        });
    };

    const removeEducation = (id) => {
        setResumeData({
            ...resumeData,
            education: resumeData.education.filter(edu => edu.id !== id)
        });
    };

    // Projects Handlers
    const handleProjectChange = (id, e) => {
        const newProjects = resumeData.projects.map(proj =>
            proj.id === id ? { ...proj, [e.target.name]: e.target.value } : proj
        );
        setResumeData({ ...resumeData, projects: newProjects });
    };

    const addProject = () => {
        setResumeData({
            ...resumeData,
            projects: [...resumeData.projects, { id: Date.now(), name: '', techStack: '', link: '', description: '' }]
        });
    };

    const removeProject = (id) => {
        setResumeData({
            ...resumeData,
            projects: resumeData.projects.filter(proj => proj.id !== id)
        });
    };

    // Internships Handlers
    const handleInternshipChange = (id, e) => {
        const newInternships = resumeData.internships.map(int =>
            int.id === id ? { ...int, [e.target.name]: e.target.value } : int
        );
        setResumeData({ ...resumeData, internships: newInternships });
    };

    const addInternship = () => {
        setResumeData({
            ...resumeData,
            internships: [...resumeData.internships, { id: Date.now(), company: '', role: '', duration: '', description: '' }]
        });
    };

    const removeInternship = (id) => {
        setResumeData({
            ...resumeData,
            internships: resumeData.internships.filter(int => int.id !== id)
        });
    };

    // Load resume if ID is in URL
    useEffect(() => {
        if (id) {
            loadResume(id);
        }
    }, [id]);

    // Save resume to MongoDB
    const saveResume = async () => {
        setIsSaving(true);
        try {
            const payload = {
                personalInfo: resumeData.personalInfo,
                experience: resumeData.experience.map(({ id, ...rest }) => rest),
                education: resumeData.education.map(({ id, ...rest }) => rest),
                projects: resumeData.projects.map(({ id, ...rest }) => rest),
                internships: resumeData.internships.map(({ id, ...rest }) => rest),
                skills: resumeData.skills,
                selectedTemplate,
                accentColor,
            };

            let response;
            if (savedResumeId) {
                // Update existing resume
                response = await axios.put(`http://localhost:5000/api/resumes/${savedResumeId}`, payload);
            } else {
                // Create new resume
                response = await axios.post('http://localhost:5000/api/resumes', payload);
                setSavedResumeId(response.data.id);
                // Update URL without navigation
                window.history.replaceState(null, '', `/resume-builder/${response.data.id}`);
            }

            setShowShareLink(true);
            setTimeout(() => setShowShareLink(false), 5000);
        } catch (error) {
            console.error('Error saving resume:', error);
            alert('Failed to save resume. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Load resume from MongoDB
    const loadResume = async (resumeId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/resumes/${resumeId}`);
            const data = response.data.data;

            setResumeData({
                personalInfo: data.personalInfo,
                experience: data.experience.map((exp, index) => ({ ...exp, id: index + 1 })),
                education: data.education.map((edu, index) => ({ ...edu, id: index + 1 })),
                projects: data.projects.map((proj, index) => ({ ...proj, id: index + 1 })),
                internships: data.internships.map((int, index) => ({ ...int, id: index + 1 })),
                skills: data.skills,
            });
            setSelectedTemplate(data.selectedTemplate);
            setAccentColor(data.accentColor);
        } catch (error) {
            console.error('Error loading resume:', error);
            alert('Failed to load resume. Please check the link and try again.');
        }
    };

    // Copy shareable link to clipboard
    const copyShareLink = () => {
        const link = `${window.location.origin}/resume-builder/${savedResumeId}`;
        navigator.clipboard.writeText(link);
        alert('Link copied to clipboard!');
    };

    // Enhance content with AI - Coming Soon
    const handleEnhanceWithAI = async (type, field, id = null) => {
        alert('🚀 AI Enhancement feature will be integrated soon! Stay tuned for automatic content improvement.');
    };

    const nextStep = () => setActiveStep(prev => prev + 1);
    const prevStep = () => setActiveStep(prev => prev - 1);

    const SelectedTemplateComponent = templates.find(t => t.id === selectedTemplate)?.component || TemplateClassic;

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>AI Resume Builder</h1>
                    <div className={styles.steps}>
                        <div
                            className={`${styles.step} ${activeStep >= 1 ? styles.activeStep : ''}`}
                            onClick={() => setActiveStep(1)}
                            style={{ cursor: 'pointer' }}
                        >
                            1. Select Template
                        </div>
                        <div className={styles.stepLine}></div>
                        <div
                            className={`${styles.step} ${activeStep >= 2 ? styles.activeStep : ''}`}
                            onClick={() => setActiveStep(2)}
                            style={{ cursor: 'pointer' }}
                        >
                            2. Customize
                        </div>
                        <div className={styles.stepLine}></div>
                        <div
                            className={`${styles.step} ${activeStep >= 3 ? styles.activeStep : ''}`}
                            onClick={() => setActiveStep(3)}
                            style={{ cursor: 'pointer' }}
                        >
                            3. Build & Download
                        </div>
                    </div>
                </div>

                {/* Step 1: Template Selection */}
                {activeStep === 1 && (
                    <div className={styles.stepContainer}>
                        <h2>Choose a Template</h2>
                        <div className={styles.templateGrid}>
                            {templates.map(template => (
                                <div
                                    key={template.id}
                                    className={`${styles.templateCard} ${selectedTemplate === template.id ? styles.selected : ''}`}
                                    onClick={() => setSelectedTemplate(template.id)}
                                >
                                    <div className={styles.templatePreviewMini}>
                                        {/* Mini preview using the component itself, scaled down */}
                                        <div className={styles.miniScale}>
                                            <template.component data={mockResumeData} accentColor={accentColor} />
                                        </div>
                                    </div>
                                    <h3>{template.name}</h3>
                                    {selectedTemplate === template.id && <div className={styles.checkMark}><FaCheck /></div>}
                                </div>
                            ))}
                        </div>
                        <div className={styles.navigationBtns}>
                            <div></div> {/* Spacer */}
                            <button className={styles.nextBtn} onClick={nextStep}>Next: Customize <FaArrowRight /></button>
                        </div>
                    </div>
                )}

                {/* Step 2: Customization */}
                {activeStep === 2 && (
                    <div className={styles.stepContainer}>
                        <h2>Customize Your Resume</h2>
                        <div className={styles.customizationGrid}>
                            <div className={styles.optionsPanel}>
                                <h3>Accent Color</h3>
                                <div className={styles.colorGrid}>
                                    {colors.map(color => (
                                        <div
                                            key={color}
                                            className={`${styles.colorSwatch} ${accentColor === color ? styles.selectedColor : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setAccentColor(color)}
                                        />
                                    ))}
                                </div>

                                <div style={{ marginTop: '30px' }}>
                                    <h3>Profile Photo</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <label className={styles.uploadBtn} style={{ textAlign: 'center', display: 'block' }}>
                                            <FaUpload style={{ marginRight: '8px' }} /> Upload Photo
                                            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                                        </label>

                                        {resumeData.personalInfo.photo && (
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid ' + accentColor, margin: '0 auto 10px' }}>
                                                    <img src={resumeData.personalInfo.photo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <button
                                                    onClick={handleRemoveBackground}
                                                    className={styles.aiBtn}
                                                    disabled={isRemovingBg}
                                                    style={{ width: '100%', justifyContent: 'center' }}
                                                >
                                                    {isRemovingBg ? <FaSpinner className="fa-spin" /> : <FaMagic />}
                                                    {isRemovingBg ? ' Removing...' : ' Remove Background'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.infoBox} style={{ marginTop: '30px' }}>
                                    <p>Selected Template: <strong>{templates.find(t => t.id === selectedTemplate)?.name}</strong></p>
                                    <p>Selected Color: <span style={{ color: accentColor }}>{accentColor}</span></p>
                                </div>
                            </div>
                            <div className={styles.previewPanel}>
                                <div className={styles.resumePreview}>
                                    <SelectedTemplateComponent
                                        data={resumeData.personalInfo.photo ? resumeData : mockResumeData}
                                        accentColor={accentColor}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.navigationBtns}>
                            <button className={styles.prevBtn} onClick={prevStep}><FaArrowLeft /> Back</button>
                            <button className={styles.nextBtn} onClick={nextStep}>Next: Add Details <FaArrowRight /></button>
                        </div>
                    </div>
                )}

                {/* Step 3: Editor */}
                {activeStep === 3 && (
                    <div className={styles.builderContainer}>
                        <div className={styles.editorSection}>
                            <div className={styles.sectionHeader}>
                                <h2>Enter Your Details</h2>
                                <button className={styles.prevBtn} onClick={() => setActiveStep(1)} style={{ fontSize: '12px', padding: '4px 8px' }}>Change Template</button>
                            </div>

                            <div className={styles.formSection}>
                                <h3>Personal Information</h3>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>Full Name</label>
                                        <input type="text" name="fullName" value={resumeData.personalInfo.fullName} onChange={handlePersonalInfoChange} placeholder="John Doe" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email</label>
                                        <input type="email" name="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} placeholder="john@example.com" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Phone</label>
                                        <input type="text" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="+1 234 567 890" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>LinkedIn</label>
                                        <input type="text" name="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalInfoChange} placeholder="linkedin.com/in/johndoe" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>GitHub</label>
                                        <input type="text" name="github" value={resumeData.personalInfo.github} onChange={handlePersonalInfoChange} placeholder="github.com/johndoe" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Portfolio / Website</label>
                                        <input type="text" name="website" value={resumeData.personalInfo.website} onChange={handlePersonalInfoChange} placeholder="johndoe.com" />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Professional Summary <button
                                        className={styles.aiBtn}
                                        onClick={() => handleEnhanceWithAI('summary')}
                                        disabled={aiLoading['summary']}
                                    >
                                        {aiLoading['summary'] ? <FaSpinner className="fa-spin" /> : <FaMagic />}
                                        {aiLoading['summary'] ? ' Enhancing...' : ' Enhance with AI'}
                                    </button></label>
                                    <textarea name="summary" value={resumeData.personalInfo.summary} onChange={handlePersonalInfoChange} rows="4" placeholder="Briefly describe your professional background..." />
                                </div>
                            </div>

                            <div className={styles.formSection}>
                                <div className={styles.sectionHeader}>
                                    <h3>Experience</h3>
                                    <div>
                                        <button onClick={() => setResumeData({ ...resumeData, experience: [] })} className={styles.deleteBtn} style={{ marginRight: '10px', fontSize: '12px' }}>Clear Section</button>
                                        <button onClick={addExperience} className={styles.addBtn}><FaPlus /> Add</button>
                                    </div>
                                </div>
                                {resumeData.experience.map((exp, index) => (
                                    <div key={exp.id} className={styles.experienceItem}>
                                        <div className={styles.itemHeader}>
                                            <h4>Role {index + 1}</h4>
                                            <button onClick={() => removeExperience(exp.id)} className={styles.deleteBtn}><FaTrash /></button>
                                        </div>
                                        <div className={styles.formGrid}>
                                            <div className={styles.formGroup}>
                                                <label>Company</label>
                                                <input type="text" name="company" value={exp.company} onChange={(e) => handleExperienceChange(exp.id, e)} placeholder="Company Name" />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Role</label>
                                                <input type="text" name="role" value={exp.role} onChange={(e) => handleExperienceChange(exp.id, e)} placeholder="Software Engineer" />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Duration</label>
                                                <input type="text" name="duration" value={exp.duration} onChange={(e) => handleExperienceChange(exp.id, e)} placeholder="Jan 2023 - Present" />
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Description <button
                                                className={styles.aiBtn}
                                                onClick={() => handleEnhanceWithAI('experience', null, exp.id)}
                                                disabled={aiLoading[`experience-${exp.id}`]}
                                            >
                                                {aiLoading[`experience-${exp.id}`] ? <FaSpinner className="fa-spin" /> : <FaMagic />}
                                                {aiLoading[`experience-${exp.id}`] ? ' Enhancing...' : ' Enhance with AI'}
                                            </button></label>
                                            <textarea name="description" value={exp.description} onChange={(e) => handleExperienceChange(exp.id, e)} rows="3" placeholder="Describe your responsibilities and achievements..." />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.formSection}>
                                <div className={styles.sectionHeader}>
                                    <h3>Internships</h3>
                                    <div>
                                        <button onClick={() => setResumeData({ ...resumeData, internships: [] })} className={styles.deleteBtn} style={{ marginRight: '10px', fontSize: '12px' }}>Clear Section</button>
                                        <button onClick={addInternship} className={styles.addBtn}><FaPlus /> Add</button>
                                    </div>
                                </div>
                                {resumeData.internships.map((int, index) => (
                                    <div key={int.id} className={styles.experienceItem}>
                                        <div className={styles.itemHeader}>
                                            <h4>Internship {index + 1}</h4>
                                            <button onClick={() => removeInternship(int.id)} className={styles.deleteBtn}><FaTrash /></button>
                                        </div>
                                        <div className={styles.formGrid}>
                                            <div className={styles.formGroup}>
                                                <label>Company</label>
                                                <input type="text" name="company" value={int.company} onChange={(e) => handleInternshipChange(int.id, e)} placeholder="Company Name" />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Role</label>
                                                <input type="text" name="role" value={int.role} onChange={(e) => handleInternshipChange(int.id, e)} placeholder="Intern" />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Duration</label>
                                                <input type="text" name="duration" value={int.duration} onChange={(e) => handleInternshipChange(int.id, e)} placeholder="Summer 2023" />
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Description <button
                                                className={styles.aiBtn}
                                                onClick={() => handleEnhanceWithAI('internship', null, int.id)}
                                                disabled={aiLoading[`internship-${int.id}`]}
                                            >
                                                {aiLoading[`internship-${int.id}`] ? <FaSpinner className="fa-spin" /> : <FaMagic />}
                                                {aiLoading[`internship-${int.id}`] ? ' Enhancing...' : ' Enhance with AI'}
                                            </button></label>
                                            <textarea name="description" value={int.description} onChange={(e) => handleInternshipChange(int.id, e)} rows="3" placeholder="Describe your responsibilities..." />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.formSection}>
                                <div className={styles.sectionHeader}>
                                    <h3>Projects</h3>
                                    <button onClick={addProject} className={styles.addBtn}><FaPlus /> Add</button>
                                </div>
                                {resumeData.projects.map((proj, index) => (
                                    <div key={proj.id} className={styles.experienceItem}>
                                        <div className={styles.itemHeader}>
                                            <h4>Project {index + 1}</h4>
                                            <button onClick={() => removeProject(proj.id)} className={styles.deleteBtn}><FaTrash /></button>
                                        </div>
                                        <div className={styles.formGrid}>
                                            <div className={styles.formGroup}>
                                                <label>Project Name</label>
                                                <input type="text" name="name" value={proj.name} onChange={(e) => handleProjectChange(proj.id, e)} placeholder="Project Name" />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Tech Stack</label>
                                                <input type="text" name="techStack" value={proj.techStack} onChange={(e) => handleProjectChange(proj.id, e)} placeholder="React, Node.js, MongoDB" />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Link</label>
                                                <input type="text" name="link" value={proj.link} onChange={(e) => handleProjectChange(proj.id, e)} placeholder="https://..." />
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Description <button
                                                className={styles.aiBtn}
                                                onClick={() => handleEnhanceWithAI('project', null, proj.id)}
                                                disabled={aiLoading[`project-${proj.id}`]}
                                            >
                                                {aiLoading[`project-${proj.id}`] ? <FaSpinner className="fa-spin" /> : <FaMagic />}
                                                {aiLoading[`project-${proj.id}`] ? ' Enhancing...' : ' Enhance with AI'}
                                            </button></label>
                                            <textarea name="description" value={proj.description} onChange={(e) => handleProjectChange(proj.id, e)} rows="3" placeholder="Describe the project..." />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.formSection}>
                                <div className={styles.sectionHeader}>
                                    <h3>Education</h3>
                                    <button onClick={addEducation} className={styles.addBtn}><FaPlus /> Add</button>
                                </div>
                                {resumeData.education.map((edu, index) => (
                                    <div key={edu.id} className={styles.experienceItem}>
                                        <div className={styles.itemHeader}>
                                            <h4>Education {index + 1}</h4>
                                            <button onClick={() => removeEducation(edu.id)} className={styles.deleteBtn}><FaTrash /></button>
                                        </div>
                                        <div className={styles.formGrid}>
                                            <div className={styles.formGroup}>
                                                <label>Institution</label>
                                                <input type="text" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(edu.id, e)} placeholder="University Name" />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Degree</label>
                                                <input type="text" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(edu.id, e)} placeholder="B.Sc. Computer Science" />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Year</label>
                                                <input type="text" name="year" value={edu.year} onChange={(e) => handleEducationChange(edu.id, e)} placeholder="2020 - 2024" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.formSection}>
                                <h3>Skills</h3>
                                <div className={styles.formGroup}>
                                    <label>Skills (comma separated)</label>
                                    <textarea name="skills" value={resumeData.skills} onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })} rows="2" placeholder="Java, Python, React, Team Leadership..." />
                                </div>
                            </div>
                        </div>

                        <div className={styles.previewSection}>
                            <div className={styles.previewHeader}>
                                <h2>Live Preview</h2>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button
                                        className={styles.saveBtn}
                                        onClick={saveResume}
                                        disabled={isSaving || !resumeData.personalInfo.fullName || !resumeData.personalInfo.email}
                                    >
                                        {isSaving ? <FaSpinner className="fa-spin" /> : <FaSave />}
                                        {isSaving ? ' Saving...' : savedResumeId ? ' Update Resume' : ' Save Resume'}
                                    </button>
                                    <button className={styles.downloadBtn} onClick={handlePrint}><FaDownload /> Download PDF</button>
                                </div>
                            </div>

                            {showShareLink && savedResumeId && (
                                <div className={styles.shareLinkBox}>
                                    <p><strong>✓ Resume saved successfully!</strong></p>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                                        <input
                                            type="text"
                                            value={`${window.location.origin}/resume-builder/${savedResumeId}`}
                                            readOnly
                                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                                        />
                                        <button onClick={copyShareLink} className={styles.copyLinkBtn}>
                                            <FaLink /> Copy Link
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className={styles.resumePreview}>
                                <SelectedTemplateComponent data={resumeData} accentColor={accentColor} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden Printable Component */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                <div ref={componentRef}>
                    <SelectedTemplateComponent data={resumeData} accentColor={accentColor} />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ResumeBuilder;
