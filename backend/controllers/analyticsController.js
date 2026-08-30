const Project = require('../models/Project');
const Message = require('../models/Message');
const GlobalStat = require('../models/GlobalStat');
const BlogPost = require('../models/BlogPost');

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

// @desc    Get detailed likes analytics by user and section
// @route   GET /api/analytics/likes
// @access  Private (Admin)
const getLikesAnalytics = async (req, res) => {
    try {
        const [projects, blogs] = await Promise.all([
            Project.find({}, 'title likes likedBy status createdAt'),
            BlogPost.find({}, 'title slug likes likedBy published createdAt')
        ]);

        let totalProjectLikes = 0;
        let totalBlogLikes = 0;
        const usersMap = {};

        // Process projects
        projects.forEach((proj) => {
            totalProjectLikes += proj.likes || 0;
            if (proj.likedBy && Array.isArray(proj.likedBy)) {
                proj.likedBy.forEach((like) => {
                    if (!like.name) return;
                    const key = like.name.trim().toLowerCase();
                    if (!usersMap[key]) {
                        usersMap[key] = {
                            name: like.name.trim(),
                            totalLikes: 0,
                            projectLikes: 0,
                            blogLikes: 0,
                            likedItems: [],
                            firstLikedAt: like.date || proj.createdAt,
                            lastLikedAt: like.date || proj.createdAt
                        };
                    }
                    usersMap[key].totalLikes += 1;
                    usersMap[key].projectLikes += 1;
                    usersMap[key].likedItems.push({
                        type: 'Project',
                        title: proj.title,
                        id: proj._id,
                        date: like.date || proj.createdAt
                    });
                    if (like.date && new Date(like.date) > new Date(usersMap[key].lastLikedAt)) {
                        usersMap[key].lastLikedAt = like.date;
                    }
                });
            }
        });

        // Process blogs
        blogs.forEach((blog) => {
            totalBlogLikes += blog.likes || 0;
            if (blog.likedBy && Array.isArray(blog.likedBy)) {
                blog.likedBy.forEach((like) => {
                    if (!like.name) return;
                    const key = like.name.trim().toLowerCase();
                    if (!usersMap[key]) {
                        usersMap[key] = {
                            name: like.name.trim(),
                            totalLikes: 0,
                            projectLikes: 0,
                            blogLikes: 0,
                            likedItems: [],
                            firstLikedAt: like.date || blog.createdAt,
                            lastLikedAt: like.date || blog.createdAt
                        };
                    }
                    usersMap[key].totalLikes += 1;
                    usersMap[key].blogLikes += 1;
                    usersMap[key].likedItems.push({
                        type: 'Blog Article',
                        title: blog.title,
                        id: blog._id,
                        slug: blog.slug,
                        date: like.date || blog.createdAt
                    });
                    if (like.date && new Date(like.date) > new Date(usersMap[key].lastLikedAt)) {
                        usersMap[key].lastLikedAt = like.date;
                    }
                });
            }
        });

        // Convert usersMap to sorted array
        const supporters = Object.values(usersMap).sort((a, b) => b.totalLikes - a.totalLikes);

        res.json({
            summary: {
                totalLikes: totalProjectLikes + totalBlogLikes,
                projectLikes: totalProjectLikes,
                blogLikes: totalBlogLikes,
                uniqueSupporters: supporters.length
            },
            supporters,
            projects: projects.map(p => ({
                id: p._id,
                title: p.title,
                likes: p.likes || 0,
                likedBy: p.likedBy || []
            })),
            blogs: blogs.map(b => ({
                id: b._id,
                title: b.title,
                slug: b.slug,
                likes: b.likes || 0,
                likedBy: b.likedBy || []
            }))
        });
    } catch (error) {
        console.error('Likes Analytics Error:', error);
        res.status(500).json({ message: 'Error fetching likes analytics' });
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
    getLikesAnalytics,
    trackDsaDownload,
};
