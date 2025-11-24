const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    video: {
        type: String, // URL to the video file
    },
    techStack: [{
        type: String,
    }],
    liveLink: {
        type: String,
    },
    liveDemoUrl: {
        type: String,
    },
    githubLink: {
        type: String,
    },
    sourceCodeUrl: {
        type: String,
    },
    screenshots: [{
        type: String,
    }],
    images: [{
        url: {
            type: String,
            required: true,
        },
        isThumbnail: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        }
    }],
    status: {
        type: String,
        enum: ['completed', 'in-progress'],
        default: 'completed',
    },
    isPublished: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
