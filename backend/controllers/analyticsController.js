const Project = require('../models/Project');
const Message = require('../models/Message');
const GlobalStat = require('../models/GlobalStat');
const BlogPost = require('../models/BlogPost');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
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

// @desc    Delete all likes by a user name across projects and blogs
// @route   DELETE /api/analytics/likes/user/:name
// @access  Private (Admin)
const deleteUserLikes = async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) return res.status(400).json({ error: 'Name is required' });

        const targetName = name.trim().toLowerCase();

        // 1. Update Projects
        const projects = await Project.find({ 'likedBy.name': { $regex: new RegExp(`^${targetName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
        for (const proj of projects) {
            proj.likedBy = (proj.likedBy || []).filter(item => item.name.trim().toLowerCase() !== targetName);
            proj.likes = proj.likedBy.length;
            await proj.save();
        }

        // 2. Update Blogs
        const blogs = await BlogPost.find({ 'likedBy.name': { $regex: new RegExp(`^${targetName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
        for (const blog of blogs) {
            blog.likedBy = (blog.likedBy || []).filter(item => item.name.trim().toLowerCase() !== targetName);
            blog.likes = blog.likedBy.length;
            await blog.save();
        }

        res.json({
            success: true,
            message: `Successfully removed all likes by "${name}"`
        });
    } catch (error) {
        console.error('Delete User Likes Error:', error);
        res.status(500).json({ error: 'Failed to delete user likes' });
    }
};

// @desc    Delete a specific like on a project or blog post
// @route   DELETE /api/analytics/likes/single
// @access  Private (Admin)
const deleteSingleLike = async (req, res) => {
    try {
        const { type, itemId, name } = req.body;
        if (!type || !itemId || !name) {
            return res.status(400).json({ error: 'Type, itemId, and name are required' });
        }

        const targetName = name.trim().toLowerCase();

        if (type.toLowerCase() === 'project') {
            const project = await Project.findById(itemId);
            if (!project) return res.status(404).json({ error: 'Project not found' });

            project.likedBy = (project.likedBy || []).filter(
                item => item.name.trim().toLowerCase() !== targetName
            );
            project.likes = project.likedBy.length;
            await project.save();

            return res.json({ success: true, message: `Removed like from ${project.title}` });
        } else if (type.toLowerCase() === 'blog' || type.toLowerCase() === 'blog article') {
            const blog = await BlogPost.findById(itemId);
            if (!blog) return res.status(404).json({ error: 'Blog not found' });

            blog.likedBy = (blog.likedBy || []).filter(
                item => item.name.trim().toLowerCase() !== targetName
            );
            blog.likes = blog.likedBy.length;
            await blog.save();

            return res.json({ success: true, message: `Removed like from ${blog.title}` });
        }

        res.status(400).json({ error: 'Invalid type specified' });
    } catch (error) {
        console.error('Delete Single Like Error:', error);
        res.status(500).json({ error: 'Failed to remove like' });
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
    deleteUserLikes,
    deleteSingleLike,
    trackDsaDownload,
};
