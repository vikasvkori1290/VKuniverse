const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware'); // Need to create this

dotenv.config();

connectDB();

const app = express();

// Set security HTTP headers via Helmet
app.use(helmet({
    contentSecurityPolicy: false
}));

// Rate limit submissions to the contact form messages route
const messageLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 submissions per 15 mins
    message: { message: 'Too many messages sent from this IP, please try again after 15 minutes.' }
});

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or postman)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000'
        ];
        
        if (process.env.FRONTEND_URL) {
            process.env.FRONTEND_URL.split(',').forEach(url => allowedOrigins.push(url.trim()));
        }

        // Check if origin is allowed
        const isAllowed = allowedOrigins.includes(origin) ||
                          origin.endsWith('.vercel.app') ||
                          origin.endsWith('.netlify.app') ||
                          /localhost(:\d+)?$/.test(origin) ||
                          origin.includes('vercel.app') ||
                          origin.includes('netlify.app');

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from uploads


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/messages', messageLimiter, require('./routes/messages'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/leetcode', require('./routes/leetcode'));

// Upload Routes
const { upload, videoUpload, compressImage } = require('./middleware/upload');
const { protect } = require('./middleware/auth');

// Single image upload
// Single image upload
app.post('/api/upload', protect, upload.single('image'), async (req, res) => {
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
app.post('/api/upload-multiple', protect, upload.array('images', 10), async (req, res) => {
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
app.post('/api/upload-video', protect, videoUpload.single('video'), async (req, res) => {
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

// app.listen call removed to correct duplicate server start

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
// Start the interval
// setInterval(keepAlive, 10 * 60 * 1000); // 10 minutes - Disabled for Vercel Serverless

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
