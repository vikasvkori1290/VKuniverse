const mongoose = require('mongoose');

const achievementSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
    },
    category: {
        type: String,
    },
    image: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Achievement', achievementSchema);
