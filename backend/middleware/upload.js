const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Image Storage Engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vk_portfolio/images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 1920, height: 1080, crop: 'limit' }] // Resize large images
    },
});

// Video Storage Engine
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const cleanName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9]/g, '_');
        return {
            folder: 'vk_portfolio/videos',
            resource_type: 'video',
            public_id: `${Date.now()}_${cleanName}`
        };
    },
});

// File Filter for Images
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('image/') || filetypes.test(file.mimetype);

    if (extname || mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only (jpg, jpeg, png, webp, gif)!'));
    }
}

// File Filter for Videos
function checkVideoType(file, cb) {
    const filetypes = /mp4|webm|ogg|mov|quicktime|mkv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('video/') || filetypes.test(file.mimetype);

    if (extname || mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Videos only (mp4, webm, ogg, mov)!'));
    }
}

// Initialize Upload Middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for images
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit for videos
    },
    fileFilter: function (req, file, cb) {
        checkVideoType(file, cb);
    },
});

// Helper functions (kept for compatibility)
async function compressImage(filePath) {
    return filePath;
}

async function generateThumbnail(filePath) {
    return filePath;
}

module.exports = {
    upload,
    videoUpload,
    compressImage,
    generateThumbnail
};
