const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    personalInfo: {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        linkedin: {
            type: String,
        },
        github: {
            type: String,
        },
        website: {
            type: String,
        },
        summary: {
            type: String,
        },
        photo: {
            type: String, // URL or base64
        }
    },
    experience: [{
        company: String,
        role: String,
        duration: String,
        description: String,
    }],
    education: [{
        institution: String,
        degree: String,
        year: String,
    }],
    projects: [{
        name: String,
        techStack: String,
        link: String,
        description: String,
    }],
    internships: [{
        company: String,
        role: String,
        duration: String,
        description: String,
    }],
    skills: {
        type: String, // Comma-separated
    },
    selectedTemplate: {
        type: String,
        default: 'modern',
    },
    accentColor: {
        type: String,
        default: '#3b82f6',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Resume', resumeSchema);
