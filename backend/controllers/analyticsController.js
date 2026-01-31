const Project = require('../models/Project');
const Message = require('../models/Message');
const GlobalStat = require('../models/GlobalStat');

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
            recentProjects,
            dsaStats
        ] = await Promise.all([
            Project.countDocuments({}),
            Message.countDocuments({}),
            Message.countDocuments({ isRead: false }),
            Message.find().sort({ createdAt: -1 }).limit(5),
            Project.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt images'),
            GlobalStat.findOne({ key: 'dsa_pdf_download' })
        ]);

        res.json({
            stats: {
                projects: totalProjects,
                messages: totalMessages,
                unreadMessages,
                dsaDownloads: dsaStats ? dsaStats.value : 0
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

// @desc    Track DSA PDF download
// @route   POST /api/analytics/track-dsa
// @access  Public
const trackDsaDownload = async (req, res) => {
    try {
        const stat = await GlobalStat.findOneAndUpdate(
            { key: 'dsa_pdf_download' },
            { $inc: { value: 1 }, lastUpdated: Date.now() },
            { new: true, upsert: true }
        );
        res.json({ success: true, count: stat.value });
    } catch (error) {
        console.error('Tracking Error:', error);
        res.status(500).json({ message: 'Error tracking download' });
    }
};

module.exports = {
    getDashboardStats,
    trackDsaDownload
};
