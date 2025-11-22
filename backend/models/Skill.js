const mongoose = require('mongoose');

const skillSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String, // e.g., Frontend, Backend, Tools
        required: true,
    },
    proficiency: {
        type: Number, // 0-100
        min: 0,
        max: 100,
    },
    icon: {
        type: String, // URL or icon class
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Skill', skillSchema);
