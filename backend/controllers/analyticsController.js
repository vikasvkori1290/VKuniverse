const Project = require('../models/Project');
const Message = require('../models/Message');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        // Run queries in parallel for performance
        const [
            totalProjects,
            totalMessages,
            unreadMessages,
            recentMessages,
            recentProjects
        ] = await Promise.all([
            Project.countDocuments({}),
            Message.countDocuments({}),
            Message.countDocuments({ isRead: false }),
            Message.find().sort({ createdAt: -1 }).limit(5),
            Project.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt images')
        ]);

        res.json({
            stats: {
                projects: totalProjects,
                messages: totalMessages,
                unreadMessages
            },
            recentActivity: {
                messages: recentMessages,
                projects: recentProjects
            }
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
};

module.exports = {
    getDashboardStats
};
