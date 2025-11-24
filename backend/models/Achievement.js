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
    images: [{
        url: {
            type: String,
            required: false, // Made optional so achievements can be created without images
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
    collageLayout: {
        type: String,
        enum: ['grid', 'masonry', 'single'],
        default: 'grid',
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Achievement', achievementSchema);
