const express = require('express');
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/skills', require('./routes/skills'));

// Upload Routes
const { upload, compressImage } = require('./middleware/upload');

// Single image upload
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        const filePath = req.file.path;
        await compressImage(filePath);
        res.send(`/${filePath.replace(/\\/g, '/')}`);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image' });
    }
});

// Multiple images upload
app.post('/api/upload-multiple', upload.array('images', 10), async (req, res) => {
    try {
        const uploadedFiles = [];

        for (const file of req.files) {
            await compressImage(file.path);
            uploadedFiles.push({
                url: `/${file.path.replace(/\\/g, '/')}`,
                order: uploadedFiles.length
            });
        }

        res.json(uploadedFiles);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading images' });
    }
});

// Error Handler
// app.use(errorHandler); // Will create next

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
