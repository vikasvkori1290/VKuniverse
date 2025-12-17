const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware'); // Need to create this

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from uploads


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api/ai', require('./routes/ai'));

// Upload Routes
const { upload, videoUpload, compressImage } = require('./middleware/upload');

// Single image upload
// Single image upload
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        const filePath = req.file.path;
        await compressImage(filePath);
        res.send(filePath);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image' });
    }
});

// Multiple images upload
// Multiple images upload
app.post('/api/upload-multiple', upload.array('images', 10), async (req, res) => {
    try {
        const uploadedFiles = [];

        for (const file of req.files) {
            await compressImage(file.path);
            uploadedFiles.push({
                url: file.path,
                order: uploadedFiles.length
            });
        }

        res.json(uploadedFiles);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading images' });
    }
});

// Video upload
app.post('/api/upload-video', videoUpload.single('video'), async (req, res) => {
    try {
        const filePath = req.file.path;
        // No compression for now, just return path
        res.send(filePath);
    } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({ message: 'Error uploading video' });
    }
});

// Error Handler
app.use(errorHandler);


// Health Check / Ping Route for Uptime Monitoring
app.get('/ping', (req, res) => {
    res.status(200).send('Pong');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Keep-Alive Mechanism for Render Free Tier
// Pings the server every 10 minutes (600,000 ms) to prevent it from spinning down (15 min inactivity limit)
const keepAlive = () => {
    const url = process.env.RENDER_EXTERNAL_URL
        ? `${process.env.RENDER_EXTERNAL_URL}/ping`
        : `http://localhost:${PORT}/ping`;

    axios.get(url)
        .then(() => console.log(`Keep-Alive Ping successful to ${url}`))
        .catch(err => console.error(`Keep-Alive Ping failed: ${err.message}`));
};

// Start the interval
setInterval(keepAlive, 10 * 60 * 1000); // 10 minutes
