const Resume = require('../models/Resume');

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Public
const createResume = async (req, res) => {
    try {
        const resume = await Resume.create(req.body);
        res.status(201).json({
            success: true,
            id: resume._id,
            message: 'Resume saved successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get resume by ID
// @route   GET /api/resumes/:id
// @access  Public
const getResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        res.status(200).json({
            success: true,
            data: resume,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Public
const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        const updatedResume = await Resume.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedResume,
            message: 'Resume updated successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Public
const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        await resume.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Resume deleted successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createResume,
    getResume,
    updateResume,
    deleteResume,
};
