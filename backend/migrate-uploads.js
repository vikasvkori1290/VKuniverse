require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Import Models
const Project = require('./models/Project');
const Achievement = require('./models/Achievement');
const BlogPost = require('./models/BlogPost');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Helper function to upload file
async function uploadToCloudinary(filePath, folder) {
    if (!filePath) return null;

    // If already a Cloudinary URL or external URL, skip
    if (filePath.startsWith('http')) {
        console.log(`Skipping already remote URL: ${filePath}`);
        return filePath;
    }

    // Clean up path to get filename
    const filename = filePath.split('/').pop().split('\\').pop(); // Handle both / and \
    const localPath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(localPath)) {
        console.warn(`File not found locally: ${localPath} (Original path: ${filePath})`);
        return filePath; // Keep original if file not found
    }

    try {
        console.log(`Uploading ${filename} to ${folder}...`);

        // Determine resource type based on extension
        const isVideo = filename.match(/\.(mp4|webm|ogg)$/i);
        const resourceType = isVideo ? 'video' : 'image';

        const result = await cloudinary.uploader.upload(localPath, {
            folder: folder,
            resource_type: resourceType,
            use_filename: true,
            unique_filename: false
        });

        console.log(`Uploaded! New URL: ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error(`Upload failed for ${filename}:`, error.message);
        return filePath;
    }
}

async function migrateProjects() {
    console.log('\n--- Migrating Projects ---');
    const projects = await Project.find();

    for (const project of projects) {
        let modified = false;
        console.log(`Processing Project: ${project.title}`);

        // Migrate Video
        if (project.video && !project.video.startsWith('http')) {
            const newUrl = await uploadToCloudinary(project.video, 'vk_portfolio/videos');
            if (newUrl !== project.video) {
                project.video = newUrl;
                modified = true;
            }
        }

        // Migrate Screenshots
        if (project.screenshots && project.screenshots.length > 0) {
            for (let i = 0; i < project.screenshots.length; i++) {
                if (!project.screenshots[i].startsWith('http')) {
                    const newUrl = await uploadToCloudinary(project.screenshots[i], 'vk_portfolio/images');
                    if (newUrl !== project.screenshots[i]) {
                        project.screenshots[i] = newUrl;
                        modified = true;
                    }
                }
            }
        }

        // Migrate Images
        if (project.images && project.images.length > 0) {
            // Handle array of strings (legacy) or objects
            for (let i = 0; i < project.images.length; i++) {
                const img = project.images[i];

                if (typeof img === 'string') {
                    // Legacy format
                    if (!img.startsWith('http')) {
                        const newUrl = await uploadToCloudinary(img, 'vk_portfolio/images');
                        if (newUrl !== img) {
                            project.images[i] = newUrl; // Note: Schema expects object, this might need schema update or conversion
                            // Let's convert to object to match schema
                            project.images[i] = { url: newUrl, isThumbnail: i === 0, order: i };
                            modified = true;
                        }
                    }
                } else if (img.url && !img.url.startsWith('http')) {
                    // Object format
                    const newUrl = await uploadToCloudinary(img.url, 'vk_portfolio/images');
                    if (newUrl !== img.url) {
                        project.images[i].url = newUrl;
                        modified = true;
                    }
                }
            }
        }

        if (modified) {
            await project.save();
            console.log(`Saved updates for project: ${project.title}`);
        }
    }
}

async function migrateAchievements() {
    console.log('\n--- Migrating Achievements ---');
    const achievements = await Achievement.find();

    for (const achievement of achievements) {
        let modified = false;
        console.log(`Processing Achievement: ${achievement.title}`);

        if (achievement.images && achievement.images.length > 0) {
            for (let i = 0; i < achievement.images.length; i++) {
                const img = achievement.images[i];
                if (img.url && !img.url.startsWith('http')) {
                    const newUrl = await uploadToCloudinary(img.url, 'vk_portfolio/images');
                    if (newUrl !== img.url) {
                        achievement.images[i].url = newUrl;
                        modified = true;
                    }
                }
            }
        }

        if (modified) {
            await achievement.save();
            console.log(`Saved updates for achievement: ${achievement.title}`);
        }
    }
}

async function migrateBlogPosts() {
    console.log('\n--- Migrating Blog Posts ---');
    const posts = await BlogPost.find();

    for (const post of posts) {
        let modified = false;
        console.log(`Processing Post: ${post.title}`);

        if (post.coverImage && !post.coverImage.startsWith('http')) {
            const newUrl = await uploadToCloudinary(post.coverImage, 'vk_portfolio/images');
            if (newUrl !== post.coverImage) {
                post.coverImage = newUrl;
                modified = true;
            }
        }

        if (modified) {
            await post.save();
            console.log(`Saved updates for post: ${post.title}`);
        }
    }
}

async function runMigration() {
    try {
        await migrateProjects();
        await migrateAchievements();
        await migrateBlogPosts();
        console.log('\n--- Migration Complete ---');
        process.exit(0);
    } catch (error) {
        console.error('Migration Failed:', error);
        process.exit(1);
    }
}

runMigration();
