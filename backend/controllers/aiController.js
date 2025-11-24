const { enhanceSummary, enhanceDescription } = require('../services/geminiService');

// @desc    Enhance content using AI
// @route   POST /api/ai/enhance
// @access  Public
const enhanceContent = async (req, res) => {
    try {
        const { text, type } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Text is required',
            });
        }

        if (!type) {
            return res.status(400).json({
                success: false,
                message: 'Type is required (summary, experience, project, or internship)',
            });
        }

        let enhancedText;

        if (type === 'summary') {
            enhancedText = await enhanceSummary(text);
        } else if (['experience', 'project', 'internship'].includes(type)) {
            enhancedText = await enhanceDescription(text, type);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid type. Must be: summary, experience, project, or internship',
            });
        }

        res.status(200).json({
            success: true,
            data: {
                original: text,
                enhanced: enhancedText,
            },
        });
    } catch (error) {
        console.error('AI Enhancement Error:', error);

        // Handle specific error cases
        if (error.message.includes('API key')) {
            return res.status(500).json({
                success: false,
                message: 'AI service configuration error. Please contact support.',
            });
        }

        if (error.message.includes('quota') || error.message.includes('rate limit')) {
            return res.status(429).json({
                success: false,
                message: 'AI service is busy. Please try again in a moment.',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to enhance content. Please try again.',
        });
    }
};

module.exports = {
    enhanceContent,
};
