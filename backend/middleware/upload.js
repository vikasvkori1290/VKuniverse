const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

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

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// Video Upload Configuration
const videoStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

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

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: function (req, file, cb) {
        checkVideoType(file, cb);
    },
});

/**
 * Middleware to compress uploaded images
 */
async function compressImage(filePath) {
    try {
        const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '-compressed.jpg');

        await sharp(filePath)
            .resize(1920, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .jpeg({ quality: 85 })
            .toFile(outputPath);

        // Replace original with compressed
        await fs.unlink(filePath);
        await fs.rename(outputPath, filePath);

        return filePath;
    } catch (error) {
        console.error('Error compressing image:', error);
        return filePath; // Return original if compression fails
    }
}

/**
 * Middleware to generate thumbnail
 */
async function generateThumbnail(filePath) {
    try {
        const thumbnailPath = filePath.replace(/(\.[^.]+)$/, '-thumb$1');

        await sharp(filePath)
            .resize(400, 400, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);

        return thumbnailPath;
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        return null;
    }
}


module.exports = {
    upload,
    videoUpload,
    compressImage,
    generateThumbnail
};
