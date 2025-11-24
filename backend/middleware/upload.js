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
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1920, height: 1080, crop: 'limit' }] // Resize large images
    },
});

// Video Storage Engine
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vk_portfolio/videos',
        allowed_formats: ['mp4', 'webm', 'ogg'],
        resource_type: 'video'
    },
});

// File Filter for Images
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only (jpg, jpeg, png, webp)!');
    }
}

// File Filter for Videos
function checkVideoType(file, cb) {
    const filetypes = /mp4|webm|ogg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Videos only (mp4, webm, ogg)!');
    }
}

// Initialize Upload Middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: function (req, file, cb) {
        checkVideoType(file, cb);
    },
});

// Helper functions (No longer needed for Cloudinary but kept for compatibility if imported elsewhere)
// These now just return the path/url as Cloudinary handles optimization
async function compressImage(filePath) {
    return filePath;
}

async function generateThumbnail(filePath) {
    // Cloudinary can generate thumbnails on the fly using URL transformations
    // We can just return the original URL or append transformation parameters
    return filePath;
}

module.exports = {
    upload,
    videoUpload,
    compressImage,
    generateThumbnail
};
